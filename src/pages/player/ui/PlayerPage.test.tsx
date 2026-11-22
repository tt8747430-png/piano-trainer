import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import {
  hasWrittenStaves,
  isLeadSheet,
  pieceById,
  PIECES,
  PIECES_STORAGE_KEY,
  PIECES_VERSION,
  stavesOf,
} from '@/entities/piece'
import { setPlayback, setPracticeToggle, setScoreView } from '@/features/set-preference'
import { createMemoryStorage, LANDSCAPE_PHONE } from '@/shared/lib'
import { midi } from '@/shared/lib/music'
import * as engine from '@/shared/ui/score/verovio/engine'

/** A screen of a size, as `matchMedia` answers it: a phone on its side, a laptop; else a phone upright. */
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

/** What a control shows in words, a screen reader's alone left out: nothing, for an icon. */
const shownText = (control: Element) => {
  const seen = control.cloneNode(true) as Element
  seen.querySelectorAll('.sr-only').forEach((hidden) => hidden.remove())
  return seen.textContent?.trim() ?? ''
}

/** Opens the Player's Settings › Score view. */
async function openDisplay(user: ReturnType<typeof userEvent.setup>) {
  await user.click(await screen.findByRole('button', { name: 'Player settings' }))
  const sheet = await screen.findByRole('dialog', { name: 'Player settings' })
  await user.click(within(sheet).getByRole('button', { name: /^Score view/ }))
  return screen.findByRole('dialog', { name: 'Score view' })
}

/** Opens the Player's Settings, its first page. */
async function openSettings(user: ReturnType<typeof userEvent.setup>) {
  await user.click(await screen.findByRole('button', { name: 'Player settings' }))
  return screen.findByRole('dialog', { name: 'Player settings' })
}

/** Opens a page of the music's own choices (R31-P): the Staves row, or the Accompaniment card. */
async function openMusicPage(user: ReturnType<typeof userEvent.setup>, row: string) {
  const sheet = await openSettings(user)
  await user.click(
    row === 'Accompaniment'
      ? within(sheet).getByRole('radio', { name: row })
      : within(sheet).getByRole('button', { name: new RegExp(`^${row}`) }),
  )
  return sheet
}

/**
 * The Player as these tests play it: no count-in (the transport's Practice, its Metronome Off), so
 * the music starts as Play is pressed, and the 2D keys in the keys' place, each key named.
 */
async function openPlayer(path: string, options?: Parameters<typeof renderApp>[1]) {
  const opened = await renderApp(path, options)
  act(() => {
    setPlayback(opened.settingsStore, { countdown: 'none' })
    setScoreView(opened.settingsStore, { hands: false })
  })
  return opened
}

