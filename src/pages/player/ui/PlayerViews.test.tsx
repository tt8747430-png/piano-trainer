import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { PIECES_STORAGE_KEY, PIECES_VERSION } from '@/entities/piece'
import { SETTINGS_STORAGE_KEY, SETTINGS_VERSION, type MusicView } from '@/entities/settings'
import { setScoreView } from '@/features/set-preference'
import { createMemoryStorage } from '@/shared/lib'
import { stubBox } from '@/shared/test/layout'

/** A piece in the Player in one of its views of the music, chosen once it is open. */
async function inView(music: MusicView, path: string, options?: Parameters<typeof renderApp>[1]) {
  const opened = await renderApp(path, options)
  await screen.findByRole('heading', { level: 1 })
  act(() => setScoreView(opened.settingsStore, { music }))
  return opened
}

/** The device's storage holding one own song, `my-1`, in G, 4/4 at 90, as the Player reads it. */
function withSong(song: object): Storage {
  const storage = createMemoryStorage()
  const saved = { id: 'my-1', title: 'Morning', key: 'G', meter: '4/4', tempo: 90, pattern: 'r1' }
  storage.setItem(
    PIECES_STORAGE_KEY,
    JSON.stringify({
      state: { songs: [{ ...saved, ...song }], nextSong: 2 },
      version: PIECES_VERSION,
    }),
  )
  return storage
}

/** The beat strip's beat sounding, counted along it from 0. */
const stripBeat = () =>
  document.querySelector('[data-slot="beat-strip"] [data-sounding]')?.getAttribute('data-cell')

/** A beat of the strip, counted along it from 0. */
function stripCell(cell: number): HTMLElement {
  const found = document.querySelector<HTMLElement>(
    `[data-slot="beat-strip"] [data-cell="${cell}"]`,
  )
  if (!found) throw new Error(`no beat ${cell} on the strip`)
  return found
}

/** What each beat of the strip names, in order: its chords, a rest, or nothing. */
const stripNamed = () =>
  [...document.querySelectorAll('[data-slot="beat-strip"] [data-cell]')].map(
    (cell) => cell.textContent ?? '',
  )

/** The keys marked on the screen's keyboard, lowest first, by name. */
const markedKeys = () =>
  within(screen.getByRole('group', { name: 'Keyboard' }))
    .getAllByRole('button')
    .filter((key) => /\bbg-hand-/.test(key.className))
    .map((key) => key.getAttribute('aria-label') ?? '')

/** The Diagrams view's line being sung, and the next one under it. */
const sungLine = (view: HTMLElement) => view.querySelector('[data-slot="sung-line"]')
const comingLine = (view: HTMLElement) => view.querySelector('[data-slot="coming-line"]')

/** A screen of a size, as `matchMedia` answers it: the one query given matches. */
const sizedAs = (query: string) =>
  vi.stubGlobal('matchMedia', (media: string) => ({
    media,
    matches: media === query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }))

/** The keys going down on the screen's keyboard, by name. */
function keysDown(audio: { played: readonly { at: number }[]; setNow: (now: number) => void }) {
  act(() => audio.setNow((audio.played.at(-1)?.at ?? 0) + 0.05))
  return within(screen.getByRole('group', { name: 'Keyboard' }))
    .getAllByRole('button')
    .filter((key) => key.hasAttribute('data-down'))
    .map((key) => key.getAttribute('aria-label') ?? '')
}

