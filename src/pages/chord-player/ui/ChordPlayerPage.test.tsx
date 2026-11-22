import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

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
/** The toast's Undo, beside the bar's own. */
const toastUndo = () =>
  within(screen.getByRole('region', { name: 'Notifications' })).getByRole('button', {
    name: 'Undo',
  })

describe('the Chord player', () => {
  it('opens a progression from the URL as one Verse, a chord a bar', async () => {
    await open()
    await waitFor(() => expect(boxes()).toEqual(['C, 4 beats', 'G, 4 beats']))
    expect(screen.getByRole('region', { name: 'Verse' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'Chord player' })).toBeInTheDocument()
  })
  it('a letter typed on a tile opens its sheet with the symbol begun', async () => {
    const user = userEvent.setup()
    await open()
    const c = await screen.findByRole('button', { name: /^C, 4 beats$/ })
    c.focus()
    await user.keyboard('F')
    const sheet = await screen.findByRole('dialog', { name: 'C' })
    const symbol = within(sheet).getByRole('textbox', { name: 'Chord symbol' })
    expect(symbol).toHaveValue('F')
    await user.type(symbol, 'm')
    await user.keyboard('{Escape}')
    expect(await screen.findByRole('button', { name: /^Fm, 4 beats$/ })).toHaveTextContent('Fm')
  })
  it('a tap chooses a tile and a second opens its sheet, where its length is set (R32)', async () => {
    const user = userEvent.setup()
    await open()
    const g = await screen.findByRole('button', { name: /^G, 4 beats$/ })
    await user.click(g)
    expect(g).toHaveAttribute('aria-pressed', 'true')
    await user.click(g)
    const sheet = await screen.findByRole('dialog', { name: 'G' })
    await user.click(within(sheet).getByRole('button', { name: 'Shorter' }))
    await user.keyboard('{Escape}')
    await waitFor(() => expect(boxes()).toEqual(['C, 4 beats', 'G, 3 beats']))
  })

  it('reads a flat typed as b in a symbol begun from the keys', async () => {
    const user = userEvent.setup()
    await open()
    ;(await screen.findByRole('button', { name: /^G, 4 beats$/ })).focus()
    await user.keyboard('B')
    const sheet = await screen.findByRole('dialog', { name: 'G' })
    await user.type(within(sheet).getByRole('textbox', { name: 'Chord symbol' }), 'bm7')
    await user.keyboard('{Escape}')
    await waitFor(() => expect(boxes()).toEqual(['C, 4 beats', 'B♭m7, 4 beats']))
  })

  it('Shift and an arrow shorten a focused tile by a beat, nothing else retimed, its bar marked', async () => {
    const user = userEvent.setup()
    await open()
    ;(await screen.findByRole('button', { name: /^C, 4 beats$/ })).focus()
    await user.keyboard('{Shift>}{ArrowLeft}{/Shift}')
    await waitFor(() => expect(boxes()).toEqual(['C, 3 beats', 'G, 4 beats']))
    // The bar of three beats in 4/4 carries the !.
    expect(screen.getByRole('button', { name: /^Bar 1 holds 3 beats, not 4/ })).toBeInTheDocument()
  })
  it('draws each section’s chords as equal tiles with an add tile, and no how-to sentence (R32)', async () => {
    await open()
    const verse = await screen.findByRole('region', { name: 'Verse' })
    expect(within(verse).getByRole('list', { name: 'Chords of Verse' })).toBeInTheDocument()
    expect(within(verse).getByRole('button', { name: 'Repeat' })).toHaveTextContent('× 1')
    expect(within(verse).getByRole('button', { name: 'Add a chord to Verse' })).toBeInTheDocument()
    expect(screen.queryByText(/No chords yet/)).toBeNull()
  })
  it('Backspace deletes a box and Undo puts it back', async () => {
    const user = userEvent.setup()
    await open()
    ;(await screen.findByRole('button', { name: /^G, 4 beats$/ })).focus()
    await user.keyboard('{Backspace}')
    await waitFor(() => expect(boxes()).toEqual(['C, 4 beats']))
    await toast(/Deleted G/)
    await user.click(toastUndo())
    await waitFor(() => expect(boxes()).toEqual(['C, 4 beats', 'G, 4 beats']))
  })
  it('Randomize fills the sections from the key, and Undo puts them back', async () => {
    const user = userEvent.setup()
    await open('/practice/chord-player?p=ii-V-I-vi&key=C')
    await screen.findByRole('button', { name: /^Dm, 4 beats$/ })
    await user.click(screen.getByRole('button', { name: 'Chord sheet' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Randomize chords' }))
    await toast(/New chords in C major/)
    // Four bars: home, a chord on its way, the dominant, home.
    const random = boxes()
    expect(random).toHaveLength(4)
    expect([random[0], random[2], random[3]]).toEqual(['C, 4 beats', 'G, 4 beats', 'C, 4 beats'])
    await user.click(toastUndo())
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
  it('Save as my chord sheet puts it first in the sheets, and an edit is its draft until saved', async () => {
    const user = userEvent.setup()
    const { chordSheetsStore } = await open()
    await screen.findByRole('button', { name: /^C, 4 beats$/ })
    await user.click(screen.getByRole('button', { name: 'Chord sheet' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Save as my chord sheet…' }))
    // Named at first by its chords.
    const name = await screen.findByRole('textbox', { name: 'Name' })
    expect(name).toHaveValue('I – V')
    await user.clear(name)
    await user.type(name, 'Sunday')
    await user.click(screen.getByRole('button', { name: 'Save' }))
    await waitFor(() => expect(chordSheetsStore.getState().mine[0]?.name).toBe('Sunday'))
    await user.click(await screen.findByRole('button', { name: /Chord sheet: Sunday/ }))
    // The sheets menu lists it first, over the one it was made from.
    const sheets = await screen.findByRole('menu', { name: 'Chord sheets' })
    expect(sheets).toHaveTextContent(/^Sunday\s*I – V/)
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
    ;(await screen.findByRole('button', { name: /^G, 4 beats$/ })).focus()
    await user.keyboard('{Backspace}')
    await waitFor(() => expect(boxes()).toEqual(['C, 4 beats']))
    // The edit is kept as its draft until Save makes it the sheet's chords.
    await waitFor(() =>
      expect(chordSheetsStore.getState().mine[0]).toMatchObject({
        text: 'C 4/4; verse: C | G',
        draft: 'C 4/4; verse: C',
      }),
    )
    await user.click(screen.getByRole('button', { name: 'Chord sheet' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Save' }))
    expect(chordSheetsStore.getState().mine[0]).toMatchObject({
      text: 'C 4/4; verse: C',
      draft: null,
    })
  })
})
