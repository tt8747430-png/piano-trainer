import { act, fireEvent, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, onTestFinished, vi } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { isDegreePiece, musicOf, pieceById, PIECES_STORAGE_KEY } from '@/entities/piece'
import { setKeyboard } from '@/features/set-preference'
import { createMemoryStorage, LANDSCAPE_PHONE } from '@/shared/lib'
import { midi } from '@/shared/lib/music'

const SONG = {
  id: 'my-1',
  title: 'Morning',
  key: 'G',
  meter: '4/4',
  tempo: 90,
  pattern: 'r1',
  sections: [{ kind: 'verse', lines: ['G G G G'] }],
}
const withSong = () => {
  const storage = createMemoryStorage()
  storage.setItem(
    PIECES_STORAGE_KEY,
    JSON.stringify({ state: { songs: [SONG], nextSong: 2 }, version: 1 }),
  )
  return storage
}
/**
 * Puts the caret in bar 1's chord row, as a click over its staff does: jsdom lays nothing out, so a
 * click lands at the bar's top, in the chord row.
 */
const toChordRow = async (user: ReturnType<typeof userEvent.setup>) =>
  user.click(await screen.findByRole('button', { name: /^Bar 1:/ }))

/** Adds the tune's staff from the + menu's Staves, as a notation app adds an instrument. */
async function addMelodyStaff(user: ReturnType<typeof userEvent.setup>) {
  await addFrom(user, 'Staves', 'Melody staff')
}

/** Opens the + menu at a tab and chooses a tile, which closes it. */
async function addFrom(user: ReturnType<typeof userEvent.setup>, tab: string, tile: string) {
  await user.click(await screen.findByRole('button', { name: 'Add to the score' }))
  const menu = await screen.findByRole('dialog', { name: 'Add' })
  await user.click(within(menu).getByRole('tab', { name: tab }))
  await user.click(within(menu).getByRole('button', { name: tile }))
  await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Add' })).not.toBeInTheDocument())
}

/** The chord palette's Type tab, and its field. */
async function openChordField(user: ReturnType<typeof userEvent.setup>) {
  await user.click(await screen.findByRole('tab', { name: 'Type' }))
  return screen.findByRole('textbox', { name: 'Chord' })
}

/** Opens the settings sheet. */
async function openSettings(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: 'Settings' }))
  return screen.findByRole('dialog', { name: 'Settings' })
}

const songOf = (state: { songs: readonly { id: string }[] }) =>
  state.songs.find((song) => song.id === 'my-1')

