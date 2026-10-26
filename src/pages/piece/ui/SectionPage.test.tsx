import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { PIECES_STORAGE_KEY, PIECES_VERSION } from '@/entities/piece'
import { createMemoryStorage } from '@/shared/lib'
import { midi } from '@/shared/lib/music'

const DAY = '2026-10-25T10:00:00.000Z'

/** Opens a section's folded groups (ADR 0100, amended): its changes and its pattern. */
async function unfold() {
  await screen.findByRole('heading', { level: 1 })
  for (const name of [/^Changes$/, /^Pattern/, /^Переходы$/, /^Фактур/])
    for (const fold of screen.queryAllByRole('button', { name, expanded: false }))
      act(() => fold.click())
}

/** A group of lesson rows by its heading: each row's words and where it leads. */
const rowsOf = (group: string) =>
  within(screen.getByRole('region', { name: group }))
    .getAllByRole('link')
    .map((row) => [row.textContent, row.getAttribute('href')])

/** The icon a row's tile wears, by lucide's name. */
const tileIcon = (row: HTMLElement) =>
  [...(row.querySelector('[data-slot="row-tile"] svg')?.classList ?? [])].find(
    (name) => name.startsWith('lucide-') && name !== 'lucide-icon',
  )

/** An own song saved as the editor would keep it. */
function savedSong(song: object) {
  const storage = createMemoryStorage()
  storage.setItem(
    PIECES_STORAGE_KEY,
    JSON.stringify({
      state: {
        songs: [{ id: 'my-1', title: 'Morning', key: 'G', meter: '4/4', tempo: 80, ...song }],
        nextSong: 2,
      },
      version: PIECES_VERSION,
    }),
  )
  return storage
}