describe('the View’s views of the music (ADR 0099)', () => {
  it('chooses a view from its tiles, saved for every piece', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/play/silent')
    await user.click(await screen.findByRole('button', { name: 'View: Sheet music' }))
    const menu = await screen.findByRole('dialog', { name: 'View' })
    await user.click(within(menu).getByRole('radio', { name: 'Diagrams' }))
    expect(settingsStore.getState().scoreView.music).toBe('diagrams')
    expect(within(menu).getByRole('radio', { name: 'Diagrams' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
    // The music, under the menu's own part for the view (ADR 0102).
    const music = document.querySelector<HTMLElement>('[data-area="sheet"]')
    if (!music) throw new Error('the music’s area')
    expect(within(music).getByRole('region', { name: 'Diagrams' })).toBeInTheDocument()
    expect(within(music).queryByRole('region', { name: 'Sheet music' })).not.toBeInTheDocument()
    await user.click(within(menu).getByRole('radio', { name: 'Chords over lyrics' }))
    expect(within(music).getByRole('region', { name: 'Chords over lyrics' })).toBeInTheDocument()
    await user.click(within(menu).getByRole('radio', { name: 'Sheet music' }))
    expect(settingsStore.getState().scoreView.music).toBe('sheet')
    expect(await within(music).findByRole('region', { name: 'Sheet music' })).toBeInTheDocument()
  })

  it('opens every piece in the view last chosen', async () => {
    const storage = createMemoryStorage()
    const first = await inView('grid', '/play/bz5', { storage })
    first.unmount()
    await renderApp('/play/silent', { storage })
    expect(await screen.findByRole('region', { name: 'Grid' })).toBeInTheDocument()
  })

  it('reads in Russian', async () => {
    const { settingsStore } = await inView('grid', '/play/silent', { locale: 'ru' })
    expect(screen.getByRole('region', { name: 'Сетка' })).toBeInTheDocument()
    expect(untranslated(document.body)).toEqual([])
    act(() => setScoreView(settingsStore, { music: 'lyrics' }))
    expect(screen.getByRole('region', { name: 'Аккорды над текстом' })).toBeInTheDocument()
    expect(untranslated(document.body)).toEqual([])
    act(() => setScoreView(settingsStore, { music: 'diagrams' }))
    expect(screen.getByRole('region', { name: 'Схемы аккордов' })).toBeInTheDocument()
    expect(untranslated(document.body)).toEqual([])
  })
})

describe('the Grid (ADR 0098, 0099)', () => {
  it('shows the chart in beats where the sheet music was, by section, under its title', async () => {
    await inView('grid', '/play/bz5')
    const grid = screen.getByRole('region', { name: 'Grid' })
    expect(
      within(grid).getByRole('heading', { level: 1, name: 'Still, my soul, be still' }),
    ).toBeInTheDocument()
    expect(
      within(grid)
        .getAllByRole('heading', { level: 2 })
        .map((heading) => heading.textContent),
    ).toEqual(['Verse', 'Chorus', 'Ending'])
    expect(within(grid).getAllByRole('button', { name: /^Bar / })).toHaveLength(19)
    const first = within(grid).getByRole('button', { name: 'Bar 1: G' })
    expect(first).toHaveAttribute('aria-current', 'step')
    expect(first.querySelector('[data-sounding]')).toHaveAttribute('data-beat', '0')
  })

  it('fills the beat sounding as Listen plays', async () => {
    const user = userEvent.setup()
    const { audio } = await inView('grid', '/play/bz5')
    await user.click(screen.getByRole('button', { name: 'Play' }))
    const start = audio.played[0]?.at ?? 0
    // A beat of 4/4 at 72 BPM lasts 60 / 72 seconds: the second bar's second beat.
    act(() => audio.setNow(start + (5 * 60) / 72 + 0.1))
    const second = screen.getByRole('button', { name: 'Bar 2: C' })
    await waitFor(() =>
      expect(second.querySelector('[data-sounding]')).toHaveAttribute('data-beat', '1'),
    )
    expect(second).toHaveAttribute('aria-current', 'step')
    expect(screen.getByRole('button', { name: 'Bar 1: G' })).not.toHaveAttribute('aria-current')
    await user.click(screen.getByRole('button', { name: 'Stop' }))
  })

  it('goes to a beat tapped, kept in sight: it sounds where it lands, on the keys, and Edit opens there', async () => {
    const user = userEvent.setup()
    const { audio } = await inView('grid', '/play/bz5')
    const scrolled = vi.mocked(Element.prototype.scrollIntoView)
    scrolled.mockClear()
    const bar = screen.getByRole('button', { name: 'Bar 3: Em G/B' })
    const third = bar.querySelector('[data-beat="2"]')
    if (!third) throw new Error('a third beat')
    await user.click(third)
    expect(bar).toHaveAttribute('aria-current', 'step')
    expect(bar.querySelector('[data-sounding]')).toHaveAttribute('data-beat', '2')
    expect(scrolled.mock.contexts).toEqual([bar])
    expect(screen.getByRole('link', { name: 'Edit' })).toHaveAttribute('href', '/edit/bz5?bar=3')
    // Nothing plays: the move sounds where it lands, G/B's keys going down.
    expect(audio.played).toHaveLength(1)
    const down = keysDown(audio)
    expect(down.length).toBeGreaterThan(0)
    expect(down.every((name) => /^[GBD]\d$/.test(name))).toBe(true)
  })

  it('shows a bar of no chord as an empty bar named by its number, which a tap goes to (ADR 0094)', async () => {
    const user = userEvent.setup()
    const storage = withSong({
      sections: [{ kind: 'verse', lines: ['G _ D _'] }],
      hands: { rh: 'B4/4 | D5/4 | A4/4 | G4/4', lh: 'r/4 | r/4 | r/4 | r/4' },
    })
    await inView('grid', '/play/my-1', { storage })
    const grid = screen.getByRole('region', { name: 'Grid' })
    expect(
      within(grid)
        .getAllByRole('button', { name: /^Bar / })
        .map((bar) => [bar.getAttribute('aria-label'), bar.textContent]),
    ).toEqual([
      ['Bar 1: G', '1G'],
      ['Bar 2', '2'],
      ['Bar 3: D', '3D'],
      ['Bar 4', '4'],
    ])
    const empty = within(grid).getByRole('button', { name: 'Bar 4' })
    await user.click(empty)
    expect(empty).toHaveAttribute('aria-current', 'step')
  })

  it('lays the loop’s bars on its band', async () => {
    await inView('grid', '/play/bz5?loop=2-3')
    const looped = (name: string) =>
      [...screen.getByRole('button', { name }).querySelectorAll('[data-beat]')].every((cell) =>
        cell.hasAttribute('data-looped'),
      )
    expect(['Bar 1: G', 'Bar 2: C', 'Bar 3: Em G/B'].map(looped)).toEqual([false, true, true])
  })

  it('opens at its top, and at a loop further on with the loop’s bar brought into sight', async () => {
    const scrolled = vi.mocked(Element.prototype.scrollIntoView)
    const storage = createMemoryStorage()
    storage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify({ version: SETTINGS_VERSION, state: { scoreView: { music: 'grid' } } }),
    )
    const opened = await renderApp('/play/bz5', { storage })
    await screen.findByRole('region', { name: 'Grid' })
    expect(scrolled).not.toHaveBeenCalled()
    opened.unmount()
    // Laid out, the loop's first bar stands below the room the Grid shows.
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: Element,
    ) {
      const top = this.getAttribute('aria-current') === 'step' ? 2000 : 0
      return DOMRect.fromRect({ x: 0, y: top, width: 300, height: 50 })
    })
    await renderApp('/play/bz5?loop=10-12', { storage })
    await screen.findByRole('region', { name: 'Grid' })
    expect(scrolled.mock.contexts).toContain(screen.getByRole('button', { name: 'Bar 10: G' }))
  })
})