describe('the score editor', () => {
  it('opens on the right hand of a song with no tune, Alt with the arrows choosing the row it writes', async () => {
    const user = userEvent.setup()
    await renderApp('/edit/my-1', { storage: withSong() })
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/^Right hand · Bar 1/))
    const palette = screen.getByRole('region', { name: 'Tools' })
    expect(within(palette).queryByRole('radiogroup', { name: 'Voice' })).not.toBeInTheDocument()
    await user.keyboard('{Alt>}{ArrowDown}{/Alt}')
    expect(screen.getByRole('status')).toHaveTextContent(/^Left hand · Bar 1/)
    await user.keyboard('{Alt>}{ArrowUp}{ArrowUp}{/Alt}')
    expect(screen.getByRole('status')).toHaveTextContent(/^Chords · /)
    // In the chord names' row the palette is theirs, in place of the notes' tabs.
    const chords = screen.getByRole('region', { name: 'Tools' })
    expect(
      within(chords).getByRole('tablist', { name: 'Ways to write a chord' }),
    ).toBeInTheDocument()
    expect(within(chords).getByRole('group', { name: 'Chords in the key' })).toBeInTheDocument()
    expect(within(chords).queryByRole('tab', { name: 'Notes' })).not.toBeInTheDocument()
  })

  it('folds its palette into a button over the sheet, and opens it again', async () => {
    const user = userEvent.setup()
    await renderApp('/edit/my-1', { storage: withSong() })
    const palette = await screen.findByRole('region', { name: 'Tools' })
    await user.click(within(palette).getByRole('button', { name: 'Hide the tools' }))
    expect(screen.queryByRole('region', { name: 'Tools' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Show the tools' }))
    expect(
      within(screen.getByRole('region', { name: 'Tools' })).getByRole('group', {
        name: 'Note value',
      }),
    ).toBeInTheDocument()
  })

  it('adds the tune’s staff, hides it keeping its notes, and removes it with them', async () => {
    const user = userEvent.setup({ delay: 120 })
    const { piecesStore, settingsStore } = await renderApp('/edit/my-1', { storage: withSong() })
    act(() => setKeyboard(settingsStore, { typing: true }))
    await addMelodyStaff(user)
    expect(screen.getByRole('status')).toHaveTextContent(/^Melody · Bar 1/)
    await user.keyboard('a')
    await waitFor(() => expect(songOf(piecesStore.getState())).toMatchObject({ melody: 'C4/1' }))
    const settings = await openSettings(user)
    await user.click(within(settings).getByRole('button', { name: 'Hide Melody' }))
    await waitFor(() =>
      expect(songOf(piecesStore.getState())).toMatchObject({ melody: 'C4/1', hidden: ['melody'] }),
    )
    await user.click(within(settings).getByRole('button', { name: 'Show Melody' }))
    await user.click(within(settings).getByRole('button', { name: /^Remove Melody/ }))
    await waitFor(() => expect(songOf(piecesStore.getState())).not.toHaveProperty('melody'))
  })

  it('keeps an empty tune’s staff the song was given', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', { storage: withSong() })
    await addMelodyStaff(user)
    await waitFor(() => expect(songOf(piecesStore.getState())).toHaveProperty('melody'))
  })

  it('writes the note on the line double-clicked, and moves it by the key’s notes as it is dragged', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', { storage: withSong() })
    // The first engraving of a run loads the music font and VexFlow: about a second on its own.
    const bar = await screen.findByRole('button', { name: /^Bar 1:/ }, { timeout: 4000 })
    // jsdom lays nothing out: the bar's top is the chord row's, 44px over the treble's top line (F♯5 in
    // G); the tempo stands in that row (ADR 0074), so the staff starts there.
    fireEvent.click(bar, { clientY: 84, detail: 1 })
    fireEvent.doubleClick(bar, { clientY: 84, detail: 2 })
    await waitFor(() =>
      expect(songOf(piecesStore.getState())).toMatchObject({
        hands: { rh: expect.stringMatching(/^F#5\/1/) },
      }),
    )
    await user.keyboard('{ArrowLeft}')
    // jsdom has no pointer capture: the grip asks for it as a drag starts.
    Object.defineProperty(Element.prototype, 'setPointerCapture', {
      value: vi.fn(),
      configurable: true,
    })
    onTestFinished(() => {
      Reflect.deleteProperty(Element.prototype, 'setPointerCapture')
    })
    const grip = document.querySelector('[data-slot="note-grip"]')
    if (!grip) throw new Error('the note at the caret is a grip')
    fireEvent.pointerDown(grip, { clientY: 100, pointerId: 1 })
    fireEvent.pointerMove(grip, { clientY: 90, pointerId: 1 })
    fireEvent.pointerUp(grip, { clientY: 90, pointerId: 1 })
    await waitFor(() =>
      expect(songOf(piecesStore.getState())).toMatchObject({
        hands: { rh: expect.stringMatching(/^A5\/1/) },
      }),
    )
  })

  it('folds its keys into a Keys button, and back', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/edit/my-1', { storage: withSong() })
    await user.click(await screen.findByRole('button', { name: 'Hide the keys' }))
    expect(settingsStore.getState().keyboard.folded).toBe(true)
    expect(screen.queryByRole('button', { name: 'Hide the keys' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Keys' }))
    expect(settingsStore.getState().keyboard.folded).toBe(false)
    expect(screen.getByRole('button', { name: 'Hide the keys' })).toBeInTheDocument()
  })

  it('hides the chord names, and a click over the staff then writes the staff under it', async () => {
    const user = userEvent.setup()
    await renderApp('/edit/my-1', { storage: withSong() })
    await toChordRow(user)
    expect(screen.getByRole('status')).toHaveTextContent(/^Chords · /)
    // What the score shows: in the settings, behind the gear.
    const settings = await openSettings(user)
    await user.click(within(settings).getByRole('button', { name: 'Hide Chord names' }))
    expect(within(settings).getByRole('button', { name: 'Show Chord names' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    await user.keyboard('{Escape}')
    expect(screen.getByRole('status')).toHaveTextContent(/^Right hand · /)
    await toChordRow(user)
    expect(screen.getByRole('status')).toHaveTextContent(/^Right hand · /)
  })

  it('says the song is gone once another tab deletes it, keeping no take for it', async () => {
    const { piecesStore } = await renderApp('/edit/my-1', { storage: withSong() })
    await screen.findByRole('status')
    act(() => piecesStore.setState({ songs: [] }))
    expect(await screen.findByRole('link', { name: 'Go to Songs' })).toBeInTheDocument()
  })

  it('opens the song’s key, tempo and meter from the clef and signatures at a line’s head', async () => {
    const user = userEvent.setup()
    await renderApp('/edit/my-1', { storage: withSong() })
    const [head] = await screen.findAllByRole('button', { name: 'Key and time signature' })
    if (!head) throw new Error('no line head')
    await user.click(head)
    const settings = await screen.findByRole('dialog', { name: 'Settings' })
    expect(within(settings).getByRole('group', { name: 'Key' })).toBeInTheDocument()
    expect(within(settings).queryByRole('combobox', { name: 'Pattern' })).not.toBeInTheDocument()
  })

  it('puts a repeat round the caret’s bar from the + menu’s Barlines, saved in the chart', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', { storage: withSong() })
    await screen.findByRole('status')
    await addFrom(user, 'Barlines', 'Start repeat')
    await addFrom(user, 'Barlines', 'End repeat')
    await waitFor(() =>
      expect(songOf(piecesStore.getState())).toMatchObject({
        sections: [{ lines: ['|: G :| G G G'] }],
      }),
    )
  })

  it('puts a jump and Fine on the caret’s bar, and sets the tempo from the + menu’s Text', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', { storage: withSong() })
    await screen.findByRole('status')
    await addFrom(user, 'Barlines', 'Fine')
    await addFrom(user, 'Barlines', 'D.C. al Fine')
    await addFrom(user, 'Text', 'Allegro, 130 a minute')
    await waitFor(() =>
      expect(songOf(piecesStore.getState())).toMatchObject({
        tempo: 130,
        sections: [{ lines: ['G Fine DC.Fine G G G'] }],
      }),
    )
  })

  it('changes the left hand’s clef at the caret’s bar from the + menu’s Staves', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', { storage: withSong() })
    await screen.findByRole('status')
    await addFrom(user, 'Staves', 'Left hand, treble clef')
    await waitFor(() =>
      expect(songOf(piecesStore.getState())).toMatchObject({
        hands: { lh: 'clef:treble - | - | - | -' },
      }),
    )
    await user.click(screen.getByRole('button', { name: 'Add to the score' }))
    const menu = await screen.findByRole('dialog', { name: 'Add' })
    await user.click(within(menu).getByRole('tab', { name: 'Staves' }))
    expect(within(menu).getByRole('button', { name: 'Left hand, treble clef' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('adds a key signature and a bar’s own length from the + menu’s tiles', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', { storage: withSong() })
    await addFrom(user, 'Key', 'D major')
    await waitFor(() => expect(songOf(piecesStore.getState())).toMatchObject({ key: 'D' }))
    await user.click(screen.getByRole('button', { name: 'Add to the score' }))
    const menu = await screen.findByRole('dialog', { name: 'Add' })
    await user.click(within(menu).getByRole('tab', { name: 'Time' }))
    expect(
      within(within(menu).getByRole('region', { name: 'The song' })).getByRole('button', {
        name: '4/4',
      }),
    ).toHaveAttribute('aria-pressed', 'true')
    await user.click(
      within(within(menu).getByRole('region', { name: 'This bar' })).getByRole('button', {
        name: '2/4',
      }),
    )
    await waitFor(() =>
      expect(songOf(piecesStore.getState())).toMatchObject({
        sections: [{ lines: ['D@2 D D D'] }],
      }),
    )
  })

  it('changes the time signature to another of its kind, each bar made the new one', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', { storage: withSong() })
    const [head] = await screen.findAllByRole('button', { name: 'Key and time signature' })
    if (!head) throw new Error('no line head')
    await user.click(head)
    const meters = within(await screen.findByRole('dialog', { name: 'Settings' })).getByRole(
      'radiogroup',
      { name: 'Time signature' },
    )
    expect(
      within(meters)
        .getAllByRole('radio')
        .map((meter) => meter.textContent),
    ).toEqual(['2/4', '3/4', '4/4'])
    await user.click(within(meters).getByRole('radio', { name: '3/4' }))
    expect(songOf(piecesStore.getState())).toMatchObject({ meter: '3/4' })
  })

  it('names a section as a song’s part, nothing a songbook calls its own', async () => {
    const user = userEvent.setup()
    await renderApp('/edit/my-1', { storage: withSong() })
    await user.click(await screen.findByRole('button', { name: /Verse/ }))
    const menu = await screen.findByRole('dialog', { name: 'Section' })
    expect(
      within(menu)
        .getAllByRole('button')
        .map((item) => item.textContent),
    ).toEqual(['Intro', 'Chorus', 'Bridge', 'Ending'])
  })

  it('adds a voice’s staff from the + menu, writes it, and takes it away in the settings', async () => {
    const user = userEvent.setup({ delay: 120 })
    const { piecesStore, settingsStore } = await renderApp('/edit/my-1', { storage: withSong() })
    act(() => setKeyboard(settingsStore, { typing: true }))
    await addFrom(user, 'Staves', 'Voice')
    expect(screen.getByRole('status')).toHaveTextContent(/^Voice 2 · Bar 1/)
    await user.keyboard('d')
    await waitFor(() => expect(songOf(piecesStore.getState())).toMatchObject({ voices: ['E4/1'] }))
    const settings = await openSettings(user)
    // Hidden, its notes stay; removed, they go.
    await user.click(within(settings).getByRole('button', { name: 'Hide Voice 2' }))
    await waitFor(() =>
      expect(songOf(piecesStore.getState())).toMatchObject({
        voices: ['E4/1'],
        hidden: ['voice2'],
      }),
    )
    await user.click(within(settings).getByRole('button', { name: /^Remove Voice 2/ }))
    await waitFor(() => expect(songOf(piecesStore.getState())).not.toHaveProperty('voices'))
  })

  it('adds an instrument from the + menu, its part saved on it, and changes it in the settings', async () => {
    const user = userEvent.setup({ delay: 120 })
    const { piecesStore, settingsStore } = await renderApp('/edit/my-1', { storage: withSong() })
    act(() => setKeyboard(settingsStore, { typing: true }))
    await addFrom(user, 'Staves', 'Cello')
    await user.keyboard('d')
    await waitFor(() =>
      expect(songOf(piecesStore.getState())).toMatchObject({ instruments: ['voice', 'cello'] }),
    )
    const settings = await openSettings(user)
    await user.click(within(settings).getByRole('combobox', { name: 'Voice 2' }))
    await user.click(await screen.findByRole('option', { name: 'Flute' }))
    await waitFor(() =>
      expect(songOf(piecesStore.getState())).toMatchObject({ instruments: ['voice', 'flute'] }),
    )
  })

  it('gives a section a pattern of its own from its heading’s menu, named beside it', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', { storage: withSong() })
    await user.click(await screen.findByRole('button', { name: /Verse/ }))
    const menu = await screen.findByRole('dialog', { name: 'Section' })
    await user.click(within(menu).getByRole('combobox', { name: 'Pattern' }))
    await user.click(await screen.findByRole('option', { name: /^3 · Arpeggio/ }))
    await waitFor(() =>
      expect(songOf(piecesStore.getState())).toMatchObject({
        sections: [{ kind: 'verse', pattern: 'M3' }],
      }),
    )
    expect(screen.getByText(/^Plays 3 · Arpeggio/)).toBeInTheDocument()
  })

  it('opens on what another tab saved, so its next change keeps it', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', { storage: withSong() })
    await screen.findByRole('status')
    act(() =>
      piecesStore.setState({
        songs: piecesStore
          .getState()
          .songs.map((song) => ({ ...song, sections: [{ kind: 'verse', lines: ['G G G D'] }] })),
      }),
    )
    await toChordRow(user)
    const field = await openChordField(user)
    await user.clear(field)
    await user.type(field, 'Am{Enter}')
    expect(songOf(piecesStore.getState())).toMatchObject({ sections: [{ lines: ['Am G G D'] }] })
  })

  it('sets a typed chord at the caret and moves to the next bar, Enter opening the field', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', { storage: withSong() })
    await toChordRow(user)
    // Enter on a button presses it: off the bar, Enter opens the chord field.
    act(() => {
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
    })
    await user.keyboard('{Enter}')
    const field = await screen.findByRole('textbox', { name: 'Chord' })
    await waitFor(() => expect(field).toHaveFocus())
    await user.clear(field)
    await user.type(field, 'Am{Enter}')
    expect(await screen.findByRole('button', { name: 'Bar 1: Am' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Bar 2, beat 1 · G')
    expect(songOf(piecesStore.getState())).toMatchObject({ sections: [{ lines: ['Am G G G'] }] })
  })

  it('types a chord on the chord keypad, the phone’s keyboard kept down', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', { storage: withSong() })
    await toChordRow(user)
    const field = await openChordField(user)
    await user.clear(field)
    const keypad = screen.getByRole('region', { name: 'Tools' })
    for (const key of ['F', '♯', 'm', '7'])
      await user.click(within(keypad).getAllByRole('button', { name: key })[0] ?? keypad)
    expect(field).toHaveValue('F#m7')
    await user.click(
      within(keypad).getByRole('button', { name: 'Set the chord and go to the next bar' }),
    )
    expect(songOf(piecesStore.getState())).toMatchObject({ sections: [{ lines: ['F#m7 G G G'] }] })
  })

  it('taps a chord of the key into the bar at the caret', async () => {
    const user = userEvent.setup()
    await renderApp('/edit/my-1', { storage: withSong() })
    await toChordRow(user)
    const chords = await screen.findByRole('group', { name: 'Chords in the key' })
    await user.click(within(chords).getByRole('button', { name: 'Em' }))
    expect(await screen.findByRole('button', { name: 'Bar 1: Em' })).toBeInTheDocument()
  })

  it('names a chord played on a MIDI keyboard', async () => {
    const user = userEvent.setup()
    const { midi: keyboard } = await renderApp('/edit/my-1', { storage: withSong() })
    await toChordRow(user)
    await screen.findByRole('group', { name: 'Chords in the key' })
    act(() => {
      for (const key of [53, 57, 60]) keyboard.press(midi(key))
    })
    expect(await screen.findByRole('button', { name: 'Bar 1: F' })).toBeInTheDocument()
  })

  it('writes nothing from a MIDI keyboard behind the song’s settings', async () => {
    const user = userEvent.setup()
    const { midi: keyboard, piecesStore } = await renderApp('/edit/my-1', { storage: withSong() })
    await screen.findByRole('status')
    const before = songOf(piecesStore.getState())
    await user.click(screen.getByRole('button', { name: 'Settings' }))
    await screen.findByRole('dialog')
    act(() => keyboard.press(midi(60)))
    expect(songOf(piecesStore.getState())).toEqual(before)
  })

  it('writes the melody from the computer keyboard, a value at a time', async () => {
    const user = userEvent.setup({ delay: 120 })
    const { piecesStore, settingsStore } = await renderApp('/edit/my-1', { storage: withSong() })
    act(() => setKeyboard(settingsStore, { typing: true }))
    await addMelodyStaff(user)
    await user.keyboard('asd2f')
    await waitFor(() =>
      expect(songOf(piecesStore.getState())).toMatchObject({ melody: 'C4/1 D4/1 E4/1 F4/2' }),
    )
    expect(screen.getByRole('status')).toHaveTextContent('Bar 2, beat 2')
    await user.keyboard('{ArrowLeft}{ArrowLeft}')
    expect(screen.getByRole('status')).toHaveTextContent('Bar 1, beat 4 · F4 half')
  })

  it('opens with its keys folded on a phone on its side, its caret’s line in the bar', async () => {
    const user = userEvent.setup()
    vi.stubGlobal('matchMedia', (media: string) => ({
      media,
      matches: media === LANDSCAPE_PHONE,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }))
    const { settingsStore } = await renderApp('/edit/my-1', { storage: withSong() })
    // The caret's line under the title, in the bar.
    const title = await screen.findByRole('heading', { level: 1, name: 'Morning' })
    expect(title.parentElement).toContainElement(screen.getByRole('status'))
    await user.click(await screen.findByRole('button', { name: 'Keys' }))
    expect(settingsStore.getState().keyboard.foldedLandscape).toBe(false)
    expect(settingsStore.getState().keyboard.folded).toBe(false)
    expect(screen.getByRole('button', { name: 'Hide the keys' })).toBeInTheDocument()
  })

  it('moves its palette beside the sheet to the left and back, saved', async () => {
    const user = userEvent.setup()
    vi.stubGlobal('matchMedia', (media: string) => ({
      media,
      matches: media === LANDSCAPE_PHONE,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }))
    const { settingsStore } = await renderApp('/edit/my-1', { storage: withSong() })
    await user.click(await screen.findByRole('button', { name: 'Move the palette to the left' }))
    expect(settingsStore.getState().paletteSide).toBe('left')
    expect(document.querySelector('.editor-screen')).toHaveAttribute('data-side', 'left')
    await user.click(screen.getByRole('button', { name: 'Move the palette to the right' }))
    expect(settingsStore.getState().paletteSide).toBe('right')
  })

  it('keeps Undo, Redo, Play and Record in the bar, and Delete last of the caret’s moves', async () => {
    await renderApp('/edit/my-1', { storage: withSong() })
    const bar = await screen.findByRole('toolbar', { name: 'Editing' })
    expect(
      within(bar)
        .getAllByRole('button')
        .map((button) => button.getAttribute('aria-label')),
    ).toEqual(['Undo', 'Redo', 'Play', 'Record'])
    const moves = within(screen.getByRole('group', { name: 'Caret' })).getAllByRole('button')
    expect(moves.at(-1)).toHaveAccessibleName('Delete')
  })

  it('keeps every tool a tab away, the hand’s own only in a hand', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', { storage: withSong() })
    const palette = await screen.findByRole('region', { name: 'Tools' })
    await addMelodyStaff(user)
    for (const name of [
      'Quarter note',
      '32nd note',
      'Dotted',
      'Double dotted',
      'Triplet',
      'Rest',
      'Tie to the next note',
      'Chord',
    ])
      expect(within(palette).getByRole('button', { name })).toBeInTheDocument()
    // The caret's moves and Delete stand apart from the palette, by the caret's line.
    expect(within(palette).queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument()
    const moves = screen.getByRole('group', { name: 'Caret' })
    for (const name of ['Back a step', 'Forward a step', 'Delete'])
      expect(within(moves).getByRole('button', { name })).toBeInTheDocument()
    expect(within(palette).getByRole('tab', { name: 'Fingering' })).toHaveAttribute(
      'aria-disabled',
      'true',
    )
    await user.click(within(palette).getByRole('tab', { name: 'Pitch' }))
    for (const name of [
      'Up a semitone',
      'Down a semitone',
      'Up an octave',
      'Down an octave',
      'Up a note of the key',
      'Down a note of the key',
      'Other spelling',
    ])
      expect(within(palette).getByRole('button', { name })).toBeInTheDocument()
    // Bars are added from the + menu, not the palette.
    await addFrom(user, 'Bars', 'Add a bar after')
    expect(songOf(piecesStore.getState())).toMatchObject({ sections: [{ lines: ['G G G G G'] }] })
    await user.keyboard('{Alt>}{ArrowDown}{ArrowDown}{/Alt}')
    await user.click(within(palette).getByRole('tab', { name: 'Fingering' }))
    expect(within(palette).getByRole('button', { name: 'Write this bar out' })).toBeInTheDocument()
  })

  it('marks the note at the caret from the marks’ tabs, saved with the tune', async () => {
    const user = userEvent.setup({ delay: 120 })
    const { piecesStore, settingsStore } = await renderApp('/edit/my-1', { storage: withSong() })
    act(() => setKeyboard(settingsStore, { typing: true }))
    await addMelodyStaff(user)
    await user.keyboard('a')
    await user.keyboard('{ArrowLeft}')
    const palette = screen.getByRole('region', { name: 'Tools' })
    await user.click(within(palette).getByRole('tab', { name: 'Articulations and ornaments' }))
    await user.click(within(palette).getByRole('button', { name: 'Staccato' }))
    expect(within(palette).getByRole('button', { name: 'Staccato' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    // A line over the notes is added from the + menu.
    await addFrom(user, 'Lines', '8va: an octave higher')
    await user.click(within(palette).getByRole('tab', { name: 'Dynamics' }))
    await user.click(within(palette).getByRole('button', { name: 'Forte' }))
    await waitFor(() =>
      expect(songOf(piecesStore.getState())).toMatchObject({ melody: 'C4/1[stacc,8va,f]' }),
    )
  })

  it('undoes and redoes by button and by Cmd+Z', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', { storage: withSong() })
    await toChordRow(user)
    const chords = await screen.findByRole('group', { name: 'Chords in the key' })
    await user.click(within(chords).getByRole('button', { name: 'C' }))
    await user.click(screen.getByRole('button', { name: 'Undo' }))
    expect(songOf(piecesStore.getState())).toMatchObject({ sections: [{ lines: ['G G G G'] }] })
    await user.click(screen.getByRole('button', { name: 'Redo' }))
    expect(songOf(piecesStore.getState())).toMatchObject({ sections: [{ lines: ['C G G G'] }] })
    await user.keyboard('{Meta>}z{/Meta}')
    expect(songOf(piecesStore.getState())).toMatchObject({ sections: [{ lines: ['G G G G'] }] })
  })

  it('plays the song from the caret’s bar, and Stop stops it', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/edit/my-1', { storage: withSong() })
    await user.click(await screen.findByRole('button', { name: 'Bar 3: G' }))
    await user.click(screen.getByRole('button', { name: 'Play' }))
    const ends = (audio.played.at(-1)?.sounds ?? []).map((sound) =>
      sound.kind === 'note' ? sound.at + sound.duration : sound.at,
    )
    // Bars 3 and 4 at 90 a minute: eight beats of 2/3 of a second.
    expect(Math.max(...ends)).toBeCloseTo(16 / 3, 0)
    await user.click(screen.getByRole('button', { name: 'Stop' }))
    expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument()
  })

  it('plays a written left hand in the Player, in any key', async () => {
    const user = userEvent.setup()
    const storage = createMemoryStorage()
    // C3 over G: a note the pattern never plays there.
    const song = { ...SONG, hands: { lh: 'C3/4 | - | - | -' } }
    storage.setItem(
      PIECES_STORAGE_KEY,
      JSON.stringify({ state: { songs: [song], nextSong: 2 }, version: 1 }),
    )
    const { audio } = await renderApp('/play/my-1?key=A', { storage })
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    const keys = (audio.played.at(-1)?.sounds ?? []).flatMap((sound) =>
      sound.kind === 'note' ? [sound.midi] : [],
    )
    expect(keys).toContain(midi(50))
    expect(keys).not.toContain(midi(48))
  })

  it('opens a song with a tune in the Player with Melody to turn on', async () => {
    const user = userEvent.setup()
    const storage = createMemoryStorage()
    const song = { ...SONG, melody: 'B4/4 | D5/4 | G4/4 | G4/4' }
    storage.setItem(
      PIECES_STORAGE_KEY,
      JSON.stringify({ state: { songs: [song], nextSong: 2 }, version: 1 }),
    )
    await renderApp('/play/my-1', { storage })
    await user.click(await screen.findByRole('button', { name: 'Setup' }))
    expect(await screen.findByRole('button', { name: 'Melody' })).toBeInTheDocument()
  })

  it('closes to the song’s page', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/edit/my-1', { storage: withSong() })
    await user.click(await screen.findByRole('button', { name: 'Close' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/songs/my-1'))
  })

  it('saves a version of a catalog song, played in the Player, and gone once undone to the original', async () => {
    const user = userEvent.setup()
    const storage = createMemoryStorage()
    const { piecesStore } = await renderApp('/edit/amazing', { storage })
    await toChordRow(user)
    const chords = await screen.findByRole('group', { name: 'Chords in the key' })
    await user.click(within(chords).getByRole('button', { name: 'Em' }))
    expect(await screen.findByText('Your version')).toBeInTheDocument()
    expect(piecesStore.getState().versions.amazing?.sections[0]?.lines[0]).toBe('Em G7 C G')
    await user.click(screen.getByRole('button', { name: 'Undo' }))
    await waitFor(() => expect(piecesStore.getState().versions).toEqual({}))
    const original = pieceById('amazing')
    if (!original || isDegreePiece(original)) throw new Error('a song')
    expect(musicOf(original).sections[0]?.lines[0]).toBe('G G7 C G')
  })

  it('writes a listing’s chart, which then opens in the Player', async () => {
    const user = userEvent.setup()
    const storage = createMemoryStorage()
    const { piecesStore } = await renderApp('/edit/bz4', { storage })
    await toChordRow(user)
    const chords = await screen.findByRole('group', { name: 'Chords in the key' })
    await user.click(within(chords).getByRole('button', { name: 'Fm' }))
    expect(piecesStore.getState().versions.bz4?.sections[0]?.lines[0]).toBe('Fm Cm Cm Cm')
  })

  it('writes a left hand’s bar out from the pattern', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', { storage: withSong() })
    // A click low in a bar lands on its bass staff: the left hand.
    fireEvent.click(await screen.findByRole('button', { name: /^Bar 1:/ }), {
      clientY: 400,
      detail: 1,
    })
    expect(screen.getByRole('status')).toHaveTextContent(/^Left hand · /)
    expect(screen.getAllByText('Pattern').length).toBeGreaterThan(0)
    await user.click(screen.getByRole('tab', { name: 'Fingering' }))
    await user.click(screen.getByRole('button', { name: 'Write this bar out' }))
    expect(songOf(piecesStore.getState())).toMatchObject({
      hands: { lh: expect.stringMatching(/^G1\^5\+G2\^1\/2 /) },
    })
    expect(screen.getByRole('button', { name: 'Back to the pattern' })).toBeInTheDocument()
  })

  it('shows not found for a song written in degrees', async () => {
    await renderApp('/edit/romashki')
    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })
})

describe('the score editor’s takes', () => {
  // At 90 a beat lasts two thirds of a second; the take starts a 4/4 count-in after just now (0.1 s).
  const BEAT = 60 / 90
  const DOWNBEAT = 0.1 + 4 * BEAT

  /** Opens the takes, connects the MIDI keyboard where it is not yet, and starts a take. */
  async function startTake(user: ReturnType<typeof userEvent.setup>) {
    await user.click(await screen.findByRole('button', { name: 'Record' }))
    const sheet = await screen.findByRole('dialog', { name: 'Takes' })
    const connect = within(sheet).queryByRole('button', { name: 'Connect a MIDI keyboard' })
    if (connect) await user.click(connect)
    await user.click(await within(sheet).findByRole('button', { name: 'Record' }))
  }

  /** One of a take's actions, from its row's menu. */
  async function takeAction(
    user: ReturnType<typeof userEvent.setup>,
    row: HTMLElement,
    name: string,
  ) {
    await user.click(within(row).getByRole('button', { name: 'Take actions' }))
    const menu = await screen.findByRole('dialog', { name: 'Take actions' })
    await user.click(within(menu).getByRole('button', { name }))
  }

  /** Plays a G major arpeggio over a held G2, a beat a note, from the downbeat. */
  function playArpeggio(
    audio: Awaited<ReturnType<typeof renderApp>>['audio'],
    keyboard: Awaited<ReturnType<typeof renderApp>>['midi'],
  ) {
    const at = (beats: number) => act(() => audio.setNow(DOWNBEAT + beats * BEAT))
    at(0.03)
    // The bass first: two presses in one step may fall a moment apart on the clock.
    act(() => {
      keyboard.press(midi(43), { velocity: 70 })
      keyboard.press(midi(67), { velocity: 90 })
    })
    at(0.99)
    act(() => {
      keyboard.release(midi(67))
      keyboard.press(midi(71))
    })
    at(1.99)
    act(() => {
      keyboard.release(midi(71))
      keyboard.press(midi(74))
    })
    at(3)
    act(() => {
      keyboard.release(midi(74))
      keyboard.release(midi(43))
    })
    at(3.2)
  }

  it('offers the tune under a take only for a song with one, and saves the choice', async () => {
    const user = userEvent.setup()
    const storage = createMemoryStorage()
    const song = { ...SONG, melody: 'B4/4 | D5/4 | G4/4 | G4/4' }
    storage.setItem(
      PIECES_STORAGE_KEY,
      JSON.stringify({ state: { songs: [song], nextSong: 2 }, version: 1 }),
    )
    const { settingsStore } = await renderApp('/edit/my-1', { storage })
    await user.click(await screen.findByRole('button', { name: 'Record' }))
    const sheet = await screen.findByRole('dialog', { name: 'Takes' })
    await user.click(within(sheet).getByRole('switch', { name: 'Melody' }))
    expect(settingsStore.getState().recorder.tune).toBe(true)
  })

  it('offers no tune for a song without one', async () => {
    const user = userEvent.setup()
    await renderApp('/edit/my-1', { storage: withSong() })
    await user.click(await screen.findByRole('button', { name: 'Record' }))
    const sheet = await screen.findByRole('dialog', { name: 'Takes' })
    expect(within(sheet).getByRole('switch', { name: 'Metronome' })).toBeInTheDocument()
    expect(within(sheet).queryByRole('switch', { name: 'Melody' })).not.toBeInTheDocument()
  })

  it('records a take to the count-in, keeps it, plays it, and writes it into both hands', async () => {
    const user = userEvent.setup()
    const {
      audio,
      midi: keyboard,
      piecesStore,
      takesStore,
    } = await renderApp('/edit/my-1', {
      storage: withSong(),
    })
    await startTake(user)
    // The caret's line is the status until the recording strip takes its place.
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Count-in'))
    expect(
      audio.played
        .at(-1)
        ?.sounds.slice(0, 4)
        .map((sound) => sound.at),
    ).toEqual([0, BEAT, 2 * BEAT, 3 * BEAT])
    playArpeggio(audio, keyboard)
    expect(await screen.findByText('Bar 1 · 0:02')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Stop' }))
    // The keys played wrote nothing at the caret while the take recorded.
    expect(songOf(piecesStore.getState())).toEqual(SONG)
    expect(takesStore.getState().takes).toMatchObject([{ fromBar: 1 }])

    const sheet = await screen.findByRole('dialog', { name: 'Takes' })
    const [take] = within(sheet).getAllByRole('listitem')
    if (!take) throw new Error('the take is listed')
    expect(take).toHaveTextContent('0:02 · 90 BPM')
    await user.click(within(take).getByRole('button', { name: 'Play' }))
    expect(
      audio.played.at(-1)?.sounds.flatMap((sound) => (sound.kind === 'note' ? [sound.midi] : [])),
    ).toEqual([43, 67, 71, 74])

    await takeAction(user, take, 'Write into the score')
    const form = await screen.findByRole('dialog', { name: 'Write into the score' })
    expect(within(form).getByRole('radio', { name: 'Both hands' })).toBeChecked()
    expect(within(form).getByRole('radio', { name: 'eighth' })).toBeChecked()
    await user.click(within(form).getByRole('button', { name: 'Write' }))
    await waitFor(() =>
      expect(songOf(piecesStore.getState())).toMatchObject({
        hands: { rh: 'G4/1 B4/1 D5/1 | - | - | -', lh: 'G2/3 | - | - | -' },
      }),
    )
    await user.click(screen.getByRole('button', { name: 'Undo' }))
    expect(songOf(piecesStore.getState())).toEqual(SONG)
  })

  it('counts in alone with the click off, keeping the switch', async () => {
    const user = userEvent.setup()
    const { audio, settingsStore } = await renderApp('/edit/my-1', { storage: withSong() })
    await user.click(await screen.findByRole('button', { name: 'Record' }))
    const sheet = await screen.findByRole('dialog', { name: 'Takes' })
    await user.click(within(sheet).getByRole('switch', { name: 'Metronome' }))
    expect(settingsStore.getState().recorder.click).toBe(false)
    await user.click(within(sheet).getByRole('button', { name: 'Connect a MIDI keyboard' }))
    await user.click(await within(sheet).findByRole('button', { name: 'Record' }))
    expect(audio.played.at(-1)?.sounds).toHaveLength(4)
  })

  it('keeps nothing from a take stopped in its count-in, and says when nothing was played', async () => {
    const user = userEvent.setup()
    const {
      audio,
      midi: keyboard,
      takesStore,
    } = await renderApp('/edit/my-1', {
      storage: withSong(),
    })
    await startTake(user)
    await user.click(await screen.findByRole('button', { name: 'Stop' }))
    expect(await screen.findByRole('group', { name: 'Note value' })).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).toBeNull()

    await startTake(user)
    act(() => audio.setNow(audio.now() + 0.1 + 4 * BEAT + 0.5))
    // Space stops a take, as Escape does.
    await user.keyboard(' ')
    const sheet = await screen.findByRole('dialog', { name: 'Takes' })
    expect(within(sheet).getByText('Nothing was played.')).toBeInTheDocument()
    expect(within(sheet).getByText('No takes yet.')).toBeInTheDocument()
    act(() => keyboard.press(midi(60)))
    expect(takesStore.getState().takes).toEqual([])
  })

  it('downloads a take as a MIDI file named for the song, and deletes it once asked again', async () => {
    const user = userEvent.setup()
    const {
      audio,
      midi: keyboard,
      takesStore,
    } = await renderApp('/edit/my-1', {
      storage: withSong(),
    })
    await startTake(user)
    playArpeggio(audio, keyboard)
    await user.click(screen.getByRole('button', { name: 'Stop' }))
    const sheet = await screen.findByRole('dialog', { name: 'Takes' })

    const files: Blob[] = []
    vi.stubGlobal(
      'URL',
      class extends URL {
        static override createObjectURL = (file: Blob) => {
          files.push(file)
          return 'blob:take'
        }
        static override revokeObjectURL = () => {}
      },
    )
    const saved: string[] = []
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
      this: HTMLAnchorElement,
    ) {
      saved.push(this.download)
    })
    const [row] = within(sheet).getAllByRole('listitem')
    if (!row) throw new Error('the take is listed')
    await takeAction(user, row, 'Download')
    expect(saved[0]).toMatch(/^Morning \d{4}-\d\d-\d\d \d\d\.\d\d\.mid$/)
    expect(files[0]?.type).toBe('audio/midi')

    await takeAction(user, row, 'Delete')
    const keeping = await screen.findByRole('alertdialog', { name: 'Delete this take?' })
    await user.click(within(keeping).getByRole('button', { name: 'Keep it' }))
    expect(takesStore.getState().takes).toHaveLength(1)

    await takeAction(user, row, 'Delete')
    const asking = await screen.findByRole('alertdialog', { name: 'Delete this take?' })
    await user.click(within(asking).getByRole('button', { name: 'Delete' }))
    expect(await within(sheet).findByText('No takes yet.')).toBeInTheDocument()
    expect(takesStore.getState().takes).toEqual([])
  })

  it('keeps a take when the editor is closed while it records', async () => {
    const user = userEvent.setup()
    const {
      audio,
      midi: keyboard,
      router,
      takesStore,
    } = await renderApp('/edit/my-1', {
      storage: withSong(),
    })
    await startTake(user)
    act(() => audio.setNow(DOWNBEAT + 0.2))
    act(() => keyboard.press(midi(64)))
    await user.click(screen.getByRole('button', { name: 'Close' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/songs/my-1'))
    expect(takesStore.getState().takes.map((take) => take.pieceId)).toEqual(['my-1'])
  })

  it('holds the open sheet in the URL, gives way while a take records, and reopens on the takes', async () => {
    const user = userEvent.setup()
    const {
      audio,
      midi: keyboard,
      router,
    } = await renderApp('/edit/my-1', {
      storage: withSong(),
    })
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    expect(screen.getByRole('button', { name: 'Stop' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Record' }))
    expect(router.state.location.search).toEqual({ record: true })
    const sheet = await screen.findByRole('dialog', { name: 'Takes' })
    await user.click(within(sheet).getByRole('button', { name: 'Connect a MIDI keyboard' }))
    await user.click(await within(sheet).findByRole('button', { name: 'Record' }))
    expect(router.state.location.search).toEqual({})

    // The song stopped as the take began, and the tools that change it wait for Stop.
    expect(screen.getByRole('button', { name: 'Play' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Undo' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Settings' })).toBeDisabled()
    playArpeggio(audio, keyboard)
    await user.click(screen.getByRole('button', { name: 'Stop' }))

    const takes = await screen.findByRole('dialog', { name: 'Takes' })
    expect(router.state.location.search).toEqual({ record: true })
    const [row] = within(takes).getAllByRole('listitem')
    if (!row) throw new Error('the take is listed')
    await takeAction(user, row, 'Write into the score')
    const form = await screen.findByRole('dialog', { name: 'Write into the score' })
    await user.click(within(form).getByRole('button', { name: 'Write' }))
    await waitFor(() => expect(form).not.toBeInTheDocument())
    expect(router.state.location.search).toEqual({})

    await user.click(screen.getByRole('button', { name: 'Record' }))
    const again = await screen.findByRole('dialog', { name: 'Takes' })
    expect(within(again).getByRole('button', { name: 'Record' })).toBeEnabled()
  })

  it('keeps Record in the takes’ footer, in reach over the takes and their settings', async () => {
    const user = userEvent.setup()
    await renderApp('/edit/my-1?record=true', { storage: withSong() })
    const sheet = await screen.findByRole('dialog', { name: 'Takes' })
    await user.click(within(sheet).getByRole('button', { name: 'Connect a MIDI keyboard' }))
    const record = await within(sheet).findByRole('button', { name: 'Record' })
    expect(record.closest('[data-slot="drawer-footer"]')).not.toBeNull()
    expect(record).toBeEnabled()
  })

  it('cannot record in a browser without MIDI', async () => {
    const user = userEvent.setup()
    await renderApp('/edit/my-1', { storage: withSong(), webMidi: false })
    await user.click(await screen.findByRole('button', { name: 'Record' }))
    const sheet = await screen.findByRole('dialog', { name: 'Takes' })
    expect(
      within(sheet).getByText('This browser can’t connect a MIDI keyboard.'),
    ).toBeInTheDocument()
    expect(within(sheet).getByRole('button', { name: 'Record' })).toBeDisabled()
  })

  it('opens on its takes when the song was made to record', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/songs')
    await user.click(await screen.findByRole('button', { name: 'New song' }))
    await user.type(await screen.findByRole('textbox', { name: 'Title' }), 'Evening')
    await user.click(screen.getByRole('button', { name: 'Record' }))
    const sheet = await screen.findByRole('dialog', { name: 'Takes' })
    expect(router.state.location.pathname).toBe('/edit/my-1')
    await user.keyboard('{Escape}')
    await waitFor(() => expect(sheet).not.toBeInTheDocument())
    expect(router.state.location.search).toEqual({})
  })
})
