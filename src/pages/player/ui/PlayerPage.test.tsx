import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { melodyOf, pieceById, PIECES, PIECES_STORAGE_KEY, PIECES_VERSION } from '@/entities/piece'
import { setPracticeToggle, setScoreView } from '@/features/set-preference'
import { createMemoryStorage, LANDSCAPE_PHONE } from '@/shared/lib'
import { midi, parseNoteName, pitchClassOf } from '@/shared/lib/music'
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

describe('Player', () => {
  it.each([
    ['a phone held upright', 'none'],
    ['a phone on its side', LANDSCAPE_PHONE],
    ['a laptop', '(min-width: 64rem)'],
  ])(
    'keeps one bar on %s: each control its icon, named by its label and title (ADR 0094)',
    async (_size, query) => {
      sizedAs(query)
      await renderApp('/play/bz5')
      await screen.findByRole('button', { name: 'View' })
      // Close, then Practise · Edit, as the editor's bar has them; the title is on the sheet.
      const controls = [
        ...document.querySelectorAll(
          ':is([data-area="lead"], [data-area="actions"]) :is(button, a)',
        ),
      ]
      expect(controls.map((control) => control.getAttribute('aria-label'))).toEqual([
        'Close',
        'Edit',
        'Loop',
        'View',
        'MIDI keyboard',
        'Setup',
      ])
      for (const control of controls) {
        const name = control.getAttribute('aria-label') ?? ''
        expect(shownText(control), name).toBe('')
        expect(control.getAttribute('title'), name).toMatch(new RegExp(`^${name}`))
      }
      // The current mode too: its icon, its name a screen reader's and its tooltip's.
      const practise = screen.getByText('Practise').closest('[aria-current="page"]')
      expect(practise).toHaveAttribute('title', 'Practise')
      expect(shownText(practise as Element)).toBe('')
    },
  )

  it('says an own song is gone once another tab deletes it', async () => {
    const storage = createMemoryStorage()
    const song = {
      id: 'my-1',
      title: 'Morning',
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
    const { piecesStore } = await renderApp('/play/my-1', { storage })
    await screen.findByRole('button', { name: 'Play' })
    act(() => piecesStore.setState({ songs: [] }))
    expect(await screen.findByRole('link', { name: 'Go to Songs' })).toBeInTheDocument()
  })

  it('shows a song that hides its piano as a lead sheet: the tune’s staff alone (ADR 0083)', async () => {
    const storage = createMemoryStorage()
    const song = {
      id: 'my-1',
      title: 'Morning',
      key: 'G',
      meter: '4/4',
      tempo: 90,
      pattern: 'r1',
      sections: [{ kind: 'verse', lines: ['G C'] }],
      melody: 'B4/4 | C5/4',
      leadSheet: true,
    }
    storage.setItem(
      PIECES_STORAGE_KEY,
      JSON.stringify({ state: { songs: [song], nextSong: 2 }, version: PIECES_VERSION }),
    )
    await renderApp('/play/my-1', { storage })
    const staves = () =>
      [...document.querySelectorAll('[data-slot="score"] g.staff[data-staff]')].map((staff) =>
        staff.getAttribute('data-staff'),
      )
    await waitFor(() => expect(staves().length).toBeGreaterThan(0), { timeout: 4000 })
    expect(new Set(staves())).toEqual(new Set(['melody']))
  })

  it('plays a song of bars of no chord: its written notes, each bar named by its number (ADR 0094)', async () => {
    const storage = createMemoryStorage()
    const song = {
      id: 'my-1',
      title: 'Morning',
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
    await renderApp('/play/my-1', { storage })
    expect(await screen.findByRole('button', { name: 'Bar 1: G' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Bar 2' })).toBeInTheDocument()
  })

  it('shows the score as its View menu says, remembered for every piece', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/play/romashki')
    await user.click(await screen.findByRole('button', { name: 'View' }))
    await user.click(await screen.findByRole('radio', { name: 'Pages' }))
    expect(settingsStore.getState().scoreView.layout).toBe('pages')
    expect((await screen.findAllByText('1', { selector: 'span' })).length).toBeGreaterThan(0)
    expect(document.querySelector('[data-slot="sheet-page"]')).toBeInTheDocument()
    await user.click(screen.getByRole('switch', { name: 'Sheet music' }))
    expect(screen.queryByRole('region', { name: 'Sheet music' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('switch', { name: 'Keys' }))
    expect(settingsStore.getState().scoreView).toMatchObject({ notation: false, keys: false })
  })

  it('holds the tempo, ‹, Play, › and the hands in one toolbar named Playback', async () => {
    await renderApp('/play/romashki')
    const dock = await screen.findByRole('toolbar', { name: 'Playback' })
    const names = within(dock)
      .getAllByRole('button')
      .map((button) => button.getAttribute('aria-label'))
    expect(names).toEqual(['Tempo: 100%', 'Back', 'Play', 'Next', 'Hands: Both hands'])
    expect(within(dock).getByRole('button', { name: 'Play' })).toHaveAttribute(
      'title',
      'Play (Space)',
    )
  })

  it('docks the keys at the foot, under the toolbar, unless the settings dock them at the top', async () => {
    const { settingsStore } = await renderApp('/play/romashki')
    const dock = await screen.findByRole('toolbar', { name: 'Playback' })
    const keys = screen.getByRole('group', { name: 'Keyboard' })
    expect(dock.compareDocumentPosition(keys) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    act(() => settingsStore.setState((state) => ({ keyboard: { ...state.keyboard, dock: 'top' } })))
    const top = screen.getByRole('group', { name: 'Keyboard' })
    expect(dock.compareDocumentPosition(top) & Node.DOCUMENT_POSITION_PRECEDING).toBeTruthy()
  })

  it('plays «Ромашковые поля»’s recording along in Listen, from bar 1, slowed to the chart’s tempo', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/play/romashki')
    const play = await screen.findByRole('button', { name: 'Play' })
    expect(audio.loadedRecordings).toHaveLength(1)
    await user.click(play)
    const [first] = audio.recordings
    // Sung at 73 over a chart at 72.
    expect(first?.play.rate).toBe(72 / 73)
    expect(first?.play.offset).toBe(pieceById('romashki')?.recording?.start)
  })

  it('plays the recording at half the chart’s tempo at 50%', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/play/romashki?tempo=36')
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    expect(audio.recordings[0]?.play.rate).toBe(36 / 73)
  })

  it('plays no recording in another key, and says why in the Setup', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/play/romashki?key=E')
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    expect(audio.recordings).toEqual([])
    await user.click(screen.getByRole('button', { name: 'Setup' }))
    const recording = await screen.findByRole('button', { name: /^Recording/ })
    expect(recording).toBeDisabled()
    expect(recording).toHaveAttribute('aria-pressed', 'false')
    expect(recording).toHaveTextContent('Only in D minor')
  })

  it('plays no recording in Wait mode', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/play/romashki?mode=wait')
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    expect(audio.recordings).toEqual([])
  })

  it('plays no recording with its toggle off, and saves the toggle', async () => {
    const user = userEvent.setup()
    const { audio, settingsStore } = await renderApp('/play/romashki')
    await user.click(await screen.findByRole('button', { name: 'Setup' }))
    await user.click(await screen.findByRole('button', { name: 'Recording' }))
    expect(settingsStore.getState().practice.recording).toBe(false)
    await user.keyboard('{Escape}')
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    expect(audio.recordings).toEqual([])
  })

  it('opens a song with its title, tempo, hands and sheet music, and records it as practised', async () => {
    const { progressStore } = await renderApp('/play/bz5')
    // The title printed at the sheet's head, the bar holding Close and the screen's buttons (ADR 0094).
    const sheet = await screen.findByRole('region', { name: 'Sheet music' })
    expect(
      within(sheet).getByRole('heading', { level: 1, name: 'Still, my soul, be still' }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tempo: 100%' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Hands: Both hands' })).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: 'Bar 1: G' })).toBeInTheDocument()
    expect(progressStore.getState().practised.bz5).toBeDefined()
  })

  it('reads a stale URL as the piece’s own setup', async () => {
    const { router } = await renderApp('/play/bz5?key=H&tempo=999&mode=step&loop=9-3&swing=yes')
    expect(await screen.findByRole('button', { name: 'Tempo: 100%' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Loop' })).toHaveAttribute('aria-pressed', 'false')
    expect(router.state.location.search).toEqual({})
  })

  it('plays in Listen and stops', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/play/bz5')
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    expect(audio.played).toHaveLength(1)
    await user.click(screen.getByRole('button', { name: 'Stop' }))
    expect(audio.stops).toBeGreaterThan(0)
  })

  it('falls silent, every key up, when the learner leaves while Listen plays the recording', async () => {
    const user = userEvent.setup()
    const { audio, router } = await renderApp('/play/romashki')
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
    const { audio } = await renderApp('/play/bz5')
    await user.click(await screen.findByRole('button', { name: 'Next' }))
    await user.click(screen.getByRole('button', { name: 'Back' }))
    expect(audio.played).toHaveLength(2)
  })

  it('chooses Wait mode and a speed from the tempo popover', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/bz5')
    await user.click(await screen.findByRole('button', { name: 'Tempo: 100%' }))
    await user.click(await screen.findByRole('option', { name: 'Wait mode' }))
    expect(router.state.location.search).toMatchObject({ mode: 'wait' })
    await user.click(screen.getByRole('button', { name: 'Tempo: Wait' }))
    await user.click(await screen.findByRole('option', { name: '50% speed' }))
    expect(router.state.location.search).toEqual({ tempo: 36 })
  })

  it('waits for the notes in Wait mode once playing, says a wrong key, and takes the right ones from MIDI', async () => {
    const user = userEvent.setup()
    // The song's pattern opens with the left hand alone, so the left hand has notes to play at once.
    const { midi: midiKeyboard } = await renderApp('/play/bz5?mode=wait&hands=lh')
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    const prompt = await screen.findByText(/^Play /)
    const notes = prompt.textContent?.replace(/^Play /, '').split(' ') ?? []
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    // C sharp is outside G major's first chord (G B D).
    await user.click(within(keyboard).getByRole('button', { name: 'C sharp 4' }))
    expect(await screen.findByText(/^Not C/)).toBeInTheDocument()
    act(() => {
      for (const name of notes) {
        const spelled = parseNoteName(name)
        if (!spelled) throw new Error(name)
        midiKeyboard.press(midi(60 + pitchClassOf(spelled)))
      }
    })
    expect(await screen.findByText('Correct')).toBeInTheDocument()
  })

  it('chooses a hand, muting the other staff', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/bz5')
    await user.click(await screen.findByRole('button', { name: 'Hands: Both hands' }))
    await user.click(await screen.findByRole('option', { name: 'Left hand' }))
    expect(router.state.location.search).toMatchObject({ hands: 'lh' })
    expect(document.querySelector('[data-slot="score"]')).toHaveAttribute('data-muted', 'treble')
  })

  it('loops the bar the cursor is in, and removes the loop', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/bz5')
    await user.click(await screen.findByRole('button', { name: 'Loop' }))
    expect(router.state.location.search).toMatchObject({ loop: '1-1' })
    expect(await screen.findByRole('slider', { name: 'Loop end' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Loop' }))
    expect(router.state.location.search).not.toHaveProperty('loop')
  })

  it('changes the key and swing in the Setup sheet', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/bz5')
    await user.click(await screen.findByRole('button', { name: 'Setup' }))
    await user.click(
      within(await screen.findByRole('group', { name: 'Key' })).getByRole('radio', { name: 'A' }),
    )
    expect(router.state.location.search).toMatchObject({ key: 'A' })
    await user.click(screen.getByRole('button', { name: 'Swing' }))
    expect(router.state.location.search).toMatchObject({ key: 'A', swing: true })
  })

  it('shows all twelve keys in the Setup, the piece’s chosen, and Melody only for a piece with a tune', async () => {
    const user = userEvent.setup()
    await renderApp('/play/bz5')
    await user.click(await screen.findByRole('button', { name: 'Setup' }))
    const key = await screen.findByRole('group', { name: 'Key' })
    expect(within(key).getByRole('radio', { name: 'G' })).toBeChecked()
    expect(within(key).getByText('G major')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Melody' })).not.toBeInTheDocument()
  })

  it('shows Melody in the Setup of a piece with a tune', async () => {
    const withTune = PIECES.find((piece) => melodyOf(piece) !== undefined)
    if (!withTune) throw new Error('no piece has a tune')
    const user = userEvent.setup()
    await renderApp(`/play/${withTune.id}`)
    await user.click(await screen.findByRole('button', { name: 'Setup' }))
    expect(await screen.findByRole('button', { name: 'Melody' })).toBeInTheDocument()
  })

  it('puts the fingers under the keys with Finger numbers', async () => {
    const { settingsStore } = await renderApp('/play/bz5')
    await screen.findByRole('group', { name: 'Keyboard' })
    expect(document.querySelector('[data-slot="finger-row"]')).not.toBeInTheDocument()
    act(() => setPracticeToggle(settingsStore, 'fingerNumbers', true))
    expect(document.querySelector('[data-slot="finger-row"]')).toBeInTheDocument()
  })

  it('names the notes on the staff with Named notes, and saves the toggle', async () => {
    // SMuFL's note name noteheads, U+E150–U+E1AF.
    const namedHeads = () => document.querySelectorAll('[data-slot="score"] svg g.note-name').length
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/play/bz5')
    await waitFor(() => expect(document.querySelector('[data-slot="score"] svg')).not.toBeNull())
    expect(namedHeads()).toBe(0)
    await user.click(await screen.findByRole('button', { name: 'View' }))
    await user.click(await screen.findByRole('switch', { name: 'Note names' }))
    expect(settingsStore.getState().practice.namedNotes).toBe(true)
    await waitFor(() => expect(namedHeads()).toBeGreaterThan(0))
  })

  it('still plays when the music cannot be engraved', async () => {
    vi.spyOn(engine, 'engrave').mockRejectedValue(new Error('unreadable'))
    const user = userEvent.setup()
    const { audio } = await renderApp('/play/bz5')
    expect((await screen.findAllByText('The music can’t be shown.')).length).toBeGreaterThan(0)
    await user.click(screen.getByRole('button', { name: 'Play' }))
    expect(audio.played).toHaveLength(1)
  })

  it('speaks Russian on its screen, its Setup and its pattern list', async () => {
    const user = userEvent.setup()
    await renderApp('/play/bz5', { locale: 'ru' })
    await user.click(await screen.findByRole('button', { name: 'Параметры' }))
    expect(untranslated(document.body)).toEqual([])
    await user.click(screen.getByRole('button', { name: /^Фактура/ }))
    expect(untranslated(document.body)).toEqual([])
  })

  it('offers no walk through the keys for a song', async () => {
    const user = userEvent.setup()
    await renderApp('/play/bz5')
    await user.click(await screen.findByRole('button', { name: 'Setup' }))
    expect(screen.queryByRole('combobox', { name: 'Through the keys' })).not.toBeInTheDocument()
  })

  it('hides its transport at a tap on the screen’s free room, and brings it back', async () => {
    const user = userEvent.setup()
    await renderApp('/play/bz5')
    const transport = await screen.findByRole('toolbar', { name: 'Playback' })
    const dock = transport.closest('[data-area="dock"]')
    await user.click(screen.getByRole('heading', { level: 1 }))
    expect(dock).toHaveAttribute('data-hidden')
    expect(dock).toHaveAttribute('inert')
    await user.click(screen.getByRole('heading', { level: 1 }))
    expect(dock).not.toHaveAttribute('data-hidden')
  })

  it('turns to Edit at its cursor’s bar from the Practise · Edit switch, after Close (ADR 0090)', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/bz5?bar=3')
    const modes = await screen.findByRole('navigation', { name: 'Practise or edit' })
    expect(within(modes).getByText('Practise').closest('[aria-current="page"]')).not.toBeNull()
    // The bar it opened on is read once: the URL forgets it, the cursor stands there.
    await waitFor(() => expect(router.state.location.search).not.toHaveProperty('bar'))
    const edit = within(modes).getByRole('link', { name: 'Edit' })
    expect(edit.getAttribute('href')).toBe('/edit/bz5?bar=3')
    await user.click(edit)
    await waitFor(() => expect(router.state.location.pathname).toBe('/edit/bz5'))
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/Bar 3, beat 1/))
  })
  it('keeps ‹ and › pointing back and forward on a phone on its side, unlike the tempo’s ↑ ↓', async () => {
    await renderApp('/play/bz5')
    const transport = await screen.findByRole('toolbar', { name: 'Playback' })
    for (const name of ['Back', 'Next']) {
      const icon = within(transport).getByRole('button', { name }).querySelector('svg')
      expect(icon?.getAttribute('class')).not.toMatch(/rotate/)
    }
  })

  it('keeps what the sheet shows in the View, the editor’s with what only practice has, and how it plays in the Setup', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/play/bz5')
    await user.click(await screen.findByRole('button', { name: 'View' }))
    const view = await screen.findByRole('dialog', { name: 'View' })
    // The editor's View, one menu (ADR 0094): the layout, the staves, what is shown, then the
    // Player's own.
    expect(
      within(view)
        .getAllByRole('region')
        .map((section) => section.getAttribute('aria-label')),
    ).toEqual(['Layout', 'Staves', 'Show'])
    const switches = within(view).getAllByRole('switch')
    expect(switches).toHaveLength(10)
    ;[
      'Melody',
      'Upper staff',
      'Lower staff',
      'Chord symbols',
      'Lyrics',
      'Keys',
      'Sheet music',
      /^Chord positions/,
      'Finger numbers',
      'Note names',
    ].forEach((name, i) => expect(switches[i]).toHaveAccessibleName(name))
    await user.click(within(view).getByRole('switch', { name: 'Upper staff' }))
    expect(settingsStore.getState().scoreView.hidden).toEqual(['treble'])
    await user.click(within(view).getByRole('switch', { name: /^Chord positions/ }))
    expect(settingsStore.getState().practice.positions).toBe(true)
    await user.keyboard('{Escape}')
    await user.click(screen.getByRole('button', { name: 'Setup' }))
    const setup = await screen.findByRole('dialog', { name: 'Setup' })
    expect(within(setup).queryByRole('button', { name: 'Chord positions' })).not.toBeInTheDocument()
    const playing = within(setup).getByRole('region', { name: 'How it plays' })
    expect(within(playing).getByRole('button', { name: 'Metronome' })).toBeInTheDocument()
  })
})

