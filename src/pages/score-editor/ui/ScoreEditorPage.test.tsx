import { act, fireEvent, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, onTestFinished, vi } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { isDegreePiece, musicOf, pieceById, PIECES_STORAGE_KEY } from '@/entities/piece'
import { chartStart } from '@/features/edit-piece'
import { readDraft } from '@/features/score-editor'
import { setKeyboard } from '@/features/set-preference'
import { createMemoryStorage, LANDSCAPE_PHONE } from '@/shared/lib'
import { midi, note } from '@/shared/lib/music'
import { notate, scoreToMei } from '@/shared/lib/notation'
import { arrangeDraft } from '../model/arrange-draft'

const SONG = {
  id: 'my-1',
  title: 'Morning',
  key: 'G',
  meter: '4/4',
  tempo: 90,
  pattern: 'r1',
  sections: [{ kind: 'verse', lines: ['G G G G'] }],
}
/** The song's tune's staff with nothing on it yet: a rest in each bar. */
const EMPTY_TUNE = 'r/4 | r/4 | r/4 | r/4'
/** Both hands written, silent: the song's bars are not the pattern's (ADR 0091). */
const SILENT_HANDS = { rh: EMPTY_TUNE, lh: EMPTY_TUNE }
const withSong = (music: object = {}) => {
  const storage = createMemoryStorage()
  storage.setItem(
    PIECES_STORAGE_KEY,
    JSON.stringify({ state: { songs: [{ ...SONG, ...music }], nextSong: 2 }, version: 2 }),
  )
  return storage
}
/**
 * Puts the caret in bar 1's chord row, as a click over its staff does: jsdom lays nothing out, so a
 * click lands at the bar's top, in the chord row.
 */
const toChordRow = async (user: ReturnType<typeof userEvent.setup>) =>
  user.click(await screen.findByRole('button', { name: /^Bar 1:/ }))

/**
 * Opens a category of the palette from its bar (the palette opening where it was folded): its
 * section, titled by its name.
 */
async function openCategory(user: ReturnType<typeof userEvent.setup>, category: string) {
  const bar = await screen.findByRole('toolbar', { name: 'Kinds of tools' })
  await user.click(within(bar).getByRole('button', { name: category }))
  return screen.findByRole('region', { name: category })
}

/** Opens a category of the palette and taps one of its keys. */
async function tapIn(user: ReturnType<typeof userEvent.setup>, category: string, key: string) {
  const section = await openCategory(user, category)
  await user.click(within(section).getByRole('button', { name: key }))
  return section
}

/** The chords' Type, and its field. */
async function openChordField(user: ReturnType<typeof userEvent.setup>) {
  const chords = await openCategory(user, 'Chords')
  await user.click(within(chords).getByRole('radio', { name: 'Type' }))
  return screen.findByRole('textbox', { name: 'Chord' })
}

/** Opens the Song sheet: the song as a whole. */
async function openSettings(user: ReturnType<typeof userEvent.setup>) {
  await user.click(await screen.findByRole('button', { name: 'Song' }))
  return screen.findByRole('dialog', { name: 'Song' })
}

const songOf = (state: { songs: readonly { id: string }[] }) =>
  state.songs.find((song) => song.id === 'my-1')

