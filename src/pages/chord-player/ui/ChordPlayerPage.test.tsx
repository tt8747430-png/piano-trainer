import { act, fireEvent, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { stubBox } from '@/shared/test/layout'

/** The transport's clock ticks in a Worker, which jsdom has not: one the test ticks by hand. */
let workers: { onmessage: (() => void) | null }[] = []
const tick = () => act(() => workers.forEach((worker) => worker.onmessage?.()))
beforeEach(() => {
  workers = []
  vi.stubGlobal(
    'Worker',
    class {
      onmessage: (() => void) | null = null
      constructor() {
        workers.push(this)
      }
      terminate() {}
    },
  )
  vi.stubGlobal('URL', Object.assign(URL, { createObjectURL: () => 'blob:', revokeObjectURL() {} }))
})

const open = (path = '/practice/chord-player?p=I-V&key=C') => renderApp(path)
const box = (label: RegExp) => screen.getByRole('button', { name: label })
const boxes = () =>
  screen
    .queryAllByRole('button', { name: /, \d+ beats$/ })
    .map((each) => each.getAttribute('aria-label'))
const toast = (text: RegExp) => screen.findByText(text)

describe('the Chord player', () => {
  it('opens a progression from the URL as one Verse, a chord a bar', async () => {
    await open()
    await waitFor(() => expect(boxes()).toEqual(['C, 4 beats', 'G, 4 beats']))
    expect(screen.getByRole('region', { name: 'Verse' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'Chord player' })).toBeInTheDocument()
  })
  it('typing Fm in a box and Enter shows Fm with iv and away, a flat typed as b read as ♭', async () => {
    const user = userEvent.setup()
    await open()
    const c = await screen.findByRole('button', { name: /^C, 4 beats$/ })
    c.focus()
    await user.keyboard('F')
    await user.type(screen.getByRole('textbox', { name: 'Chord' }), 'm{Enter}')
    const typed = await screen.findByRole('button', { name: /^Fm, 4 beats$/ })
    expect(typed).toHaveTextContent('iv · away')
    ;(await screen.findByRole('button', { name: /^G, 4 beats$/ })).focus()
    await user.keyboard('B')
    await user.type(screen.getByRole('textbox', { name: 'Chord' }), 'bm7{Enter}')
    expect(await screen.findByRole('button', { name: /^B♭m7, 4 beats$/ })).toHaveTextContent('B♭m7')
  })
  it('dragging a box’s edge back by a beat makes it 3 beats', async () => {
    await open()
    const c = await screen.findByRole('button', { name: /^C, 4 beats$/ })
    const bar = c.closest('[data-bar]')
    if (!bar) throw new Error('no bar')
    stubBox(bar, { width: 400, height: 96 })
    const edge = c.querySelector('[data-edge]')
    if (!edge) throw new Error('no edge')
    fireEvent.pointerDown(edge, { button: 0, pointerId: 1, clientX: 400 })
    fireEvent.pointerMove(edge, { pointerId: 1, clientX: 300 })
    fireEvent.pointerUp(edge, { pointerId: 1, clientX: 300 })
    await waitFor(() => expect(boxes()).toEqual(['C, 3 beats', 'G, 5 beats']))
  })
  it('Backspace deletes a box and Undo puts it back', async () => {
    const user = userEvent.setup()
    await open()
    ;(await screen.findByRole('button', { name: /^G, 4 beats$/ })).focus()
    await user.keyboard('{Backspace}')
    await waitFor(() => expect(boxes()).toEqual(['C, 4 beats']))
    await toast(/Deleted G/)
    await user.click(screen.getByRole('button', { name: 'Undo' }))
    await waitFor(() => expect(boxes()).toEqual(['C, 4 beats', 'G, 4 beats']))
  })
  it('Randomize fills the sections from the key, and Undo puts them back', async () => {
    const user = userEvent.setup()
    await open('/practice/chord-player?p=ii-V-I-vi&key=C')
    await screen.findByRole('button', { name: /^Dm, 4 beats$/ })
    await user.click(screen.getByRole('button', { name: 'Randomize chords' }))
    await toast(/New chords in C major/)
    // Four bars: home, a chord on its way, the dominant, home.
    const random = boxes()
    expect(random).toHaveLength(4)
    expect([random[0], random[2], random[3]]).toEqual(['C, 4 beats', 'G, 4 beats', 'C, 4 beats'])
    await user.click(screen.getByRole('button', { name: 'Undo' }))
    await waitFor(() =>
      expect(boxes()).toEqual(['Dm, 4 beats', 'G, 4 beats', 'C, 4 beats', 'Am, 4 beats']),
    )
  })
  it('hides Add section at 12 sections', async () => {
    const user = userEvent.setup()
    await open()
    await screen.findByRole('button', { name: 'Add section' })
    for (let i = 1; i < 12; i++)
      await user.click(screen.getByRole('button', { name: 'Add section' }))
    expect(screen.getAllByRole('region', { name: 'Verse' })).toHaveLength(12)
    expect(screen.queryByRole('button', { name: 'Add section' })).toBeNull()
  })
  it('Space plays and stops', async () => {
    const user = userEvent.setup()
    const { audio } = await open()
    await screen.findByRole('button', { name: /^C, 4 beats$/ })
    ;(document.activeElement as HTMLElement | null)?.blur()
    await user.keyboard(' ')
    expect(audio.played.some((play) => play.sounds.some((sound) => sound.kind === 'drum'))).toBe(
      true,
    )
    expect(screen.getByRole('button', { name: 'Stop' })).toBeInTheDocument()
    await user.keyboard(' ')
    expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument()
  })
  it('the second box lights when its time comes', async () => {
    const user = userEvent.setup()
    const { audio } = await open()
    await screen.findByRole('button', { name: /^C, 4 beats$/ })
    await user.click(screen.getByRole('button', { name: 'Play' }))
    expect(box(/^C, 4 beats$/)).toHaveAttribute('aria-current', 'true')
    // A bar is 2.4 s at Pop 1's 100, after Play's 0.1 s: past it, the next tick lights G.
    act(() => audio.setNow(2.6))
    tick()
    expect(box(/^G, 4 beats$/)).toHaveAttribute('aria-current', 'true')
    expect(box(/^C, 4 beats$/)).not.toHaveAttribute('aria-current')
  })
  it('Save as my chord sheet puts it first in the Library, and an edit saves it', async () => {
    const user = userEvent.setup()
    const { chordSheetsStore } = await open()
    await screen.findByRole('button', { name: /^C, 4 beats$/ })
    await user.click(screen.getByRole('button', { name: 'Chord sheet' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Save as my chord sheet…' }))
    await user.type(await screen.findByRole('textbox', { name: 'Name' }), 'Sunday')
    await user.click(screen.getByRole('button', { name: 'Save' }))
    await waitFor(() => expect(chordSheetsStore.getState().mine[0]?.name).toBe('Sunday'))
    await user.click(await screen.findByRole('button', { name: /Chord sheet: Sunday/ }))
    const library = await screen.findByRole('dialog', { name: 'Chord sheets' })
    expect(within(library).getByRole('button', { name: 'Sunday' })).toBeInTheDocument()
    await user.keyboard('{Escape}')
    ;(await screen.findByRole('button', { name: /^G, 4 beats$/ })).focus()
    await user.keyboard('{Backspace}')
    await waitFor(() => expect(chordSheetsStore.getState().mine[0]?.text).toBe('C 4/4; verse: C'))
  })
})