describe('the words under the tune (ADR 0093)', () => {
  it('prints the verse under the melody while it plays, and hides it from the View', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/play/silent')
    act(() => setPracticeToggle(settingsStore, 'melody', true))
    await waitFor(() => expect(document.querySelectorAll('.syl').length).toBeGreaterThan(0))
    expect(document.querySelector('.syl')?.textContent?.trim()).toBe('Si')
    await user.click(await screen.findByRole('button', { name: 'View' }))
    const view = await screen.findByRole('dialog', { name: 'View' })
    const lyrics = within(view).getByRole('switch', { name: 'Lyrics' })
    expect(lyrics).toBeChecked()
    await user.click(lyrics)
    expect(settingsStore.getState().scoreView.lyrics).toBe(false)
    await waitFor(() => expect(document.querySelectorAll('.syl')).toHaveLength(0))
  })
})

describe('the chord chart, with the sheet music off (ADR 0098)', () => {
  /** A piece in the Player, the View's Sheet music turned off once it is open. */
  async function withoutNotation(path: string, options?: Parameters<typeof renderApp>[1]) {
    const opened = await renderApp(path, options)
    await screen.findByRole('heading', { level: 1 })
    act(() => setScoreView(opened.settingsStore, { notation: false }))
    return opened
  }

  it('shows the song’s chord chart by section where the sheet music was, under its title', async () => {
    await withoutNotation('/play/bz5')
    expect(screen.queryByRole('region', { name: 'Sheet music' })).not.toBeInTheDocument()
    const chart = screen.getByRole('region', { name: 'Chord chart' })
    expect(
      within(chart).getByRole('heading', { level: 1, name: 'Still, my soul, be still' }),
    ).toBeInTheDocument()
    expect(
      within(chart)
        .getAllByRole('heading', { level: 2 })
        .map((heading) => heading.textContent),
    ).toEqual(['Verse', 'Chorus', 'Ending'])
    expect(within(chart).getAllByRole('button', { name: /^Bar / })).toHaveLength(19)
    expect(within(chart).getByRole('button', { name: 'Bar 1: G' })).toHaveAttribute(
      'aria-current',
      'step',
    )
  })

  it('marks the bar that plays as it plays', async () => {
    const user = userEvent.setup()
    const { audio } = await withoutNotation('/play/bz5')
    await user.click(screen.getByRole('button', { name: 'Play' }))
    const start = audio.played[0]?.at ?? 0
    // A bar of 4/4 at 72 BPM lasts 4 × 60 / 72 seconds.
    act(() => audio.setNow(start + (4 * 60) / 72 + 0.2))
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Bar 2: C' })).toHaveAttribute(
        'aria-current',
        'step',
      ),
    )
    expect(screen.getByRole('button', { name: 'Bar 1: G' })).not.toHaveAttribute('aria-current')
  })

  it('goes to a bar tapped, kept in sight: it sounds where it lands, on the keys, and Edit opens there', async () => {
    const user = userEvent.setup()
    const { audio } = await withoutNotation('/play/bz5')
    const scrolled = vi.mocked(Element.prototype.scrollIntoView)
    scrolled.mockClear()
    const bar = screen.getByRole('button', { name: 'Bar 3: Em G/B' })
    await user.click(bar)
    expect(bar).toHaveAttribute('aria-current', 'step')
    expect(scrolled.mock.contexts).toEqual([bar])
    expect(screen.getByRole('link', { name: 'Edit' })).toHaveAttribute('href', '/edit/bz5?bar=3')
    // Nothing plays: the move sounds where it lands, its keys going down.
    expect(audio.played).toHaveLength(1)
    act(() => audio.setNow((audio.played[0]?.at ?? 0) + 0.05))
    const down = within(screen.getByRole('group', { name: 'Keyboard' }))
      .getAllByRole('button')
      .filter((key) => key.hasAttribute('data-down'))
      .map((key) => key.getAttribute('aria-label'))
    expect(down.length).toBeGreaterThan(0)
    // E minor's: E, G and B in any octave.
    expect(down.every((name) => /^[EGB]\d$/.test(name ?? ''))).toBe(true)
  })

  it('reads in Russian', async () => {
    await withoutNotation('/play/bz5', { locale: 'ru' })
    expect(screen.getByRole('region', { name: 'Аккорды по тактам' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Припев' })).toBeInTheDocument()
    expect(untranslated(document.body)).toEqual([])
  })

  it('shows a bar of no chord as an empty bar named by its number, which a tap goes to (ADR 0094)', async () => {
    const user = userEvent.setup()
    const storage = createMemoryStorage()
    const song = {
      id: 'my-1',
      title: 'Morning',
      key: 'G',
      meter: '4/4',
      tempo: 90,
      pattern: 'r1',
      sections: [{ kind: 'verse', lines: ['G _ D _'] }],
      hands: { rh: 'B4/4 | D5/4 | A4/4 | G4/4', lh: 'r/4 | r/4 | r/4 | r/4' },
    }
    storage.setItem(
      PIECES_STORAGE_KEY,
      JSON.stringify({ state: { songs: [song], nextSong: 2 }, version: PIECES_VERSION }),
    )
    await withoutNotation('/play/my-1', { storage })
    const chart = screen.getByRole('region', { name: 'Chord chart' })
    expect(
      within(chart)
        .getAllByRole('button', { name: /^Bar / })
        .map((bar) => [bar.getAttribute('aria-label'), bar.textContent]),
    ).toEqual([
      ['Bar 1: G', '1G'],
      ['Bar 2', '2'],
      ['Bar 3: D', '3D'],
      ['Bar 4', '4'],
    ])
    const empty = within(chart).getByRole('button', { name: 'Bar 4' })
    await user.click(empty)
    expect(empty).toHaveAttribute('aria-current', 'step')
  })
})
