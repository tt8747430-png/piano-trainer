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

/** The keys going down on the screen's keyboard, by name. */
function keysDown(audio: { played: readonly { at: number }[]; setNow: (now: number) => void }) {
  act(() => audio.setNow((audio.played.at(-1)?.at ?? 0) + 0.05))
  return within(screen.getByRole('group', { name: 'Keyboard' }))
    .getAllByRole('button')
    .filter((key) => key.hasAttribute('data-down'))
    .map((key) => key.getAttribute('aria-label') ?? '')
}

describe('the View’s views of the music (ADR 0099)', () => {
  it('chooses a view from its tiles, saved for every piece, the rest of the menu what the view has', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/play/silent')
    await user.click(await screen.findByRole('button', { name: 'View' }))
    const menu = await screen.findByRole('dialog', { name: 'View' })
    await user.click(within(menu).getByRole('radio', { name: 'Diagrams' }))
    expect(settingsStore.getState().scoreView.music).toBe('diagrams')
    expect(screen.getByRole('region', { name: 'Diagrams' })).toBeInTheDocument()
    expect(screen.queryByRole('region', { name: 'Sheet music' })).not.toBeInTheDocument()
    expect(within(menu).getByRole('radio', { name: 'Diagrams' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
    /** The menu's switches are these, in order. */
    const switchesAre = (...names: string[]) => {
      const switches = within(menu).getAllByRole('switch')
      expect(switches).toHaveLength(names.length)
      names.forEach((name, i) => expect(switches[i]).toHaveAccessibleName(name))
    }
    // The line sung is Diagrams', so its Lyrics stays; the layout and the staves are the sheet's.
    expect(within(menu).queryByRole('region', { name: 'Layout' })).not.toBeInTheDocument()
    expect(within(menu).queryByRole('region', { name: 'Staves' })).not.toBeInTheDocument()
    switchesAre('Lyrics', 'Keys')
    await user.click(within(menu).getByRole('radio', { name: 'Chords over lyrics' }))
    expect(screen.getByRole('region', { name: 'Chords over lyrics' })).toBeInTheDocument()
    switchesAre('Keys')
    await user.click(within(menu).getByRole('radio', { name: 'Grid' }))
    switchesAre('Keys')
    await user.click(within(menu).getByRole('radio', { name: 'Sheet music' }))
    expect(settingsStore.getState().scoreView.music).toBe('sheet')
    expect(await screen.findByRole('region', { name: 'Sheet music' })).toBeInTheDocument()
    expect(within(menu).getByRole('region', { name: 'Layout' })).toBeInTheDocument()
  })

  it('opens every piece in the view last chosen', async () => {
    const storage = createMemoryStorage()
    const first = await inView('grid', '/play/bz5', { storage })
    first.unmount()
    await renderApp('/play/silent', { storage })
    expect(await screen.findByRole('region', { name: 'Grid' })).toBeInTheDocument()
  })

  it('says music of no chord symbol has none, with the way to its sheet music', async () => {
    const user = userEvent.setup()
    const storage = withSong({
      sections: [{ kind: 'verse', lines: ['_ _'] }],
      hands: { rh: 'B4/4 | D5/4', lh: 'r/4 | r/4' },
    })
    const { settingsStore } = await inView('lyrics', '/play/my-1', { storage })
    for (const [music, name] of [
      ['lyrics', 'Chords over lyrics'],
      ['diagrams', 'Diagrams'],
      ['grid', 'Grid'],
    ] as const) {
      act(() => setScoreView(settingsStore, { music }))
      const view = screen.getByRole('region', { name })
      expect(within(view).getByText('This music has no chord symbols.')).toBeInTheDocument()
    }
    await user.click(screen.getByRole('button', { name: 'Show the sheet music' }))
    expect(settingsStore.getState().scoreView.music).toBe('sheet')
    expect(await screen.findByRole('region', { name: 'Sheet music' })).toBeInTheDocument()
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
    await inView('lyrics', '/play/bz5')
    const first = line('Bars 1–4')
    expect(
      within(first.shown)
        .getAllByRole('button')
        .flatMap((each) => each.textContent || []),
    ).toEqual(['G', 'C', 'Em', 'G/B', 'C', 'C/E', 'Dsus4', 'D/F♯'])
  })

  it('opens a chip’s chord in its sheet, which plays it', async () => {
    const user = userEvent.setup()
    const { audio } = await inView('lyrics', '/play/silent')
    await user.click(within(line('Bars 5–8').shown).getByRole('button', { name: 'G7' }))
    const sheet = await screen.findByRole('dialog', { name: 'G7 chord' })
    expect(within(sheet).getByRole('img', { name: /^G7: / })).toBeInTheDocument()
    const played = audio.played.length
    await user.click(within(sheet).getByRole('button', { name: 'Play' }))
    expect(audio.played).toHaveLength(played + 1)
  })

  it('follows Listen on its beat strip, and goes to a beat tapped there', async () => {
    const user = userEvent.setup()
    const { audio } = await inView('lyrics', '/play/bz5')
    expect(stripBeat()).toBe('0')
    const sixth = document.querySelector('[data-slot="beat-strip"] [data-cell="5"]')
    if (!sixth) throw new Error('a sixth beat')
    await user.click(sixth)
    expect(stripBeat()).toBe('5')
    await user.click(screen.getByRole('button', { name: 'Play' }))
    const start = audio.played.at(-1)?.at ?? 0
    // From bar 2's second beat, two beats on at 72 BPM.
    act(() => audio.setNow(start + (2 * 60) / 72 + 0.1))
    await waitFor(() => expect(stripBeat()).toBe('7'))
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
    expect(within(view).getByText('Silent night, holy night,')).toBeInTheDocument()
    expect(within(view).getByText('All is calm, all is bright')).toBeInTheDocument()
    act(() => setScoreView(settingsStore, { lyrics: false }))
    expect(within(view).queryByText('Silent night, holy night,')).not.toBeInTheDocument()
    // The chord sounding is named by its notes; the next, greyed, as the next.
    expect(within(view).getByRole('button', { name: 'C: C E G' })).toBeInTheDocument()
    // A diagram opens its chord's sheet.
    await user.click(within(view).getByRole('button', { name: 'Next: G7' }))
    expect(await screen.findByRole('dialog', { name: 'G7 chord' })).toBeInTheDocument()
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
})