describe('the score editor', () => {
  it('opens on the upper staff of a song with no tune, Alt with the arrows choosing the row it writes', async () => {
    const user = userEvent.setup()
    await renderApp('/edit/my-1', { storage: withSong({ hands: SILENT_HANDS }) })
    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent(/^Upper staff · Bar 1/),
    )
    const palette = screen.getByRole('region', { name: 'Tools' })
    expect(within(palette).queryByRole('radiogroup', { name: 'Voice' })).not.toBeInTheDocument()
    await user.keyboard('{Alt>}{ArrowDown}{/Alt}')
    expect(screen.getByRole('status')).toHaveTextContent(/^Lower staff · Bar 1/)
    await user.keyboard('{Alt>}{ArrowUp}{ArrowUp}{/Alt}')
    expect(screen.getByRole('status')).toHaveTextContent(/^Chord symbols · /)
    // In the chord names' row the quick row is the key's chords, not the values.
    const chords = screen.getByRole('region', { name: 'Tools' })
    expect(within(chords).getByRole('group', { name: 'Chords in the key' })).toBeInTheDocument()
    expect(within(chords).queryByRole('group', { name: 'Note value' })).not.toBeInTheDocument()
    const ways = await openCategory(user, 'Chords')
    expect(
      within(ways).getByRole('radiogroup', { name: 'Ways to write a chord' }),
    ).toBeInTheDocument()
  })

  it('opens a new song on empty bars, nothing written in either staff, as a new score (ADR 0091)', async () => {
    const user = userEvent.setup()
    const made = chartStart({ tonic: note('G'), minor: false }, '4/4')
    await renderApp('/edit/my-1', { storage: withSong(made) })
    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent(/^Upper staff · Bar 1, beat 1 · rest$/),
    )
    await user.keyboard('{Alt>}{ArrowDown}{/Alt}')
    expect(screen.getByRole('status')).toHaveTextContent(/^Lower staff · Bar 1, beat 1 · rest$/)
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('status')).toHaveTextContent(/^Lower staff · Bar 1, beat 2 · rest$/)
  })

  it('opens folded to its quick row and categories, a category opening every tool at its own', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/edit/my-1', { storage: withSong() })
    const palette = await screen.findByRole('region', { name: 'Tools' })
    expect(within(palette).getByRole('group', { name: 'Note value' })).toBeInTheDocument()
    expect(within(palette).queryByRole('region', { name: 'Notes' })).not.toBeInTheDocument()
    await openCategory(user, 'Pitch')
    expect(settingsStore.getState().paletteFolded).toEqual({ foot: false })
    expect(within(palette).getByRole('button', { name: 'Pitch' })).toHaveAttribute(
      'aria-current',
      'true',
    )
    // Every category's section is there, stacked, Insert's kinds among them.
    for (const name of ['Notes', 'Bar', 'Clef', 'Key signature', 'Barlines & repeats'])
      expect(within(palette).getByRole('region', { name })).toBeInTheDocument()
    await user.click(within(palette).getByRole('button', { name: 'Show fewer tools' }))
    expect(within(palette).queryByRole('region', { name: 'Pitch' })).not.toBeInTheDocument()
    expect(settingsStore.getState().paletteFolded).toEqual({ foot: true })
    expect(within(palette).getByRole('group', { name: 'Note value' })).toBeInTheDocument()
  })

  it('opens on an empty tune’s staff the song was given, and keeps it (ADR 0072)', async () => {
    const user = userEvent.setup({ delay: 120 })
    const { piecesStore, settingsStore } = await renderApp('/edit/my-1', {
      storage: withSong({ melody: EMPTY_TUNE }),
    })
    act(() => setKeyboard(settingsStore, { typing: true }))
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/^Melody · Bar 1/))
    // Written in the right hand, the empty tune's staff stays, a rest.
    await user.keyboard('{Alt>}{ArrowDown}{/Alt}')
    await user.keyboard('a')
    // The tune's staff, empty, is written as one rest.
    await waitFor(() => expect(songOf(piecesStore.getState())).toMatchObject({ melody: 'r/4' }))
  })

  it('writes the note on the line double-clicked, and moves it by the key’s notes as it is dragged', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', { storage: withSong() })
    // The first engraving of a run loads Verovio: about a second on its own.
    const bar = await screen.findByRole('button', { name: /^Bar 1:/ }, { timeout: 4000 })
    // jsdom lays nothing out: the bar's top is the chord row's, 44px over the line's engraving, whose
    // treble top line (F♯5 in G) Verovio draws 30px down.
    fireEvent.click(bar, { clientY: 74, detail: 1 })
    fireEvent.doubleClick(bar, { clientY: 74, detail: 2 })
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

  it('keeps its palette open for every song, as the learner left it', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/edit/my-1', { storage: withSong() })
    await screen.findByRole('status')
    await user.click(screen.getByRole('button', { name: 'Show every tool' }))
    expect(settingsStore.getState().paletteFolded).toEqual({ foot: false })
    expect(screen.getByRole('button', { name: 'Show fewer tools' })).toBeInTheDocument()
  })

  it('opens its palette dragged up by its grab handle, and folds it at a tap, as Flat’s sheet', async () => {
    await renderApp('/edit/my-1', { storage: withSong() })
    const palette = await screen.findByRole('region', { name: 'Tools' })
    const grip = palette.querySelector('[data-slot="palette-grip"]')
    if (!grip) throw new Error('no grab handle')
    fireEvent.pointerDown(grip, { clientY: 500, pointerId: 1 })
    fireEvent.pointerMove(grip, { clientY: 440, pointerId: 1 })
    fireEvent.pointerUp(grip, { clientY: 440, pointerId: 1 })
    expect(await screen.findByRole('button', { name: 'Show fewer tools' })).toBeInTheDocument()
    fireEvent.pointerDown(grip, { clientY: 300, pointerId: 1 })
    fireEvent.pointerUp(grip, { clientY: 301, pointerId: 1 })
    expect(await screen.findByRole('button', { name: 'Show every tool' })).toBeInTheDocument()
  })

  it('opens its palette beside the sheet, on a phone on its side, where it covers no music', async () => {
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
    await user.click(await screen.findByRole('button', { name: 'Show fewer tools' }))
    // Folded there, it stays folded there; at the foot it is still the foot's own.
    expect(settingsStore.getState().paletteFolded).toEqual({ beside: true })
    expect(screen.getByRole('button', { name: 'Show every tool' })).toBeInTheDocument()
  })

  it('shows and hides the keys from the palette’s bar, its Keys always there', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/edit/my-1', { storage: withSong() })
    const keys = await screen.findByRole('button', { name: 'Keys' })
    expect(keys).toHaveAttribute('aria-pressed', 'true')
    await user.click(keys)
    expect(settingsStore.getState().keyboard.folded).toBe(true)
    expect(screen.getByRole('button', { name: 'Keys' })).toHaveAttribute('aria-pressed', 'false')
    await user.click(screen.getByRole('button', { name: 'Keys' }))
    expect(settingsStore.getState().keyboard.folded).toBe(false)
  })

  it('folds its keys from their rail, and brings them back from View, as the Player does', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/edit/my-1', { storage: withSong() })
    await user.click(await screen.findByRole('button', { name: 'Hide the keys' }))
    expect(settingsStore.getState().keyboard.folded).toBe(true)
    expect(screen.queryByRole('button', { name: 'Hide the keys' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'View' }))
    await user.click(await screen.findByRole('switch', { name: 'Keys' }))
    expect(settingsStore.getState().keyboard.folded).toBe(false)
    expect(screen.getByRole('button', { name: 'Hide the keys' })).toBeInTheDocument()
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
    const [head] = await screen.findAllByRole(
      'button',
      { name: 'Key and time signature' },
      { timeout: 4000 },
    )
    if (!head) throw new Error('no line head')
    await user.click(head)
    const settings = await screen.findByRole('dialog', { name: 'Song' })
    expect(within(settings).getByRole('group', { name: 'Key' })).toBeInTheDocument()
    expect(within(settings).queryByRole('combobox', { name: 'Pattern' })).not.toBeInTheDocument()
  })

  it('changes key from the caret’s section on, or for the whole song in the Song sheet (ADR 0089)', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', { storage: withSong() })
    await screen.findByRole('status')
    expect(screen.queryByRole('button', { name: 'Insert' })).not.toBeInTheDocument()
    const key = await openCategory(user, 'Key signature')
    expect(within(key).getByText('From Verse on (bar 1)')).toBeInTheDocument()
    const here = within(key).getByRole('group', { name: 'Key' })
    await user.click(within(here).getByRole('radio', { name: 'D' }))
    await waitFor(() =>
      expect(songOf(piecesStore.getState())).toMatchObject({
        key: 'G',
        sections: [{ key: 'D', lines: ['G G G G'] }],
      }),
    )
    // A change of time inside the song is not written yet, and the section says so.
    const time = await openCategory(user, 'Time signature')
    expect(within(time).getByText(/whole song’s/)).toBeInTheDocument()
    await openCategory(user, 'Key signature')
    await user.click(within(key).getByRole('button', { name: 'Change for the whole song' }))
    const song = await screen.findByRole('dialog', { name: 'Song' })
    expect(within(song).getByRole('group', { name: 'Key' })).toBeInTheDocument()
  })

  it('puts a repeat round the caret’s bar from Barlines & repeats, saved in the chart', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', { storage: withSong() })
    await screen.findByRole('status')
    const repeats = await tapIn(user, 'Barlines & repeats', 'Start repeat')
    await user.click(within(repeats).getByRole('button', { name: 'End repeat' }))
    await waitFor(() =>
      expect(songOf(piecesStore.getState())).toMatchObject({
        sections: [{ lines: ['|: G :| G G G'] }],
      }),
    )
  })

  it('puts a jump and Fine on the caret’s bar from Barlines & repeats', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', { storage: withSong() })
    await screen.findByRole('status')
    const repeats = await tapIn(user, 'Barlines & repeats', 'Fine')
    await user.click(within(repeats).getByRole('button', { name: 'D.C. al Fine' }))
    await waitFor(() =>
      expect(songOf(piecesStore.getState())).toMatchObject({
        sections: [{ lines: ['G Fine DC.Fine G G G'] }],
      }),
    )
  })

  it('sets the tempo by a tempo word under the Song sheet’s slider', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', { storage: withSong() })
    const settings = await openSettings(user)
    await user.click(within(settings).getByRole('button', { name: 'Allegro, 130 a minute' }))
    await waitFor(() => expect(songOf(piecesStore.getState())).toMatchObject({ tempo: 130 }))
    expect(within(settings).getByText('130 BPM')).toBeInTheDocument()
    expect(within(settings).getByRole('button', { name: 'Allegro, 130 a minute' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    // How the score is laid out is the View's, not the song's.
    expect(within(settings).queryByRole('radio', { name: 'Pages' })).not.toBeInTheDocument()
  })

  it('shows and hides the staves from the Song sheet, never every one (ADR 0083, 0091)', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', {
      storage: withSong({ hands: SILENT_HANDS }),
    })
    const settings = await openSettings(user)
    const staves = within(settings).getByRole('region', { name: 'Staves' })
    const melody = within(staves).getByRole('switch', { name: /^Melody/ })
    const piano = within(staves).getByRole('switch', { name: /^Piano/ })
    const chords = within(staves).getByRole('switch', { name: /^Chord symbols/ })
    expect(melody).not.toBeChecked()
    expect(piano).toBeChecked()
    expect(chords).toBeChecked()
    // The piano, the only staff in sight, stays, and says so.
    expect(piano).toHaveAttribute('aria-disabled', 'true')
    expect(within(staves).getByText('The last staff in sight stays')).toBeInTheDocument()
    await user.click(melody)
    await waitFor(() => expect(songOf(piecesStore.getState())).toMatchObject({ melody: 'r/4' }))
    expect(melody).toBeChecked()
    expect(piano).not.toHaveAttribute('aria-disabled')
    await user.click(piano)
    await waitFor(() => expect(songOf(piecesStore.getState())).toMatchObject({ hidden: ['piano'] }))
    // Now the tune's staff is the last in sight.
    expect(melody).toHaveAttribute('aria-disabled', 'true')
    await user.click(chords)
    await waitFor(() =>
      expect(songOf(piecesStore.getState())).toMatchObject({ hidden: ['piano', 'chords'] }),
    )
    await user.click(piano)
    await waitFor(() =>
      expect(songOf(piecesStore.getState())).toMatchObject({ hidden: ['chords'] }),
    )
    // The tune's staff taken away goes with its notes; the editor writes in the piano again.
    await user.click(melody)
    await waitFor(() => expect(songOf(piecesStore.getState())).not.toHaveProperty('melody'))
    await user.keyboard('{Escape}')
    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent(/^Upper staff · Bar 1/),
    )
  })

  it('changes the caret’s staff’s clef from its bar on, from the palette’s Clef', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', {
      storage: withSong({ hands: SILENT_HANDS }),
    })
    // A click low in a bar lands on its bass staff: the left hand.
    fireEvent.click(await screen.findByRole('button', { name: /^Bar 1:/ }), {
      clientY: 400,
      detail: 1,
    })
    const clef = await openCategory(user, 'Clef')
    expect(within(clef).getByText('Lower staff, from bar 1 on')).toBeInTheDocument()
    expect(within(clef).getByRole('button', { name: 'Bass clef' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await user.click(within(clef).getByRole('button', { name: 'Treble clef' }))
    await waitFor(() =>
      expect(songOf(piecesStore.getState())).toMatchObject({
        hands: { lh: 'clef:treble r/4 | r/4 | r/4 | r/4' },
      }),
    )
    expect(within(clef).getByRole('button', { name: 'Treble clef' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('draws a crescendo over the bars chosen in one go, engraved as a hairpin', async () => {
    const user = userEvent.setup()
    const storage = createMemoryStorage()
    const song = { ...SONG, melody: 'C4/1 D4/1 E4/1 F4/1 | G4/2 A4/2' }
    storage.setItem(
      PIECES_STORAGE_KEY,
      JSON.stringify({ state: { songs: [song], nextSong: 2 }, version: 2 }),
    )
    const { piecesStore } = await renderApp('/edit/my-1', { storage })
    expect(await screen.findByRole('status')).toHaveTextContent(/^Melody · /)
    // Bars 1 and 2 chosen from the caret's: Shift with Alt, a bar at a time.
    await user.keyboard('{Shift>}{Alt>}{ArrowRight}{ArrowRight}{/Alt}{/Shift}')
    const dynamics = await tapIn(user, 'Dynamics & hairpins', 'Crescendo')
    await waitFor(() =>
      expect(songOf(piecesStore.getState())).toMatchObject({
        melody: 'C4/1[cresc] D4/1 E4/1 F4/1 | G4/2 A4/2[/hairpin]',
      }),
    )
    const saved = piecesStore.getState().songs.find((each) => each.id === 'my-1')
    if (!saved) throw new Error('the song')
    const mei = scoreToMei(notate(arrangeDraft(readDraft(saved))))
    expect(mei).toMatch(/<hairpin [^>]*form="cres"/)
    // Drawn there already, its key shows it pressed: tapped again, it is taken away.
    expect(within(dynamics).getByRole('button', { name: 'Crescendo' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await user.click(within(dynamics).getByRole('button', { name: 'Crescendo' }))
    await waitFor(() =>
      expect(songOf(piecesStore.getState())).toMatchObject({
        melody: 'C4/1 D4/1 E4/1 F4/1 | G4/2 A4/2',
      }),
    )
  })

  it('gives the caret’s bar a length of its own from the palette’s Bar', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', { storage: withSong() })
    const bar = await openCategory(user, 'Bar')
    const lengths = within(bar).getByRole('group', { name: /^Bar length/ })
    expect(within(lengths).getByRole('button', { name: 'Bar length 4/4' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await user.click(within(lengths).getByRole('button', { name: 'Bar length 2/4' }))
    await waitFor(() =>
      expect(songOf(piecesStore.getState())).toMatchObject({
        sections: [{ lines: ['G@2 G G G'] }],
      }),
    )
  })

  it('changes the time signature to another of its kind, each bar made the new one', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', { storage: withSong() })
    const [head] = await screen.findAllByRole(
      'button',
      { name: 'Key and time signature' },
      { timeout: 4000 },
    )
    if (!head) throw new Error('no line head')
    await user.click(head)
    const meters = within(await screen.findByRole('dialog', { name: 'Song' })).getByRole(
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
    await openSettings(user)
    act(() => keyboard.press(midi(60)))
    expect(songOf(piecesStore.getState())).toEqual(before)
  })

  it('writes the melody from the computer keyboard, a value at a time', async () => {
    const user = userEvent.setup({ delay: 120 })
    const { piecesStore, settingsStore } = await renderApp('/edit/my-1', {
      storage: withSong({ melody: EMPTY_TUNE }),
    })
    act(() => setKeyboard(settingsStore, { typing: true }))
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
    await user.click(screen.getByRole('button', { name: 'View' }))
    await user.click(await screen.findByRole('switch', { name: 'Keys' }))
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
    // Beside the sheet, its side is chosen in View, once, not in the palette's crowded bar.
    await user.click(await screen.findByRole('button', { name: 'View' }))
    await user.click(await screen.findByRole('radio', { name: 'Left' }))
    expect(settingsStore.getState().paletteSide).toBe('left')
    await user.click(screen.getByRole('radio', { name: 'Right' }))
    expect(settingsStore.getState().paletteSide).toBe('right')
  })

  it('keeps the edits in a row under the bar, and only ‹ Play › in the dock, as the Player’s', async () => {
    await renderApp('/edit/my-1', { storage: withSong() })
    const row = await screen.findByRole('toolbar', { name: 'Edit' })
    expect(
      within(row)
        .getAllByRole('button')
        .map((button) => button.getAttribute('aria-label')),
    ).toEqual([
      'Next note goes in: Upper staff',
      'Delete',
      'Undo',
      'Redo',
      'Copy bars',
      'Cut bars',
      'Paste bars',
      'Add bar',
    ])
    // Named for what it does: Play, and the caret moved a note back or on.
    const dock = within(screen.getByRole('toolbar', { name: 'Play and move' })).getAllByRole(
      'button',
    )
    expect(dock.map((button) => button.getAttribute('aria-label'))).toEqual([
      'Tempo: 100%',
      'Previous note',
      'Play',
      'Next note',
    ])
  })

  it('says at the edit row’s head where the next note goes, and chooses the staff there, as Flat’s voice badge', async () => {
    const user = userEvent.setup()
    await renderApp('/edit/my-1', { storage: withSong() })
    const row = await screen.findByRole('toolbar', { name: 'Edit' })
    await user.click(within(row).getByRole('button', { name: 'Next note goes in: Upper staff' }))
    const staves = await screen.findByRole('listbox', { name: 'Next note goes in' })
    // The staves in sight, top down, each with its sign.
    const options = within(staves).getAllByRole('option')
    expect(options).toHaveLength(3)
    ;['Chord symbols', 'Upper staff', 'Lower staff'].forEach((name, i) =>
      expect(options[i]).toHaveAccessibleName(name),
    )
    await user.click(within(staves).getByRole('option', { name: 'Lower staff' }))
    expect(screen.getByRole('status')).toHaveTextContent(/^Lower staff · Bar 1/)
    expect(
      within(row).getByRole('button', { name: 'Next note goes in: Lower staff' }),
    ).toBeVisible()
  })

  it('plays what was written at the learner’s speed from its dock’s tempo, the song’s own kept', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', { storage: withSong() })
    await user.click(await screen.findByRole('button', { name: 'Tempo: 100%' }))
    await user.click(await screen.findByRole('option', { name: '50% speed' }))
    expect(await screen.findByRole('button', { name: 'Tempo: 50%' })).toBeInTheDocument()
    expect(songOf(piecesStore.getState())).toMatchObject({ tempo: 90 })
  })

  it('copies a bar and pastes it after the caret’s from the edit row, and adds a bar', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', { storage: withSong() })
    await toChordRow(user)
    await user.click(
      within(await screen.findByRole('group', { name: 'Chords in the key' })).getByRole('button', {
        name: 'Em',
      }),
    )
    await toChordRow(user)
    const row = screen.getByRole('toolbar', { name: 'Edit' })
    expect(within(row).getByRole('button', { name: 'Paste bars' })).toBeDisabled()
    await user.click(within(row).getByRole('button', { name: 'Copy bars' }))
    await user.click(within(row).getByRole('button', { name: 'Paste bars' }))
    expect(songOf(piecesStore.getState())).toMatchObject({
      sections: [{ lines: ['Em Em G G G'] }],
    })
    await user.click(within(row).getByRole('button', { name: 'Add bar' }))
    expect(songOf(piecesStore.getState())).toMatchObject({
      sections: [{ lines: ['Em Em Em G G G'] }],
    })
  })

  it('makes the note chosen an eighth from the quick row, and the next one too', async () => {
    const user = userEvent.setup({ delay: 120 })
    const storage = createMemoryStorage()
    const song = { ...SONG, melody: 'B4/1 A4/1 G4/1 F#4/1' }
    storage.setItem(
      PIECES_STORAGE_KEY,
      JSON.stringify({ state: { songs: [song], nextSong: 2 }, version: 2 }),
    )
    const { piecesStore } = await renderApp('/edit/my-1', { storage })
    expect(await screen.findByRole('status')).toHaveTextContent('B4 quarter')
    const values = screen.getByRole('group', { name: 'Note value' })
    expect(within(values).getByRole('button', { name: 'Quarter note' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await user.click(within(values).getByRole('button', { name: 'Eighth note' }))
    await waitFor(() =>
      expect(songOf(piecesStore.getState())).toMatchObject({
        melody: 'B4/.5 r/.5 A4/1 G4/1 F#4/1',
      }),
    )
    expect(screen.getByRole('status')).toHaveTextContent('B4 eighth')
    expect(within(values).getByRole('button', { name: 'Eighth note' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('puts a staccato on every note of a range, greyed with no note chosen', async () => {
    const user = userEvent.setup()
    const storage = createMemoryStorage()
    const song = { ...SONG, melody: 'B4/1 A4/1 G4/1 F#4/1' }
    storage.setItem(
      PIECES_STORAGE_KEY,
      JSON.stringify({ state: { songs: [song], nextSong: 2 }, version: 2 }),
    )
    const { piecesStore } = await renderApp('/edit/my-1', { storage })
    await screen.findByRole('status')
    await user.keyboard('{Shift>}{ArrowRight}{ArrowRight}{/Shift}')
    const marks = await tapIn(user, 'Articulations', 'Staccato')
    await waitFor(() =>
      expect(songOf(piecesStore.getState())).toMatchObject({
        melody: 'B4/1[stacc] A4/1[stacc] G4/1[stacc] F#4/1',
      }),
    )
    expect(within(marks).getByRole('button', { name: 'Staccato' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    // At the end, only a place for the next note: nothing to mark.
    await user.keyboard('{Meta>}{ArrowRight}{/Meta}')
    await user.keyboard('{End}')
    await waitFor(() =>
      expect(within(marks).getByRole('button', { name: 'Staccato' })).toBeDisabled(),
    )
    expect(
      within(marks).getByText('Choose a note first: these change the notes chosen.'),
    ).toBeInTheDocument()
  })

  it('keeps every tool in one palette, the hand’s own only in a hand', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', {
      storage: withSong({ melody: EMPTY_TUNE }),
    })
    const palette = await screen.findByRole('region', { name: 'Tools' })
    for (const name of ['Quarter note', '32nd note', 'Dotted'])
      expect(within(palette).getByRole('button', { name })).toBeInTheDocument()
    const notes = await openCategory(user, 'Notes')
    for (const name of [
      'Double dotted',
      'Triplet',
      'Rest',
      'Tie',
      'Chord',
      'Sharp',
      'Flat',
      'Natural',
    ])
      expect(within(notes).getByRole('button', { name })).toBeInTheDocument()
    const pitch = screen.getByRole('region', { name: 'Pitch' })
    for (const name of [
      'Up a semitone',
      'Down a semitone',
      'Up an octave',
      'Down an octave',
      'Up a diatonic step',
      'Down a diatonic step',
      'Enharmonic spelling',
    ])
      expect(within(pitch).getByRole('button', { name })).toBeInTheDocument()
    // The caret's moves stand apart from the palette, floating over the sheet; Delete is the edit row's.
    expect(within(palette).queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument()
    // A hand's fingers and clef are greyed in the tune, saying why.
    expect(within(palette).getByRole('button', { name: 'Fingering' })).toHaveAttribute('data-off')
    const bar = await tapIn(user, 'Bar', 'Add bar after')
    expect(songOf(piecesStore.getState())).toMatchObject({ sections: [{ lines: ['G G G G G'] }] })
    await user.click(within(bar).getByRole('button', { name: 'Add bar before' }))
    expect(songOf(piecesStore.getState())).toMatchObject({
      sections: [{ lines: ['G G G G G G'] }],
    })
    await user.keyboard('{Alt>}{ArrowDown}{ArrowDown}{/Alt}')
    expect(within(palette).getByRole('button', { name: 'Fingering' })).not.toHaveAttribute(
      'data-off',
    )
    const fingering = await openCategory(user, 'Fingering')
    expect(within(fingering).getByText('Choose a note to give it a finger.')).toBeInTheDocument()
  })

  it('toggles a sign on the note chosen from Notes: pressed while it carries it, off at a second tap (Flat’s)', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', {
      storage: withSong({ hands: { rh: 'Eb4/4 | r/4 | r/4 | r/4', lh: EMPTY_TUNE } }),
    })
    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent(/^Upper staff · Bar 1, beat 1 · E♭4/),
    )
    const notes = await openCategory(user, 'Notes')
    const flat = within(notes).getByRole('button', { name: 'Flat' })
    const natural = within(notes).getByRole('button', { name: 'Natural' })
    expect(flat).toHaveAttribute('aria-pressed', 'true')
    expect(natural).toHaveAttribute('aria-pressed', 'false')
    // ♭ again: off, the note as the key spells E.
    await user.click(flat)
    await waitFor(() =>
      expect(songOf(piecesStore.getState())).toMatchObject({
        hands: { rh: 'E4/4 | r/4 | r/4 | r/4' },
      }),
    )
    expect(flat).toHaveAttribute('aria-pressed', 'false')
    expect(natural).toHaveAttribute('aria-pressed', 'true')
    await user.click(within(notes).getByRole('button', { name: 'Sharp' }))
    await waitFor(() =>
      expect(songOf(piecesStore.getState())).toMatchObject({
        hands: { rh: 'E#4/4 | r/4 | r/4 | r/4' },
      }),
    )
    expect(within(notes).getByRole('button', { name: 'Sharp' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('marks the note at the caret from the palette’s categories, saved with the tune', async () => {
    const user = userEvent.setup({ delay: 120 })
    const { piecesStore, settingsStore } = await renderApp('/edit/my-1', {
      storage: withSong({ melody: EMPTY_TUNE }),
    })
    act(() => setKeyboard(settingsStore, { typing: true }))
    await user.keyboard('a')
    await user.keyboard('{ArrowLeft}')
    const marks = await tapIn(user, 'Articulations', 'Staccato')
    expect(within(marks).getByRole('button', { name: 'Staccato' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await tapIn(user, 'Slurs & lines', '8va: an octave higher')
    await tapIn(user, 'Dynamics & hairpins', 'Forte')
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
      JSON.stringify({ state: { songs: [song], nextSong: 2 }, version: 2 }),
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
      JSON.stringify({ state: { songs: [song], nextSong: 2 }, version: 2 }),
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

  it('opens at the bar its URL names, and turns to Practise at its caret’s bar (ADR 0090)', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/edit/my-1?bar=3', { storage: withSong() })
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/Bar 3, beat 1/))
    await waitFor(() => expect(router.state.location.search).not.toHaveProperty('bar'))
    const modes = screen.getByRole('navigation', { name: 'Practise or edit' })
    expect(within(modes).getByText('Edit').closest('[aria-current="page"]')).not.toBeNull()
    await user.keyboard('{Alt>}{ArrowRight}{/Alt}')
    const practise = within(modes).getByRole('link', { name: 'Practise' })
    expect(practise.getAttribute('href')).toBe('/play/my-1?bar=4')
    await user.click(practise)
    await waitFor(() => expect(router.state.location.pathname).toBe('/play/my-1'))
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

  it('keeps the MIDI keyboard in its bar, as the Player does, never in the Song sheet', async () => {
    const user = userEvent.setup()
    await renderApp('/edit/my-1', { storage: withSong() })
    const midiButton = await screen.findByRole('button', { name: 'MIDI keyboard' })
    // In the bar's order of the Player's: View, MIDI, then the song's own settings.
    const bar = midiButton.closest('[data-area="bar"]')
    const named = within(bar as HTMLElement)
      .getAllByRole('button')
      .map((button) => button.getAttribute('aria-label'))
      .filter((name) => name === 'View' || name === 'MIDI keyboard' || name === 'Song')
    expect(named).toEqual(['View', 'MIDI keyboard', 'Song'])
    const settings = await openSettings(user)
    expect(within(settings).queryByRole('region', { name: 'MIDI keyboard' })).toBeNull()
  })

  it('lays the score out as the Player does: one layout, both View menus writing it (ADR 0090)', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/edit/my-1', { storage: withSong() })
    await user.click(await screen.findByRole('button', { name: 'View' }))
    const view = await screen.findByRole('dialog', { name: 'View' })
    await user.click(within(view).getByRole('radio', { name: 'Pages' }))
    expect(settingsStore.getState().scoreView.layout).toBe('pages')
    expect(settingsStore.getState()).not.toHaveProperty('editorLayout')
  })

  it('offers the palette’s side only where it stands beside the sheet', async () => {
    const user = userEvent.setup()
    await renderApp('/edit/my-1', { storage: withSong() })
    await user.click(await screen.findByRole('button', { name: 'View' }))
    const view = await screen.findByRole('dialog', { name: 'View' })
    expect(within(view).getByRole('region', { name: 'Layout' })).toBeInTheDocument()
    // A phone held upright: the palette is at the foot, it has no side.
    expect(within(view).queryByRole('radiogroup', { name: 'Tools beside the music' })).toBeNull()
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
      JSON.stringify({ state: { songs: [song], nextSong: 2 }, version: 2 }),
    )
    const { settingsStore } = await renderApp('/edit/my-1', { storage })
    await user.click(await screen.findByRole('button', { name: 'Record' }))
    const sheet = await screen.findByRole('dialog', { name: 'Takes' })
    await user.click(within(sheet).getByRole('switch', { name: /^Melody/ }))
    expect(settingsStore.getState().recorder.tune).toBe(true)
  })

  it('offers no tune for a song without one', async () => {
    const user = userEvent.setup()
    await renderApp('/edit/my-1', { storage: withSong() })
    await user.click(await screen.findByRole('button', { name: 'Record' }))
    const sheet = await screen.findByRole('dialog', { name: 'Takes' })
    expect(within(sheet).getByRole('switch', { name: /^Metronome/ })).toBeInTheDocument()
    expect(within(sheet).queryByRole('switch', { name: /^Melody/ })).not.toBeInTheDocument()
  })

  it('records a take to the count-in, keeps it, plays it, and writes it into both hands', async () => {
    const user = userEvent.setup()
    const {
      audio,
      midi: keyboard,
      piecesStore,
      takesStore,
    } = await renderApp('/edit/my-1', {
      storage: withSong({ hands: SILENT_HANDS }),
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
    expect(songOf(piecesStore.getState())).toEqual({ ...SONG, hands: SILENT_HANDS })
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
    expect(within(form).getByRole('radio', { name: 'Both staves' })).toBeChecked()
    expect(within(form).getByRole('radio', { name: 'eighth' })).toBeChecked()
    await user.click(within(form).getByRole('button', { name: 'Write' }))
    await waitFor(() =>
      expect(songOf(piecesStore.getState())).toMatchObject({
        hands: { rh: 'G4/1 B4/1 D5/1 | r/4 | r/4 | r/4', lh: 'G2/3 | r/4 | r/4 | r/4' },
      }),
    )
    await user.click(screen.getByRole('button', { name: 'Undo' }))
    expect(songOf(piecesStore.getState())).toEqual({ ...SONG, hands: SILENT_HANDS })
  })

  it('counts in alone with the click off, keeping the switch', async () => {
    const user = userEvent.setup()
    const { audio, settingsStore } = await renderApp('/edit/my-1', { storage: withSong() })
    await user.click(await screen.findByRole('button', { name: 'Record' }))
    const sheet = await screen.findByRole('dialog', { name: 'Takes' })
    await user.click(within(sheet).getByRole('switch', { name: /^Metronome/ }))
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

    // The song stopped as the take began, its strip in the dock's place, and the tools that change
    // it wait for Stop.
    expect(screen.queryByRole('button', { name: 'Play' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Undo' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Song' })).toBeDisabled()
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