describe('Chords over lyrics (ADR 0099)', () => {
  /** A line of the words by the bars it holds: its button, and what it shows. */
  const line = (name: string) => {
    const button = screen.getByRole('button', { name })
    return { button, shown: button.parentElement as HTMLElement }
  }

  it('puts the hymn’s words under its chords, a chord held over its bars once', async () => {
    await inView('lyrics', '/play/silent')
    const view = screen.getByRole('region', { name: 'Chords over lyrics' })
    expect(
      within(view).getByRole('heading', { level: 1, name: 'Silent Night' }),
    ).toBeInTheDocument()
    const first = line('Bars 1–4')
    expect(first.shown).toHaveTextContent('Silent night, holy night,')
    expect(
      within(first.shown)
        .getAllByRole('button')
        .map((each) => each.textContent),
    ).toEqual(['', 'C'])
    const second = line('Bars 5–8')
    expect(second.shown).toHaveTextContent(/All is calm,.*all is bright/)
    expect(
      within(second.shown)
        .getAllByRole('button')
        .flatMap((each) => each.textContent || []),
    ).toEqual(['G7', 'C'])
  })

  it('marks the line playing and the chip of its chord as the cursor moves', async () => {
    const user = userEvent.setup()
    await inView('lyrics', '/play/silent')
    const first = line('Bars 1–4')
    expect(first.button).toHaveAttribute('aria-current', 'step')
    expect(within(first.shown).getByRole('button', { name: 'C' })).toHaveAttribute('data-sounding')
    // A line tapped takes the cursor to its first beat.
    const second = line('Bars 5–8')
    await user.click(second.button)
    expect(second.button).toHaveAttribute('aria-current', 'step')
    expect(first.button).not.toHaveAttribute('aria-current')
    expect(within(second.shown).getByRole('button', { name: 'G7' })).toHaveAttribute(
      'data-sounding',
    )
    // Four bars of 3/4 in: the strip's thirteenth beat.
    expect(stripBeat()).toBe('12')
  })

  it('stacks each verse in the chords, the second under the first', async () => {
    const storage = withSong({
      key: 'C',
      sections: [{ kind: 'verse', lines: ['C G'] }],
      staves: [{ notes: 'E4/2 F4/2 | G4/4' }],
      lyrics: ['Good morn- ing', 'Hel- lo now'],
    })
    await inView('lyrics', '/play/my-1', { storage })
    const shown = line('Bars 1–2').shown
    expect(shown).toHaveTextContent(/Good morn.*Hello.*ing.*now/)
  })

  it('leaves out a line of neither words nor chords, its section named over its next line', async () => {
    const storage = withSong({
      sections: [
        { kind: 'verse', lines: ['_ _', 'G D'] },
        { kind: 'chorus', lines: ['C G'] },
      ],
      hands: {
        rh: 'B4/4 | B4/4 | A4/4 | G4/4 | E4/4 | D4/4',
        lh: 'r/4 | r/4 | r/4 | r/4 | r/4 | r/4',
      },
      // Words in the chorus alone: music of none shows Diagrams (ADR 0102).
      staves: [{ notes: 'r/4 | r/4 | r/4 | r/4 | E4/4 | D4/4' }],
      lyrics: ['Sing on'],
    })
    await inView('lyrics', '/play/my-1', { storage })
    expect(screen.queryByRole('button', { name: 'Bars 1–2' })).not.toBeInTheDocument()
    expect(line('Bars 3–4').shown).toBeInTheDocument()
    const view = screen.getByRole('region', { name: 'Chords over lyrics' })
    expect(
      within(view)
        .getAllByRole('heading', { level: 2 })
        .map((heading) => heading.textContent),
    ).toEqual(['Verse', 'Chorus'])
  })

  it('shows a line of no words as its chords, one chip a change', async () => {
    const storage = withSong({
      sections: [{ kind: 'verse', lines: ['G C', 'Em G/B C D/F#'] }],
      staves: [{ notes: 'B4/4 | C5/4 | r/4 | r/4 | r/4 | r/4' }],
      lyrics: ['Good day'],
    })
    await inView('lyrics', '/play/my-1', { storage })
    const unsung = line('Bars 3–6')
    expect(
      within(unsung.shown)
        .getAllByRole('button')
        .flatMap((each) => each.textContent || []),
    ).toEqual(['Em', 'G/B', 'C', 'D/F♯'])
  })

  it('takes the cursor to a chip’s chord, sounding it, and opens no sheet (ADR 0108)', async () => {
    const user = userEvent.setup()
    const { audio } = await inView('lyrics', '/play/silent')
    const played = audio.played.length
    await user.click(within(line('Bars 5–8').shown).getByRole('button', { name: 'G7' }))
    expect(line('Bars 5–8').button).toHaveAttribute('aria-current', 'step')
    expect(within(line('Bars 5–8').shown).getByRole('button', { name: 'G7' })).toHaveAttribute(
      'data-sounding',
    )
    expect(audio.played.length).toBeGreaterThan(played)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('takes the cursor to a pinned diagram’s chord where it next sounds (ADR 0108)', async () => {
    const user = userEvent.setup()
    await inView('lyrics', '/play/silent')
    const strip = document.querySelector('[data-slot="beat-strip"]')?.parentElement
    const pinned = within(strip as HTMLElement).getByRole('list', { name: 'Chords' })
    await user.click(within(pinned).getByRole('button', { name: /^G7: / }))
    expect(line('Bars 5–8').button).toHaveAttribute('aria-current', 'step')
    expect(within(pinned).getByRole('button', { name: /^G7: / })).toHaveAttribute('aria-current')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('follows Listen on its beat strip, and goes to a beat tapped there', async () => {
    const user = userEvent.setup()
    const { audio } = await inView('lyrics', '/play/silent')
    expect(stripBeat()).toBe('0')
    const fifth = document.querySelector('[data-slot="beat-strip"] [data-cell="4"]')
    if (!fifth) throw new Error('a fifth beat')
    await user.click(fifth)
    expect(stripBeat()).toBe('4')
    await user.click(screen.getByRole('button', { name: 'Play' }))
    const start = audio.played.at(-1)?.at ?? 0
    // From bar 2's second beat of 3/4, two beats on at 84 BPM.
    act(() => audio.setNow(start + (2 * 60) / 84 + 0.1))
    await waitFor(() => expect(stripBeat()).toBe('6'))
    await user.click(screen.getByRole('button', { name: 'Stop' }))
  })

  it('keeps the line playing in the top third under its strip as the music reaches it', async () => {
    const user = userEvent.setup()
    await inView('lyrics', '/play/silent')
    const view = screen.getByRole('region', { name: 'Chords over lyrics' })
    stubBox(view, { width: 390, height: 600 })
    vi.spyOn(view, 'clientHeight', 'get').mockReturnValue(600)
    const later = line('Bars 13–16')
    stubBox(later.shown, { top: 900, width: 390, height: 80 })
    const scrolled = vi.mocked(Element.prototype.scrollTo)
    await user.click(later.button)
    const call = scrolled.mock.contexts.lastIndexOf(view)
    // A quarter of the way down the 600 pixels under the strip (none tall where nothing is laid out).
    expect(scrolled.mock.calls[call]).toEqual([{ top: 900 - 150, behavior: 'smooth' }])
  })
})

describe('Diagrams (ADR 0099)', () => {
  it('follows the chord sounding as Listen plays', async () => {
    const user = userEvent.setup()
    const { audio } = await inView('diagrams', '/play/bz5')
    const view = screen.getByRole('region', { name: 'Diagrams' })
    const shown = () =>
      within(view)
        .getAllByRole('img')
        .map((diagram) => diagram.getAttribute('aria-label')?.split(':')[0])
    expect(shown()).toEqual(['G', 'C'])
    await user.click(screen.getByRole('button', { name: 'Play' }))
    const start = audio.played[0]?.at ?? 0
    // Bar 2 of 4/4 at 72 BPM: C, then Em.
    act(() => audio.setNow(start + (4 * 60) / 72 + 0.1))
    await waitFor(() => expect(shown()).toEqual(['C', 'Em']))
    expect(view.querySelector('[data-slot="beat-strip"] [data-sounding]')).toHaveAttribute(
      'data-cell',
      '4',
    )
    await user.click(screen.getByRole('button', { name: 'Stop' }))
  })

  it('shows the chord sounding as its keys beside the next, and the line sung under the strip', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await inView('diagrams', '/play/silent')
    const view = screen.getByRole('region', { name: 'Diagrams' })
    expect(
      within(view)
        .getAllByRole('img')
        .map((diagram) => [
          diagram.getAttribute('aria-label')?.split(':')[0],
          diagram.hasAttribute('data-muted'),
        ]),
    ).toEqual([
      ['C', false],
      ['G7', true],
    ])
    expect(sungLine(view)).toHaveTextContent('Silent night, holy night,')
    expect(comingLine(view)).toHaveTextContent('All is calm, all is bright')
    act(() => setScoreView(settingsStore, { lyrics: false }))
    expect(sungLine(view)).toBeNull()
    // The chord sounding is named by its notes as they fold, G3 C4 E4; the next, greyed, as the next.
    expect(within(view).getByRole('button', { name: 'C: G C E' })).toBeInTheDocument()
    // A diagram takes the cursor to its chord (ADR 0108): the next sounds now, opening no sheet.
    await user.click(within(view).getByRole('button', { name: 'Next: G7' }))
    expect(within(view).getByRole('button', { name: /^G7: / })).toBeInTheDocument()
    expect(stripNamed()[Number(stripBeat())]).toBe('G7')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it.each([
    ['a tablet', '(min-width: 40rem)'],
    ['a laptop', '(min-width: 64rem)'],
  ])('shows the chord sounding and the next alone on %s (ADR 0101)', async (_size, query) => {
    sizedAs(query)
    await inView('diagrams', '/play/bz5')
    const view = screen.getByRole('region', { name: 'Diagrams' })
    expect(
      within(view)
        .getAllByRole('img')
        .map((diagram) => diagram.getAttribute('aria-label')),
    ).toEqual(['G: G B D', 'C: G C E'])
  })

  it('names a chord on the strip once over the bars that go on with it (ADR 0101)', async () => {
    await inView('diagrams', '/play/silent')
    // Bars of 3/4: C C C C, then G7 G7 C C.
    expect(stripNamed().slice(0, 24)).toEqual([
      ...['C', '', '', '', '', '', '', '', '', '', '', ''],
      ...['G7', '', '', '', '', '', 'C', '', '', '', '', ''],
    ])
  })

  it('rests on the strip where the music turns to no chord (ADR 0101)', async () => {
    const storage = withSong({
      sections: [{ kind: 'verse', lines: ['G _ G'] }],
      hands: { rh: 'B4/4 | D5/4 | A4/4', lh: 'r/4 | r/4 | r/4' },
    })
    await inView('diagrams', '/play/my-1', { storage })
    expect(stripNamed()).toEqual([
      ...['G', '', '', ''],
      ...['\u{1D13D}', '', '', ''],
      ...['G', '', '', ''],
    ])
  })

  it('lights the words of the line sung as the music reaches them (ADR 0101)', async () => {
    const user = userEvent.setup()
    await inView('diagrams', '/play/silent')
    const view = screen.getByRole('region', { name: 'Diagrams' })
    const lit = () =>
      [...(sungLine(view)?.querySelectorAll('[data-sung]') ?? [])].map((word) =>
        word.textContent?.trim(),
      )
    expect(lit()).toEqual(['Silent'])
    // The second bar's first beat: "night," is sung.
    await user.click(stripCell(3))
    expect(lit()).toEqual(['Silent', 'night,'])
    expect(sungLine(view)).toHaveTextContent('Silent night, holy night,')
    expect(comingLine(view)).toHaveTextContent('All is calm, all is bright')
  })

  it('waits between lines that sing with a dash, the next line under it (ADR 0101)', async () => {
    const user = userEvent.setup()
    const storage = withSong({
      sections: [{ kind: 'verse', lines: ['G D', 'C G', 'D G'] }],
      staves: [{ notes: 'B4/4 | A4/4 | r/4 | r/4 | A4/4 | G4/4' }],
      lyrics: ['Good day, good night'],
    })
    await inView('diagrams', '/play/my-1', { storage })
    const view = screen.getByRole('region', { name: 'Diagrams' })
    expect(sungLine(view)).toHaveTextContent('Good day,')
    // The third bar's: a line of no words.
    await user.click(stripCell(8))
    expect(sungLine(view)).toBeNull()
    expect(view.querySelector('[data-slot="wait"]')).toBeInTheDocument()
    expect(comingLine(view)).toHaveTextContent('good night')
  })

  it('marks the chord sounding on the keys as its diagram draws it in Listen (ADR 0101)', async () => {
    const user = userEvent.setup()
    const { audio, settingsStore } = await inView('diagrams', '/play/bz5')
    // G, folded: G3 B3 D4.
    expect(markedKeys()).toEqual(['G3', 'B3', 'D4'])
    await user.click(screen.getByRole('button', { name: 'Play' }))
    const start = audio.played[0]?.at ?? 0
    // Bar 2 of 4/4 at 72 BPM: C, folded G3 C4 E4.
    act(() => audio.setNow(start + (4 * 60) / 72 + 0.1))
    await waitFor(() => expect(markedKeys()).toEqual(['G3', 'C4', 'E4']))
    await user.click(screen.getByRole('button', { name: 'Stop' }))
    // The sheet music marks the notes heard, as it did.
    act(() => setScoreView(settingsStore, { music: 'sheet' }))
    expect(markedKeys()).not.toEqual(['G3', 'C4', 'E4'])
  })

  it('marks what Wait mode waits for on the keys of a chord view, as the sheet music does', async () => {
    const { settingsStore } = await inView('diagrams', '/play/bz5?mode=wait')
    const waited = markedKeys()
    expect(waited).not.toEqual(['G3', 'B3', 'D4'])
    act(() => setScoreView(settingsStore, { music: 'sheet' }))
    expect(markedKeys()).toEqual(waited)
  })

  it('draws a chord in the inversion chosen on its sheet, on every screen of the song (ADR 0101)', async () => {
    const user = userEvent.setup()
    const { router, diagramInversionsStore } = await inView('diagrams', '/play/bz5')
    const view = screen.getByRole('region', { name: 'Diagrams' })
    // Its sheet from Song information's chords: a diagram of the view is the music's to go to.
    await user.click(screen.getByRole('button', { name: 'More' }))
    await user.click(await screen.findByRole('button', { name: 'Song information' }))
    const info = await screen.findByRole('dialog', { name: 'Song information' })
    await user.click(within(info).getByRole('button', { name: 'G: G B D' }))
    const sheet = await screen.findByRole('dialog', { name: 'G chord' })
    await user.click(within(sheet).getByRole('radio', { name: '1st' }))
    expect(diagramInversionsStore.getState().pieces).toEqual({ bz5: { G: 1 } })
    expect(within(sheet).getByRole('img', { name: 'G: B D G' })).toBeInTheDocument()
    await user.keyboard('{Escape}')
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(within(view).getByRole('button', { name: 'G: B D G' })).toBeInTheDocument()
    await act(() => router.navigate({ to: '/songs/$pieceId', params: { pieceId: 'bz5' } }))
    const chords = await screen.findByRole('region', { name: 'Chords' })
    expect(within(chords).getByRole('button', { name: 'G: B D G' })).toBeInTheDocument()
  })

  it('shows the next chord alone, saying so, where none sounds yet', async () => {
    const storage = withSong({
      sections: [{ kind: 'verse', lines: ['_ G D'] }],
      hands: { rh: 'B4/4 | D5/4 | A4/4', lh: 'r/4 | r/4 | r/4' },
    })
    await inView('diagrams', '/play/my-1', { storage })
    const view = screen.getByRole('region', { name: 'Diagrams' })
    expect(within(view).getByText('Next: G')).toBeInTheDocument()
    expect(within(view).getByRole('button', { name: 'Next: G' })).toBeInTheDocument()
    const [only, ...more] = within(view).getAllByRole('img')
    expect(only).toHaveAttribute('data-muted')
    expect(more).toEqual([])
  })

  it('shows the song’s chords at once in its summary, as the View’s Mode says (ADR 0101, 0102)', async () => {
    const user = userEvent.setup()
    await inView('diagrams', '/play/silent')
    await user.click(await screen.findByRole('button', { name: 'View: Diagrams' }))
    const menu = await screen.findByRole('dialog', { name: 'View' })
    const mode = within(within(menu).getByRole('region', { name: 'Diagrams' })).getByRole(
      'radiogroup',
      { name: 'Mode' },
    )
    await user.click(within(mode).getByRole('radio', { name: 'Summary' }))
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    const view = screen.getByRole('region', { name: 'Diagrams' })
    const cards = within(within(view).getByRole('list', { name: 'Chords' })).getAllByRole('button')
    expect(cards.map((card) => card.textContent)).toEqual(['C', 'G7', 'F'])
    expect(cards[0]).toHaveAttribute('aria-current', 'true')
    expect(within(view).queryByRole('button', { name: 'Next: G7' })).not.toBeInTheDocument()
  })
})