describe('a section’s page (ADR 0100)', () => {
  it('starts with its chords open, its changes and its pattern folded until asked for', async () => {
    await renderApp('/songs/bz5/sections/2')
    expect(await screen.findByRole('button', { name: 'Changes' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    expect(screen.queryByRole('link', { name: /^1st sequence/ })).toBeNull()
    expect(screen.getByRole('button', { name: /^Pattern/ })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })

  it('teaches the chorus: its card, its sequences, its changes one at a time, its pattern', async () => {
    await renderApp('/songs/bz5/sections/2')
    await unfold()
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Learn the Chorus' }),
    ).toBeInTheDocument()
    // The card: the song, the section's chords as they first sound, its lessons done.
    expect(screen.getByText('Still, my soul, be still')).toBeInTheDocument()
    expect(screen.getByText('Em · D/F♯ · G · Am · C · Dsus4 · D7 · D')).toBeInTheDocument()
    expect(screen.getByText('Lessons done: 0 of 20')).toBeInTheDocument()
    expect(
      within(screen.getByRole('region', { name: 'Chords' }))
        .getAllByRole('button')
        .map((row) => row.textContent),
    ).toEqual([
      'Learn Em',
      'Learn D/F♯',
      'Learn G',
      'Learn Am',
      'Learn C',
      'Learn Dsus4',
      'Learn D7',
      'Learn D',
    ])
    expect(screen.getByRole('heading', { level: 2, name: 'Changes' })).toBeInTheDocument()
    expect(rowsOf('Play the chords in time')).toEqual([
      ['1st sequence Em · D/F♯ · G · Am · Em · C · Dsus4 · D7', '/play/bz5?loop=9-12'],
      ['2nd sequence Em · D/F♯ · G · Am · Em · C · D', '/play/bz5?loop=13-16'],
      ['3rd sequence Em · C · D', '/play/bz5?loop=17-18'],
    ])
    expect(rowsOf('One change at a time').slice(0, 3)).toEqual([
      ['From Em to D/F♯ Bar 9', '/play/bz5?loop=9-9'],
      ['From D/F♯ to G Bars 9–10', '/play/bz5?loop=9-10'],
      ['From G to Am Bars 10–11', '/play/bz5?loop=10-11'],
    ])
    expect(rowsOf('Pattern')).toEqual([
      ['4 · Harmonic figuration On Em · Bar 9', '/play/bz5?loop=9-9'],
    ])
    // Every lesson's tile in the chorus's paint.
    const tiles = document.querySelectorAll('[data-slot="row-tile"]')
    expect(tiles.length).toBeGreaterThan(0)
    for (const tile of tiles) expect(tile).toHaveClass('bg-paint-grass')
  })

  it('says how many times a section of one run goes round, and loops one round', async () => {
    await renderApp('/songs/bz5/sections/1')
    await unfold()
    // The run as it goes round, its C held back to (as its whole-section row has it): not the
    // chords it has, each once.
    const [card] = await screen.findAllByText('G · C · Em · G/B · C · C/E · Dsus4 · D/F♯', {
      exact: false,
    })
    expect(card).toHaveTextContent('2 × G · C · Em · G/B · C · C/E · Dsus4 · D/F♯')
    expect(rowsOf('Play the chords in time')).toEqual([
      ['The whole section G · C · Em · G/B · C · C/E · Dsus4 · D/F♯', '/play/bz5?loop=1-4'],
    ])
    expect(screen.getByRole('link', { name: 'Practise' })).toHaveAttribute(
      'href',
      '/play/bz5?loop=1-8',
    )
  })

  it('checks a lesson once a pass over its bars is done, and opens the Player looping it', async () => {
    const user = userEvent.setup()
    const { progressStore, router } = await renderApp('/songs/bz5/sections/2')
    await unfold()
    const first = await screen.findByRole('link', { name: /^1st sequence/ })
    expect(tileIcon(first)).toBe('lucide-list-music')
    act(() => progressStore.setState({ lessons: { 'bz5:bars:9-12': DAY } }))
    expect(first).toHaveAccessibleName('1st sequence Em · D/F♯ · G · Am · Em · C · Dsus4 · D7 Done')
    expect(tileIcon(first)).toBe('lucide-check')
    expect(screen.getByText('Lessons done: 1 of 20')).toBeInTheDocument()
    await user.click(first)
    await waitFor(() => expect(router.state.location.pathname).toBe('/play/bz5'))
    expect(router.state.location.search).toMatchObject({ loop: '9-12' })
  })

  it('learns a chord played in its sheet, on a MIDI keyboard, and checks it', async () => {
    const user = userEvent.setup()
    const { midi: keyboard, progressStore } = await renderApp('/songs/bz5/sections/2')
    await unfold()
    const row = await screen.findByRole('button', { name: 'Learn Em' })
    expect(tileIcon(row)).toBe('lucide-piano')
    // It opens its sheet in place: no chevron, which says a row leads to a page.
    expect(row.querySelector('[data-slot="row-chevron"]')).not.toBeInTheDocument()
    expect(
      screen
        .getAllByRole('link', { name: /^1st sequence/ })[0]
        ?.querySelector('[data-slot="row-chevron"]'),
    ).toBeInTheDocument()
    await user.click(row)
    const sheet = await screen.findByRole('dialog', { name: 'Em chord' })
    expect(within(sheet).getByText('Play it on the keys')).toBeInTheDocument()
    // E minor's notes held together, in any octave.
    act(() => {
      for (const key of [52, 67, 71]) keyboard.press(midi(key))
    })
    expect(await within(sheet).findByText('That’s it.')).toBeInTheDocument()
    expect(Object.keys(progressStore.getState().lessons)).toEqual(['bz5:chord:Em'])
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(row).toHaveAccessibleName('Learn Em Done')
    expect(tileIcon(row)).toBe('lucide-check')
    expect(screen.getByText('Lessons done: 1 of 20')).toBeInTheDocument()
    // Learned once, its sheet says so from the start.
    await user.click(row)
    expect(
      await within(await screen.findByRole('dialog', { name: 'Em chord' })).findByText(
        'That’s it.',
      ),
    ).toBeInTheDocument()
  })

  it('prints its chords with ♯ and ♭, keeping a chord learned under its symbol as written', async () => {
    const user = userEvent.setup()
    const { midi: keyboard, progressStore } = await renderApp('/songs/bz2/sections/1')
    await unfold()
    const [card] = await screen.findAllByText('C♯m · F♯m · F♯m/D♯ · G♯ · C♯m', { exact: false })
    expect(card).toHaveTextContent('2 × C♯m · F♯m · F♯m/D♯ · G♯ · C♯m')
    expect(rowsOf('One change at a time')[0]).toEqual([
      'From C♯m to F♯m Bars 2–3',
      '/play/bz2?loop=2-3',
    ])
    expect(rowsOf('Pattern')[0]?.[0]).toMatch(/On C♯m · Bar 1$/)
    await user.click(screen.getByRole('button', { name: 'Learn F♯m/D♯' }))
    const sheet = await screen.findByRole('dialog', { name: 'F♯m/D♯ chord' })
    // D♯ under F♯ minor's notes, held together.
    act(() => {
      for (const key of [51, 54, 57, 61]) keyboard.press(midi(key))
    })
    expect(await within(sheet).findByText('That’s it.')).toBeInTheDocument()
    expect(Object.keys(progressStore.getState().lessons)).toEqual(['bz2:chord:F#m/D#'])
  })

  it('goes back to the song’s page, opened directly', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/songs/bz5/sections/3')
    await unfold()
    await user.click(await screen.findByRole('button', { name: 'Back' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/songs/bz5'))
  })

  it.each([
    '/songs/bz5/sections/4',
    '/songs/bz5/sections/0',
    '/songs/bz5/sections/verse',
    '/songs/nowhere/sections/1',
    // A study is on its shelf, and a song on its own.
    '/songs/ex3/sections/1',
    '/practice/accompaniment/studies/bz5/sections/1',
    // A listing has no chart to learn.
    '/songs/bz4/sections/1',
  ])('is not found at %s', async (path) => {
    await renderApp(path)
    await unfold()
    expect(await screen.findByText('Page not found')).toBeInTheDocument()
  })

  it('teaches a study’s section on its shelf, back to the study', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/accompaniment/studies/ex3/sections/1')
    await unfold()
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Learn the Practice' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Practise' })).toHaveAttribute(
      'href',
      '/play/ex3?loop=1-8',
    )
    await user.click(screen.getByRole('button', { name: 'Back' }))
    await waitFor(() =>
      expect(router.state.location.pathname).toBe('/practice/accompaniment/studies/ex3'),
    )
  })

  it('loops a section with its repeats as the Player plays it, every pass (ADR 0067)', async () => {
    // The verse's first two bars repeated, then the chorus: played Em D Em D C, then G D.
    const storage = savedSong({
      pattern: 'r2',
      sections: [
        { kind: 'verse', lines: ['|: Em D :| C'] },
        { kind: 'chorus', lines: ['G D'] },
      ],
    })
    await renderApp('/songs/my-1/sections/1', { storage })
    await unfold()
    expect(await screen.findByRole('link', { name: 'Practise' })).toHaveAttribute(
      'href',
      '/play/my-1?loop=1-5',
    )
    expect(rowsOf('One change at a time')).toEqual([
      ['From Em to D Bars 1–2', '/play/my-1?loop=1-2'],
      ['From D to Em Bars 2–3', '/play/my-1?loop=2-3'],
      ['From D to C Bars 4–5', '/play/my-1?loop=4-5'],
    ])
  })

  it('has nothing to learn in a section of no chord symbol, and no pattern for one written out', async () => {
    const storage = savedSong({
      pattern: 'r2',
      sections: [{ kind: 'verse', lines: ['_ _'] }],
      hands: { rh: 'B4/4 | D5/4', lh: 'r/4 | r/4' },
    })
    await renderApp('/songs/my-1/sections/1', { storage })
    await unfold()
    expect(await screen.findByText('No chord symbols')).toBeInTheDocument()
    expect(screen.queryByText(/^Lessons done/)).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument()
  })

  it('reads in Russian', async () => {
    await renderApp('/songs/bz5/sections/2', { locale: 'ru' })
    await unfold()
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Учим раздел «Припев»' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^С Em на D\/F♯ Такт 9/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '3-й оборот Em · C · D' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Учим Em' })).toBeInTheDocument()
    expect(untranslated(document.body)).toEqual([])
  })
})