describe('Player', () => {
  /** The Player's Settings pages in the order they stand, by each row's name (R32). */
  const pageTitles = (sheet: HTMLElement) =>
    [...sheet.querySelectorAll('button, a')]
      .map((row) =>
        ['Transpose', 'Score view', 'Playback', 'Staves'].find((title) =>
          row.textContent?.startsWith(title),
        ),
      )
      .filter((title) => title !== undefined)
  it.each([
    ['a phone held upright', 'none'],
    ['a phone on its side', LANDSCAPE_PHONE],
    ['a laptop', '(min-width: 64rem)'],
  ])(
    'keeps one bar on %s: each control its icon, named by its label and title (ADR 0114)',
    async (_size, query) => {
      sizedAs(query)
      await openPlayer('/play/bz5')
      await screen.findByRole('button', { name: 'Player settings' })
      // Close, then the views and the one gear (R31-P, loop round 61); Play · Edit is the bar's
      // middle; MIDI only with a keyboard connected (R32).
      const controls = [
        ...document.querySelectorAll(
          ':is([data-area="lead"], [data-area="actions"]) :is(button, a)',
        ),
      ]
      expect(controls.map((control) => control.getAttribute('aria-label'))).toEqual([
        'Close',
        'View: Sheet',
        'Player settings',
      ])
      // Every control is its icon alone, its tooltip saying what it is.
      const titles: Record<string, RegExp> = {
        Close: /^Close/,
        'View: Sheet': /^Show the music as$/,
        'Player settings': /^Player settings/,
      }
      for (const control of controls) {
        const name = control.getAttribute('aria-label') ?? ''
        expect(shownText(control), name).toBe('')
        expect(control.getAttribute('title'), name).toMatch(titles[name] ?? /^$/)
      }
    },
  )

  it('says an own song is gone once another tab deletes it', async () => {
    const storage = createMemoryStorage()
    const song = {
      id: 'my-1',
      title: 'Morning',
      added: '2026-11-01T09:00:00.000Z',
      key: 'G',
      meter: '4/4',
      tempo: 90,
      pattern: 'r1',
      sections: [{ kind: 'verse', lines: ['G G G G'] }],
    }
    storage.setItem(
      PIECES_STORAGE_KEY,
      JSON.stringify({ state: { songs: [song], nextSong: 2 }, version: PIECES_VERSION }),
    )
    const { piecesStore } = await openPlayer('/play/my-1', { storage })
    await screen.findByRole('button', { name: 'Play' })
    act(() => piecesStore.setState({ songs: [] }))
    expect(await screen.findByRole('link', { name: 'Go to Songs' })).toBeInTheDocument()
  })

  it('shows a song that hides its piano as a lead sheet: the tune’s staff alone (ADR 0114)', async () => {
    const storage = createMemoryStorage()
    const song = {
      id: 'my-1',
      title: 'Morning',
      added: '2026-11-01T09:00:00.000Z',
      key: 'G',
      meter: '4/4',
      tempo: 90,
      pattern: 'r1',
      sections: [{ kind: 'verse', lines: ['G C'] }],
      staves: [{ notes: 'B4/4 | C5/4' }],
      leadSheet: true,
    }
    storage.setItem(
      PIECES_STORAGE_KEY,
      JSON.stringify({ state: { songs: [song], nextSong: 2 }, version: PIECES_VERSION }),
    )
    await openPlayer('/play/my-1', { storage })
    const staves = () =>
      [...document.querySelectorAll('[data-slot="score"] g.staff[data-staff]')].map((staff) =>
        staff.getAttribute('data-staff'),
      )
    await waitFor(() => expect(staves().length).toBeGreaterThan(0), { timeout: 4000 })
    expect(new Set(staves())).toEqual(new Set(['staff0']))
  })

  it('reads a single-staff song in the clef Display’s Clef chooses, kept for the song (R29 B7)', async () => {
    const user = userEvent.setup()
    const storage = createMemoryStorage()
    const song = {
      id: 'my-1',
      title: 'Morning',
      added: '2026-11-01T09:00:00.000Z',
      key: 'G',
      meter: '4/4',
      tempo: 90,
      pattern: 'r1',
      sections: [{ kind: 'verse', lines: ['G C'] }],
      staves: [{ notes: 'B4/4 | C5/4' }],
      leadSheet: true,
    }
    storage.setItem(
      PIECES_STORAGE_KEY,
      JSON.stringify({ state: { songs: [song], nextSong: 2 }, version: PIECES_VERSION }),
    )
    const { router } = await openPlayer('/play/my-1', { storage })
    const display = await openDisplay(user)
    const clef = within(display).getByRole('radiogroup', { name: 'Clef' })
    expect(within(clef).getByRole('radio', { name: /^Original/ })).toBeChecked()
    await user.click(within(clef).getByRole('radio', { name: /^Bass/ }))
    await waitFor(() => expect(router.state.location.search).toMatchObject({ clef: 'bass' }))
    // Verovio draws the staff’s clef as SMuFL’s F clef.
    await waitFor(
      () =>
        expect(
          document.querySelector('[data-slot="score"] g.clef use')?.getAttribute('href'),
        ).toMatch(/E062/),
      { timeout: 4000 },
    )
  })

  it('offers no Clef for a song on the piano’s staves', async () => {
    const user = userEvent.setup()
    await openPlayer('/play/bz5')
    const display = await openDisplay(user)
    expect(within(display).queryByRole('radiogroup', { name: 'Clef' })).toBeNull()
  })

  it('plays a song of bars of no chord: its written notes, each bar named by its number (ADR 0114)', async () => {
    const storage = createMemoryStorage()
    const song = {
      id: 'my-1',
      title: 'Morning',
      added: '2026-11-01T09:00:00.000Z',
      key: 'G',
      meter: '4/4',
      tempo: 90,
      pattern: 'r1',
      sections: [{ kind: 'verse', lines: ['G _'] }],
      hands: { rh: 'B4/4 | D5/4', lh: 'r/4 | r/4' },
    }
    storage.setItem(
      PIECES_STORAGE_KEY,
      JSON.stringify({ state: { songs: [song], nextSong: 2 }, version: PIECES_VERSION }),
    )
    await openPlayer('/play/my-1', { storage })
    expect(await screen.findByRole('button', { name: 'Bar 1: G' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Bar 2' })).toBeInTheDocument()
  })

  it('shows the score as its Score view and the bar’s views say, remembered for every piece', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await openPlayer('/play/romashki')
    await screen.findByRole('group', { name: 'Keyboard' })
    const display = await openDisplay(user)
    await user.click(within(display).getByRole('radio', { name: 'Page view' }))
    expect(settingsStore.getState().scoreView.layout).toBe('page')
    await user.keyboard('{Escape}')
    await waitFor(() =>
      expect(document.querySelector('[data-slot="sheet-page"]')).toBeInTheDocument(),
    )
    const views = within(screen.getByRole('banner')).getByRole('radiogroup', {
      name: 'Show the music as',
    })
    await user.click(within(views).getByRole('radio', { name: 'Grid' }))
    const music = document.querySelector<HTMLElement>('[data-area="sheet"]')
    if (!music) throw new Error('the music’s area')
    expect(within(music).queryByRole('region', { name: 'Sheet music' })).not.toBeInTheDocument()
    expect(within(music).getByRole('region', { name: 'Grid' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Keyboard' }))
    const piano = await screen.findByRole('dialog', { name: 'Piano' })
    await user.click(within(piano).getByRole('switch', { name: 'Show the piano' }))
    expect(settingsStore.getState().scoreView).toMatchObject({ music: 'grid', keys: false })
  })

  it('holds Practice, Loop, ‹, Play, ›, Parts and the Keyboard in one floating toolbar named Playback (R31-P, R36)', async () => {
    await openPlayer('/play/romashki')
    const dock = await screen.findByRole('toolbar', { name: 'Playback' })
    expect(dock.closest('[data-area="dock"]')).toBeInTheDocument()
    const names = within(dock)
      .getAllByRole('button')
      .map((button) => button.getAttribute('aria-label'))
    expect(names).toEqual([
      'Practice: Play',
      'Loop',
      'Previous note',
      'Play',
      'Next note',
      'Parts: Both',
      'Keyboard',
    ])
    expect(within(dock).getByRole('button', { name: 'Loop' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    expect(within(dock).getByRole('button', { name: 'Play' })).toHaveAttribute(
      'title',
      'Play (Space)',
    )
  })

  it.each([
    ['a phone', 'none', 'down'],
    ['a laptop', '(min-width: 64rem)', 'right'],
  ])(
    'opens its Settings on %s, a panel at the right on a laptop (R29, 4.1)',
    async (_size, query, side) => {
      sizedAs(query)
      const user = userEvent.setup()
      await openPlayer('/play/bz5')
      await user.click(await screen.findByRole('button', { name: 'Player settings' }))
      const sheet = await screen.findByRole('dialog', { name: 'Player settings' })
      expect(sheet.closest('[data-swipe-direction]')).toHaveAttribute('data-swipe-direction', side)
    },
  )

  it('names each page of its Settings apart in Russian (R29 review)', async () => {
    const user = userEvent.setup()
    await openPlayer('/play/bz5', { locale: 'ru' })
    await user.click(await screen.findByRole('button', { name: 'Настройки плеера' }))
    const sheet = await screen.findByRole('dialog', { name: 'Настройки плеера' })
    // Its rows by the words they show: the icon buttons say nothing.
    const rows = [...sheet.querySelectorAll('button, a')]
      .map((row) => row.textContent)
      .filter((text) => text !== '')
    expect(new Set(rows).size).toBe(rows.length)
  })

  it('has no hands button for music of one hand (R29)', async () => {
    const storage = createMemoryStorage()
    const song = {
      id: 'my-1',
      title: 'Morning',
      added: '2026-11-01T09:00:00.000Z',
      key: 'G',
      meter: '4/4',
      tempo: 90,
      pattern: 'r1',
      sections: [{ kind: 'verse', lines: ['_ _'] }],
      hands: { rh: 'B4/4 | D5/4', lh: 'r/4 | r/4' },
    }
    storage.setItem(
      PIECES_STORAGE_KEY,
      JSON.stringify({ state: { songs: [song], nextSong: 2 }, version: PIECES_VERSION }),
    )
    await openPlayer('/play/my-1', { storage })
    const dock = await screen.findByRole('toolbar', { name: 'Playback' })
    expect(within(dock).queryByRole('button', { name: /^Hands/ })).not.toBeInTheDocument()
  })

  it('plays both hands of music of one hand, a hand chosen before forgotten (R29 review)', async () => {
    const user = userEvent.setup()
    const storage = createMemoryStorage()
    const song = {
      id: 'my-1',
      title: 'Morning',
      added: '2026-11-01T09:00:00.000Z',
      key: 'G',
      meter: '4/4',
      tempo: 90,
      pattern: 'r1',
      sections: [{ kind: 'verse', lines: ['_ _'] }],
      hands: { rh: 'B4/4 | D5/4', lh: 'r/4 | r/4' },
    }
    storage.setItem(
      PIECES_STORAGE_KEY,
      JSON.stringify({ state: { songs: [song], nextSong: 2 }, version: PIECES_VERSION }),
    )
    const { audio, router } = await openPlayer('/play/my-1?hands=lh', { storage })
    await waitFor(() => expect(router.state.location.search).not.toHaveProperty('hands'))
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    const notes = (audio.played[0]?.sounds ?? []).filter((sound) => sound.kind === 'note')
    expect(notes.length).toBeGreaterThan(0)
  })

  it('docks the keys at the foot, under the music and above the transport', async () => {
    await openPlayer('/play/romashki')
    const dock = await screen.findByRole('toolbar', { name: 'Playback' })
    const music = document.querySelector('[data-area="sheet"]')
    if (!music) throw new Error('the music’s area')
    const keys = await screen.findByRole('group', { name: 'Keyboard' })
    expect(music.compareDocumentPosition(keys) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(dock.compareDocumentPosition(keys) & Node.DOCUMENT_POSITION_PRECEDING).toBeTruthy()
  })

  it('opens its one Settings from the gear: its pages ranked by use, none of the music’s acts (R29, R31-P, R32)', async () => {
    const user = userEvent.setup()
    const { audio, settingsStore } = await openPlayer('/play/romashki?tempo=36')
    const sheet = await openSettings(user)
    expect(pageTitles(sheet)).toEqual(['Transpose', 'Score view', 'Playback', 'Staves'])
    // Each row says what it is set to (R32).
    expect(within(sheet).getByRole('button', { name: /^Score view/ })).toHaveTextContent(
      'Vertical scroll',
    )
    // What you play is the first page's cards, the Accompaniment among them (R31-P).
    const staves = within(sheet).getByRole('button', { name: /^Staves/ })
    expect(staves).toHaveTextContent('All playing')
    expect(within(sheet).getByRole('radiogroup', { name: 'What you play' })).toBeInTheDocument()
    expect(within(sheet).queryByRole('group', { name: 'Staves' })).not.toBeInTheDocument()
    // The music's acts are the head's More, never rows among the settings (R31-P).
    for (const group of ['This song', 'Share'])
      expect(within(sheet).queryByRole('region', { name: group })).not.toBeInTheDocument()
    const sliderLabels = () =>
      [...document.querySelectorAll('[data-slot="slider-label"]')].map((label) => label.textContent)
    // The click's volume is Playback's, with the Metronome's page.
    await user.click(within(sheet).getByRole('button', { name: /^Playback/ }))
    expect(await screen.findByRole('dialog', { name: 'Playback' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Metronome' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Metronome/ })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Back' }))
    // Each playing track's volume is on the Staves page, where the Play switches are.
    await user.click(await screen.findByRole('button', { name: /^Staves/ }))
    expect(await screen.findByRole('dialog', { name: 'Staves' })).toBeInTheDocument()
    expect(sliderLabels()).toEqual(['Upper staff volume', 'Lower staff volume', 'Recording volume'])
    // One slider a playing track, in the labels' order.
    const [upper, , recording] = screen.getAllByRole('slider', { hidden: true })
    if (!upper || !recording) throw new Error('the tracks’ volumes')
    expect(upper).toHaveAttribute('aria-valuenow', '100')
    await user.click(upper)
    await user.keyboard('{ArrowLeft}')
    expect(settingsStore.getState().sound.staves.treble).toBe(95)
    await user.click(recording)
    await user.keyboard('{ArrowLeft}')
    expect(settingsStore.getState().sound.recording).toBe(95)
    await user.click(screen.getByRole('button', { name: 'Only the chords' }))
    expect(settingsStore.getState().sound).toMatchObject({
      recording: 0,
      staves: { treble: 100, bass: 100 },
    })
    expect(sliderLabels()).toEqual(['Upper staff volume', 'Lower staff volume', 'Recording volume'])
    // Back to the first page, then away, the song as it was played.
    await user.click(screen.getByRole('button', { name: 'Back' }))
    expect(await screen.findByRole('dialog', { name: 'Player settings' })).toBeInTheDocument()
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    expect(audio.recordings).toEqual([])
    expect(audio.played.length).toBeGreaterThan(0)
  })

  it('counts its bar in large over the music, a beat at a time, then plays (ADR 0105)', async () => {
    const user = userEvent.setup()
    const { audio, settingsStore } = await openPlayer('/play/bz5')
    act(() => setPlayback(settingsStore, { countdown: 'audible' }))
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    // Each click of the bar counted in sounds an accented first, the rest plain.
    const clicks = (audio.played[0]?.sounds ?? []).filter((sound) => sound.kind === 'click')
    expect(clicks.length).toBeGreaterThan(1)
    expect(clicks[0]).toMatchObject({ accent: true })
    expect(clicks[1]).toMatchObject({ accent: false })
    act(() => audio.setNow(0.15))
    // The count-in's own status, beside the one Share speaks in.
    expect(await screen.findByText(/^Count-in: 4/)).toBeInTheDocument()
    // A beat at bz5's 72.
    const beat = 60 / 72
    act(() => audio.setNow(0.15 + beat))
    expect(await screen.findByText(/^Count-in: 3/)).toBeInTheDocument()
    act(() => audio.setNow(0.15 + 8 * beat))
    await waitFor(() => expect(screen.queryByText(/^Count-in/)).not.toBeInTheDocument())
  })

  it('plays «Ромашковые поля»’s recording along in Listen, from bar 1, slowed to the chart’s tempo', async () => {
    const user = userEvent.setup()
    const { audio } = await openPlayer('/play/romashki')
    const play = await screen.findByRole('button', { name: 'Play' })
    expect(audio.loadedRecordings).toHaveLength(1)
    await user.click(play)
    const [first] = audio.recordings
    // Sung at 73 over a chart at 72.
    expect(first?.play.rate).toBe(72 / 73)
    expect(first?.play.offset).toBe(pieceById('romashki')?.recording?.start)
  })

  it('moves the recording by its Sync, kept with the song (R34)', async () => {
    const user = userEvent.setup()
    const { audio, piecesStore } = await openPlayer('/play/romashki')
    await openMusicPage(user, 'Staves')
    const sync = await screen.findByRole('group', { name: 'Sync' })
    expect(sync).toHaveTextContent('In time')
    await user.click(within(sync).getByRole('button', { name: 'Later' }))
    await user.click(within(sync).getByRole('button', { name: 'Later' }))
    expect(sync).toHaveTextContent('20 ms later')
    expect(piecesStore.getState().recordingSync).toEqual({ romashki: 20 })
    await user.keyboard('{Escape}')
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    // Heard 20 ms later: the file's bar 1 is reached 20 ms after the music's.
    expect(audio.recordings[0]?.play.offset).toBeCloseTo(
      (pieceById('romashki')?.recording?.start ?? 0) - 0.02,
    )
  })

  it('plays the recording at half the chart’s tempo at 50%', async () => {
    const user = userEvent.setup()
    const { audio } = await openPlayer('/play/romashki?tempo=36')
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    expect(audio.recordings[0]?.play.rate).toBe(36 / 73)
  })

  it('plays the recording in another key, shifted as far as the music (R34)', async () => {
    const user = userEvent.setup()
    const { audio } = await openPlayer('/play/romashki?transpose=2')
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    expect(audio.recordings[0]?.play.semitones).toBe(2)
    await openMusicPage(user, 'Staves')
    const recording = await screen.findByRole('switch', { name: 'Play Recording' })
    expect(recording).toBeChecked()
    expect(recording).not.toHaveAttribute('data-disabled')
  })

  it('plays no recording in Wait mode', async () => {
    const user = userEvent.setup()
    const { audio } = await openPlayer('/play/romashki?mode=wait')
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    expect(audio.recordings).toEqual([])
  })

  it('plays no recording with its track’s Play off, written in the URL (A35)', async () => {
    const user = userEvent.setup()
    const { audio, router } = await openPlayer('/play/romashki')
    await openMusicPage(user, 'Staves')
    const play = await screen.findByRole('switch', { name: 'Play Recording' })
    expect(play).toBeChecked()
    await user.click(play)
    expect(router.state.location.search).toMatchObject({ staves: 'r0s1' })
    await user.keyboard('{Escape}')
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    expect(audio.recordings).toEqual([])
  })

  it('opens a song with its title, tempo, hands and sheet music, and records it as practised once it plays', async () => {
    const user = userEvent.setup()
    const { progressStore } = await openPlayer('/play/bz5')
    // The title printed at the sheet's head, the bar holding Close and the screen's buttons (ADR 0114).
    const sheet = await screen.findByRole('region', { name: 'Sheet music' })
    expect(
      within(sheet).getByRole('heading', { level: 1, name: 'Still, my soul, be still' }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Practice: Play' })).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: 'Bar 1: G' })).toBeInTheDocument()
    // Practised once the music really starts, never the opening alone (research item 12).
    expect(progressStore.getState().practised.bz5).toBeUndefined()
    await user.click(screen.getByRole('button', { name: 'Play' }))
    await waitFor(() => expect(progressStore.getState().practised.bz5).toBeDefined())
  })

  it('reads a stale URL as the piece’s own setup', async () => {
    const { router } = await openPlayer(
      '/play/bz5?transpose=9&tempo=999&mode=step&loop=9-3&swing=yes',
    )
    expect(await screen.findByRole('button', { name: 'Practice: Play' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Loop' })).toHaveAttribute('aria-pressed', 'false')
    expect(router.state.location.search).toEqual({})
  })

  it('plays in Listen and stops', async () => {
    const user = userEvent.setup()
    const { audio } = await openPlayer('/play/bz5')
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    expect(audio.played).toHaveLength(1)
    await user.click(screen.getByRole('button', { name: 'Stop' }))
    expect(audio.stops).toBeGreaterThan(0)
  })

  it.each(['vertical', 'page', 'panorama'] as const)(
    'steps the playhead with the music as Listen plays, note by note, %s (ADR 0096, R37)',
    async (layout) => {
      const user = userEvent.setup()
      const { audio, settingsStore } = await openPlayer('/play/bz5')
      act(() => setScoreView(settingsStore, { layout }))
      const playhead = () => {
        const line = document.querySelector<HTMLElement>('[data-slot="playhead"]')
        if (!line) throw new Error('the playhead')
        return Number.parseFloat(line.style.left)
      }
      const standing = await waitFor(playhead)
      await user.click(screen.getByRole('button', { name: 'Play' }))
      const started = audio.played.at(-1)?.at ?? 0
      // Past the second note's onset: the playhead stands on it (R37: it steps by note).
      act(() => audio.setNow(started + 1))
      await waitFor(() => expect(playhead()).toBeGreaterThan(standing))
      await user.click(screen.getByRole('button', { name: 'Stop' }))
    },
  )

  it('falls silent, every key up, when the learner leaves while Listen plays the recording', async () => {
    const user = userEvent.setup()
    const { audio, router } = await openPlayer('/play/romashki')
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    expect(audio.recordings).toHaveLength(1)
    act(() => audio.setNow(0.5))
    expect(audio.sounding().size).toBeGreaterThan(0)
    const stops = audio.stops
    await act(() => router.navigate({ to: '/' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Learn' })).toBeInTheDocument()
    expect(audio.stops).toBeGreaterThan(stops)
    expect(audio.sounding().size).toBe(0)
  })

  it('steps with Back and Next, sounding each beat group', async () => {
    const user = userEvent.setup()
    const { audio } = await openPlayer('/play/bz5')
    await user.click(await screen.findByRole('button', { name: 'Next note' }))
    await user.click(screen.getByRole('button', { name: 'Previous note' }))
    expect(audio.played).toHaveLength(2)
  })

  it('chooses Wait mode from the transport’s Practice, in the URL without a history entry, and Play back (R36)', async () => {
    const user = userEvent.setup()
    const { router } = await openPlayer('/play/bz5')
    const entries = router.history.length
    await user.click(await screen.findByRole('button', { name: 'Practice: Play' }))
    const practice = await screen.findByRole('dialog', { name: 'Practice' })
    await user.click(within(practice).getByRole('radio', { name: 'Wait' }))
    expect(router.state.location.search).toMatchObject({ mode: 'wait' })
    expect(router.history.length).toBe(entries)
    expect(within(practice).getByRole('radio', { name: 'Wait' })).toBeChecked()
    await user.click(within(practice).getByRole('radio', { name: 'Play' }))
    expect(router.state.location.search).toEqual({})
    await user.keyboard('{Escape}')
    expect(await screen.findByRole('button', { name: 'Practice: Play' })).toBeInTheDocument()
  })

  it('waits for the notes in Wait mode once playing, says a wrong key, and takes the right ones from MIDI', async () => {
    const user = userEvent.setup()
    // The song's pattern opens with the left hand alone, so the left hand has notes to play at once.
    const { midi: midiKeyboard } = await openPlayer('/play/bz5?mode=wait&hands=lh')
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    expect(await screen.findByText(/^Play /)).toBeInTheDocument()
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    // The keys awaited, marked in the hand's colour: the very keys written (an octave off is a slip).
    const awaited = within(keyboard)
      .getAllByRole('button')
      .filter((key) => /\bbg-hand-/.test(key.className))
      .map((key) => Number(key.dataset.midi))
    expect(awaited.length).toBeGreaterThan(0)
    // C sharp is outside G major's first chord (G B D).
    await user.click(within(keyboard).getByRole('button', { name: 'C sharp 4' }))
    expect(await screen.findByText(/^Not C/)).toBeInTheDocument()
    act(() => {
      for (const key of awaited) midiKeyboard.press(midi(key))
    })
    expect(await screen.findByText('Correct')).toBeInTheDocument()
  })

  it('chooses the hands from the transport’s Parts, in every mode, dimming the other staff (R36)', async () => {
    const user = userEvent.setup()
    const { router } = await openPlayer('/play/bz5')
    await user.click(await screen.findByRole('button', { name: 'Parts: Both' }))
    const parts = await screen.findByRole('dialog', { name: 'Parts' })
    await user.click(within(parts).getByRole('switch', { name: 'Right hand: you play it' }))
    expect(router.state.location.search).toMatchObject({ hands: 'lh' })
    expect(document.querySelector('[data-slot="score"]')).toHaveAttribute('data-muted', 'treble')
    expect(within(parts).getByRole('switch', { name: 'Dim' })).toBeChecked()
    await user.keyboard('{Escape}')
    expect(await screen.findByRole('button', { name: /^Parts: Left/ })).toBeInTheDocument()
  })

  it('loops the bar the cursor is in from the transport, pressed while it loops, and removes the loop', async () => {
    const user = userEvent.setup()
    const { router } = await openPlayer('/play/bz5')
    const transport = await screen.findByRole('toolbar', { name: 'Playback' })
    const loop = within(transport).getByRole('button', { name: 'Loop' })
    await user.click(loop)
    expect(router.state.location.search).toMatchObject({ loop: '1-1' })
    expect(loop).toHaveAttribute('aria-pressed', 'true')
    expect(await screen.findByRole('slider', { name: 'Loop end' })).toBeInTheDocument()
    await user.click(loop)
    expect(router.state.location.search).not.toHaveProperty('loop')
    expect(loop).toHaveAttribute('aria-pressed', 'false')
  })

  it('changes swing in the Setup sheet, the key kept as the tools row moved it', async () => {
    const user = userEvent.setup()
    const { router } = await openPlayer('/play/bz5?transpose=2')
    await openMusicPage(user, 'Accompaniment')
    const swing = await screen.findByRole('radiogroup', { name: 'Swing' })
    expect(within(swing).getByRole('radio', { name: 'Straight' })).toBeChecked()
    await user.click(within(swing).getByRole('radio', { name: 'Hard' }))
    expect(router.state.location.search).toMatchObject({ transpose: 2, swing: 'hard' })
  })

  it('sets up a chord chart’s staves, then its accompaniment from the chords (A35)', async () => {
    const user = userEvent.setup()
    await openPlayer('/play/bz5')
    const sheet = await openMusicPage(user, 'Staves')
    const staves = await screen.findByRole('group', { name: 'Staves' })
    expect(
      within(staves)
        .getAllByRole('switch')
        .map((each) => each.getAttribute('aria-label')),
    ).toEqual(['Play Upper staff', 'Show Upper staff', 'Play Lower staff', 'Show Lower staff'])
    await user.click(within(sheet).getByRole('button', { name: 'Back' }))
    await user.click(await screen.findByRole('radio', { name: 'Accompaniment' }))
    const accompaniment = await screen.findByRole('dialog', { name: 'Accompaniment' })
    expect(within(accompaniment).getByRole('region', { name: 'Pattern' })).toBeInTheDocument()
    expect(within(accompaniment).getByRole('radiogroup', { name: 'Swing' })).toBeInTheDocument()
  })

  it('sets up a score’s staves and how it plays: no pattern, no Simplify (A35)', async () => {
    const score = PIECES.find(hasWrittenStaves)
    if (!score) throw new Error('no piece is a score')
    const user = userEvent.setup()
    await openPlayer(`/play/${score.id}`)
    const sheet = await openMusicPage(user, 'Staves')
    expect(await screen.findByRole('group', { name: 'Staves' })).toBeInTheDocument()
    await user.click(within(sheet).getByRole('button', { name: 'Back' }))
    // A score has no Accompaniment page; its Swing is Playback's, at its head.
    expect(screen.queryByRole('button', { name: /^Accompaniment/ })).toBeNull()
    expect(screen.queryByRole('region', { name: 'Accompaniment from the chords' })).toBeNull()
    await user.click(await screen.findByRole('button', { name: /^Playback/ }))
    expect(await screen.findByRole('radiogroup', { name: 'Swing' })).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('button', { name: /^Version/ })).toBeNull()
  })

  it('plays and shows each staff as its switches say, in the URL; the last in sight stays (A35)', async () => {
    const withTune = PIECES.find((piece) => stavesOf(piece).length > 0 && !isLeadSheet(piece))
    if (!withTune) throw new Error('no piece has a tune')
    const user = userEvent.setup()
    const { router } = await openPlayer(`/play/${withTune.id}`)
    await openMusicPage(user, 'Staves')
    await user.click(await screen.findByRole('switch', { name: 'Show Melody' }))
    expect(router.state.location.search).toMatchObject({ staves: 't01s0' })
    await user.click(screen.getByRole('switch', { name: 'Play Lower staff' }))
    expect(router.state.location.search).toMatchObject({ staves: 't01s0,l0s1' })
    await user.click(screen.getByRole('switch', { name: 'Show Upper staff' }))
    const lower = screen.getByRole('switch', { name: 'Show Lower staff' })
    expect(lower).toHaveAttribute('data-disabled')
    expect(lower).toHaveAttribute('title', 'The last staff in sight stays')
  })

  it('puts no finger numbers on or under the keys, Finger numbers or not: the score prints them (R34)', async () => {
    const { settingsStore } = await openPlayer('/play/bz5')
    const keys = await screen.findByRole('group', { name: 'Keyboard' })
    act(() => setPracticeToggle(settingsStore, 'fingerNumbers', true))
    // The keys are the keyboard's last part: nothing hangs under them.
    expect(keys.closest('[data-area="keys"]')?.lastElementChild).toContainElement(keys)
    expect(keys.nextElementSibling).toBeNull()
  })

  it('names the notes on the staff with Named notes, and saves the toggle', async () => {
    // SMuFL's note name noteheads, U+E150–U+E1AF.
    const namedHeads = () => document.querySelectorAll('[data-slot="score"] svg g.note-name').length
    const user = userEvent.setup()
    const { settingsStore } = await openPlayer('/play/bz5')
    await waitFor(() => expect(document.querySelector('[data-slot="score"] svg')).not.toBeNull())
    expect(namedHeads()).toBe(0)
    const display = await openDisplay(user)
    await user.click(within(display).getByRole('switch', { name: 'Note names' }))
    expect(settingsStore.getState().practice.namedNotes).toBe(true)
    await waitFor(() => expect(namedHeads()).toBeGreaterThan(0))
  })

  it('still plays when the music cannot be engraved', async () => {
    vi.spyOn(engine, 'engrave').mockRejectedValue(new Error('unreadable'))
    const user = userEvent.setup()
    const { audio } = await openPlayer('/play/bz5')
    expect((await screen.findAllByText('The music can’t be shown.')).length).toBeGreaterThan(0)
    await user.click(screen.getByRole('button', { name: 'Play' }))
    expect(audio.played).toHaveLength(1)
  })

  it('speaks Russian on its screen, its Setup and its pattern list', async () => {
    const user = userEvent.setup()
    await openPlayer('/play/bz5', { locale: 'ru' })
    await user.click(await screen.findByRole('button', { name: 'Настройки плеера' }))
    expect(untranslated(document.body)).toEqual([])
    await user.click(screen.getByRole('button', { name: /^Нотоносцы/ }))
    expect(untranslated(document.body)).toEqual([])
    await user.click(screen.getByRole('button', { name: 'Назад' }))
    await user.click(await screen.findByRole('radio', { name: 'Аккомпанемент' }))
    expect(untranslated(document.body)).toEqual([])
    await user.click(screen.getByRole('button', { name: /^Фактура/ }))
    expect(untranslated(document.body)).toEqual([])
  })

  it('offers no walk through the keys for a song', async () => {
    const user = userEvent.setup()
    await openPlayer('/play/bz5')
    await user.click(await screen.findByRole('button', { name: 'Player settings' }))
    expect(screen.queryByRole('combobox', { name: 'Keys' })).not.toBeInTheDocument()
  })

  it('steps its floating transport aside at a tap on the screen’s free room, back at the next (loop 25)', async () => {
    const user = userEvent.setup()
    await openPlayer('/play/bz5')
    const transport = await screen.findByRole('toolbar', { name: 'Playback' })
    const dock = transport.closest('[data-area="dock"]')
    expect(dock).toBeInTheDocument()
    expect(dock).not.toHaveAttribute('data-hidden')
    await user.click(screen.getByRole('heading', { level: 1 }))
    expect(dock).toHaveAttribute('data-hidden')
    expect(dock).toHaveAttribute('inert')
    await user.click(screen.getByRole('heading', { level: 1 }))
    expect(dock).not.toHaveAttribute('data-hidden')
  })

  it('leads its bar with Close, Play · Edit in its middle where the editor’s stands (R29, loop round 61)', async () => {
    await openPlayer('/play/bz5')
    const bar = (await screen.findByRole('radio', { name: 'Edit' })).closest('header')
    if (!bar) throw new Error('the bar')
    const lead = bar.querySelector<HTMLElement>('[data-area="lead"]')
    const middle = bar.querySelector<HTMLElement>('[data-area="middle"]')
    if (!lead || !middle) throw new Error('the bar’s lead and middle')
    expect(within(lead).getByRole('button', { name: 'Close' })).toBeInTheDocument()
    const mode = within(middle).getByRole('radiogroup', { name: 'Mode' })
    expect(within(mode).getByRole('radio', { name: 'Play' })).toBeChecked()
    expect(within(mode).getByRole('radio', { name: 'Edit' })).not.toBeChecked()
  })

  it('shows and hides the keys from the transport’s Keyboard, saved (R34, Songscription’s)', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await openPlayer('/play/bz5')
    await user.click(await screen.findByRole('button', { name: 'Keyboard' }))
    const piano = await screen.findByRole('dialog', { name: 'Piano' })
    const show = within(piano).getByRole('switch', { name: 'Show the piano' })
    const before = settingsStore.getState().scoreView.keys
    expect(show).toHaveAttribute('aria-checked', String(before))
    await user.click(show)
    expect(settingsStore.getState().scoreView.keys).toBe(!before)
  })

  it('turns to Edit at its cursor’s bar from the bar’s Edit (ADR 0115, round 26)', async () => {
    const user = userEvent.setup()
    const { router } = await openPlayer('/play/bz5?bar=3')
    const edit = await screen.findByRole('radio', { name: 'Edit' })
    // The bar it opened on is read once: the URL forgets it, the cursor stands there.
    await waitFor(() => expect(router.state.location.search).not.toHaveProperty('bar'))
    await user.click(edit)
    await waitFor(() => expect(router.state.location.pathname).toBe('/edit/bz5'))
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/Bar 3, beat 1/))
  })

  it('keeps ‹ and › pointing back and forward on a phone on its side', async () => {
    await openPlayer('/play/bz5')
    const transport = await screen.findByRole('toolbar', { name: 'Playback' })
    for (const name of ['Previous note', 'Next note']) {
      const icon = within(transport).getByRole('button', { name }).querySelector('svg')
      expect(icon?.getAttribute('class')).not.toMatch(/rotate/)
    }
  })

  it('keeps what the sheet shows in Score view, and how it plays in the music’s choices', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await openPlayer('/play/silent')
    const view = await openDisplay(user)
    const sheet = within(view).getByRole('region', { name: 'Sheet music' })
    // Switch rows (R43): what the sheet shows; which staves is the Setup's (A35).
    const shows = within(sheet).getByRole('group', { name: 'Show' })
    const names = ['Chord symbols', 'Chord positions', 'Lyrics', 'Finger numbers', 'Note names']
    const all = within(shows).getAllByRole('switch')
    expect(all).toHaveLength(names.length)
    names.forEach((name, place) =>
      expect(within(shows).getByRole('switch', { name })).toBe(all[place]),
    )
    await user.click(within(view).getByRole('switch', { name: 'Chord positions' }))
    expect(settingsStore.getState().practice.positions).toBe(true)
    await user.click(within(view).getByRole('button', { name: 'Back' }))
    const setup = await screen.findByRole('dialog', { name: 'Player settings' })
    expect(within(setup).queryByRole('switch', { name: 'Chord positions' })).not.toBeInTheDocument()
    // The count-in and the click are the transport's Practice, never the accompaniment's (ADR 0105).
    await user.click(within(setup).getByRole('radio', { name: 'Accompaniment' }))
    const playing = await screen.findByRole('dialog', { name: 'Accompaniment' })
    expect(within(playing).queryByRole('radiogroup', { name: 'Metronome' })).toBeNull()
    expect(within(playing).queryByText(/Count-in/)).toBeNull()
  })
})

describe('the words under the tune (ADR 0097)', () => {
  it('prints the verse under the tune while it plays, and hides it from Score view', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await openPlayer('/play/silent')
    await waitFor(() => expect(document.querySelectorAll('.syl').length).toBeGreaterThan(0))
    expect(document.querySelector('.syl')?.textContent?.trim()).toBe('Si')
    const view = await openDisplay(user)
    const lyrics = within(view).getByRole('switch', { name: 'Lyrics' })
    expect(lyrics).toBeChecked()
    await user.click(lyrics)
    expect(settingsStore.getState().scoreView.lyrics).toBe(false)
    await waitFor(() => expect(document.querySelectorAll('.syl')).toHaveLength(0))
  })
})

describe('a pass played in Wait mode, a lesson done (ADR 0111)', () => {
  // Both hands written: C4 over C3, then D4 over G2, a beat group a bar.
  const SONG = {
    id: 'my-1',
    title: 'Morning',
    added: '2026-11-01T09:00:00.000Z',
    key: 'C',
    meter: '4/4',
    tempo: 90,
    pattern: 'block',
    sections: [{ kind: 'verse', lines: ['C G'] }],
    hands: { rh: 'C4/4 | D4/4', lh: 'C3/4 | G2/4' },
  }
  const saved = () => {
    const storage = createMemoryStorage()
    storage.setItem(
      PIECES_STORAGE_KEY,
      JSON.stringify({ state: { songs: [SONG], nextSong: 2 }, version: PIECES_VERSION }),
    )
    return storage
  }

  it('records a lap of the loop as its bars done', async () => {
    const user = userEvent.setup()
    const { midi: keyboard, progressStore } = await openPlayer('/play/my-1?mode=wait&loop=2-2', {
      storage: saved(),
    })
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    expect(await screen.findByText('Play G D')).toBeInTheDocument()
    // D4 over G2, the keys as written.
    act(() => {
      keyboard.press(midi(62))
      keyboard.press(midi(43))
    })
    await waitFor(() =>
      expect(Object.keys(progressStore.getState().lessons)).toEqual(['my-1:bars:2-2']),
    )
  })

  it('records the whole piece played through without a loop', async () => {
    const user = userEvent.setup()
    const { midi: keyboard, progressStore } = await openPlayer('/play/my-1?mode=wait', {
      storage: saved(),
    })
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    // C4 over C3, then D4 over G2: the keys as written.
    act(() => {
      keyboard.press(midi(60))
      keyboard.press(midi(48))
    })
    expect(await screen.findByText('Play G D')).toBeInTheDocument()
    act(() => {
      keyboard.press(midi(62))
      keyboard.press(midi(43))
    })
    await waitFor(() =>
      expect(Object.keys(progressStore.getState().lessons)).toEqual(['my-1:bars:1-2']),
    )
  })
})
