import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { midi } from '@/shared/lib/music'
import { stubScrolling } from '@/shared/test/layout'

const chordName = () => screen.getByRole('heading', { level: 2 })

describe('Practice → Chord finder', () => {
  it('names the keys tapped, kept in the URL', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/chords/find')
    expect(await screen.findByText('Choose the keys of a chord.')).toBeInTheDocument()
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    for (const key of ['C4', 'E4', 'G4']) {
      await user.click(within(keyboard).getByRole('button', { name: key }))
    }
    expect(chordName()).toHaveTextContent('C')
    // Said as it changes, while the focus stays on the keys.
    expect(screen.getByRole('status')).toHaveTextContent('C · Major triad')
    expect(router.state.location.search).toEqual({ keys: '60-64-67' })
    expect(within(keyboard).getByRole('button', { name: 'E4' })).toHaveTextContent('3')
  })

  it('keeps the keys still under a tap outside the middle octaves (ADR 0009)', async () => {
    const user = userEvent.setup()
    const { scrolls } = stubScrolling({ clientWidth: 390, scrollWidth: 52 * 28 })
    await renderApp('/practice/chords/find')
    const keyboard = await screen.findByRole('group', { name: 'Keyboard' })
    const before = scrolls.length
    await user.click(within(keyboard).getByRole('button', { name: 'B3' }))
    expect(chordName()).toHaveTextContent('B')
    expect(scrolls).toHaveLength(before)
  })

  it('names the root position first, and what else the notes can be', async () => {
    await renderApp('/practice/chords/find?keys=60-64-67-69')
    expect(await screen.findByRole('heading', { level: 2, name: 'C6' })).toBeInTheDocument()
    expect(screen.getByText('Also: Am7/C')).toBeInTheDocument()
  })

  it('names a shell, and says the tones it leaves out', async () => {
    await renderApp('/practice/chords/find?keys=48-64-70-81')
    expect(await screen.findByRole('heading', { level: 2, name: 'C13' })).toBeInTheDocument()
    expect(screen.getByText('Dominant 13th · No 5th · No 9th')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('C13 · Dominant 13th · No 5th · No 9th')
  })

  it('names an inversion as a slash chord, and opens it in Chords', async () => {
    await renderApp('/practice/chords/find?keys=64-67-72')
    expect(await screen.findByRole('heading', { level: 2, name: 'C/E' })).toBeInTheDocument()
    const open = screen.getByRole('link', { name: 'Open in Chords' }).getAttribute('href') ?? ''
    expect(open).toMatch(/^\/practice\/chords\?/)
    expect(open).toMatch(/[?&]inversion=1(&|$)/)
  })

  it('names two keys’ interval, and says so when no chord is named', async () => {
    await renderApp('/practice/chords/find?keys=60-64')
    expect(
      await screen.findByRole('heading', { level: 2, name: 'Major third' }),
    ).toBeInTheDocument()
  })

  it('says so when no chord is named by the notes', async () => {
    await renderApp('/practice/chords/find?keys=60-61-62')
    expect(await screen.findByRole('status')).toHaveTextContent('No chord is named by these notes.')
    expect(screen.getAllByText('No chord is named by these notes.')).toHaveLength(2)
  })

  it('names the keys a MIDI keyboard holds, while it holds them', async () => {
    const { midi: keyboard } = await renderApp('/practice/chords/find')
    await screen.findByText('Choose the keys of a chord.')
    act(() => {
      for (const key of [62, 66, 69]) keyboard.press(midi(key))
    })
    expect(await screen.findByRole('heading', { level: 2, name: 'D' })).toBeInTheDocument()
  })

  it('plays the chord, and clears the keys', async () => {
    const user = userEvent.setup()
    const { audio, router } = await renderApp('/practice/chords/find?keys=60-64-67')
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    expect(
      (audio.played.at(-1)?.sounds ?? []).flatMap((sound) =>
        sound.kind === 'note' ? [sound.midi] : [],
      ),
    ).toEqual([60, 64, 67])
    await user.click(screen.getByRole('button', { name: 'Clear' }))
    expect(router.state.location.search).toEqual({})
    expect(await screen.findByText('Choose the keys of a chord.')).toBeInTheDocument()
  })

  it('is Chords’ second tab, the one page shown', async () => {
    await renderApp('/practice/chords/find?keys=60.64.67')
    expect(await screen.findByRole('heading', { level: 1, name: 'Chords' })).toBeInTheDocument()
    const tabs = within(screen.getByRole('navigation', { name: 'Chords' })).getAllByRole('link')
    expect(tabs.map((tab) => [tab.textContent, tab.getAttribute('aria-current')])).toEqual([
      ['Build', null],
      ['Find', 'page'],
    ])
  })

  it('speaks Russian', async () => {
    await renderApp('/practice/chords/find', { locale: 'ru' })
    expect(await screen.findByRole('link', { name: 'Найти' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(screen.getByText('Выберите клавиши аккорда.')).toBeInTheDocument()
  })
})
