import { act, fireEvent, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, onTestFinished, vi } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import {
  isDegreePiece,
  musicOf,
  pieceById,
  PIECES_STORAGE_KEY,
  PIECES_VERSION,
} from '@/entities/piece'
import { chartStart } from '@/features/edit-piece'
import { readDraft } from '@/features/score-editor'
import { setKeyboard, setPracticeToggle, setScoreView } from '@/features/set-preference'
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
    JSON.stringify({
      state: { songs: [{ ...SONG, ...music }], nextSong: 2 },
      version: PIECES_VERSION,
    }),
  )
  return storage
}
/**
 * Opens the chord-symbol field over bar `bar` (1 the first) as a tap over its staff does (ADR 0096):
 * jsdom lays nothing out, so a tap lands at the bar's top, in the chord row, at its first beat.
 */
async function chordFieldAt(user: ReturnType<typeof userEvent.setup>, bar: number) {
  await user.click(await screen.findByRole('button', { name: new RegExp(`^Bar ${bar}(:|$)`) }))
  return screen.findByRole('textbox', { name: 'Chord symbol' })
}

/** Puts the caret in bar 1's chord row: a tap there, its field closed with Escape. */
async function toChordRow(user: ReturnType<typeof userEvent.setup>) {
  await chordFieldAt(user, 1)
  await user.keyboard('{Escape}')
}

/** Writes a chord symbol over bar `bar` in the field a tap there opens, then closes it. */
async function writeChord(user: ReturnType<typeof userEvent.setup>, bar: number, symbol: string) {
  const field = await chordFieldAt(user, bar)
  await user.clear(field)
  await user.type(field, `${symbol}{Enter}`)
  await user.keyboard('{Escape}')
}

/**
 * Opens a category of the palette from its bar (the palette opening where it was folded): its
 * section, titled by its name.
 */
async function openCategory(user: ReturnType<typeof userEvent.setup>, category: string) {
  const bar = await screen.findByRole('toolbar', { name: 'Kinds of tools' })
  await user.click(within(bar).getByRole('button', { name: category }))
  return screen.findByRole('region', { name: category })
}

/** The Notes section's editing modes (ADR 0092). */
const modesOf = (notes: HTMLElement) =>
  within(notes).getByRole('radiogroup', { name: 'Editing mode' })

/** Opens a category of the palette and taps one of its keys. */
async function tapIn(user: ReturnType<typeof userEvent.setup>, category: string, key: string) {
  const section = await openCategory(user, category)
  await user.click(within(section).getByRole('button', { name: key }))
  return section
}

const songOf = (state: { songs: readonly { id: string }[] }) =>
  state.songs.find((song) => song.id === 'my-1')

/** A screen of a size, as `matchMedia` answers it: a phone on its side; else a phone held upright. */
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

/** The buttons of a toolbar, by their names. */
const namesIn = (toolbar: HTMLElement) =>
  within(toolbar)
    .getAllByRole('button')
    .map((button) => button.getAttribute('aria-label'))

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
    // The quick row is the values wherever the caret is: a chord symbol is typed over the staff.
    expect(within(palette).getByRole('group', { name: 'Note value' })).toBeInTheDocument()
  })

  it('prints the title at the sheet’s head, a click turning it into a field in its place (ADR 0094)', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', { storage: withSong() })
    const sheet = await screen.findByRole('region', { name: 'Score' })
    const heading = within(sheet).getByRole('heading', { level: 1, name: 'Morning' })
    await user.click(within(heading).getByRole('button', { name: 'Morning' }))
    // Enter saves.
    const field = within(sheet).getByRole('textbox', { name: 'Title' })
    expect(field).toHaveFocus()
    expect(field).toHaveAttribute('maxlength', '80')
    await user.clear(field)
    await user.type(field, 'Evening{Enter}')
    await waitFor(() => expect(songOf(piecesStore.getState())).toMatchObject({ title: 'Evening' }))
    expect(within(sheet).getByRole('heading', { level: 1, name: 'Evening' })).toBeInTheDocument()
    // Escape keeps the title it had.
    await user.click(within(sheet).getByRole('button', { name: 'Evening' }))
    await user.type(within(sheet).getByRole('textbox', { name: 'Title' }), ' song{Escape}')
    expect(within(sheet).getByRole('button', { name: 'Evening' })).toBeInTheDocument()
    // An empty title keeps the old one; leaving the field saves what it holds.
    await user.click(within(sheet).getByRole('button', { name: 'Evening' }))
    await user.clear(within(sheet).getByRole('textbox', { name: 'Title' }))
    await user.keyboard('{Enter}')
    expect(songOf(piecesStore.getState())).toMatchObject({ title: 'Evening' })
    await user.click(within(sheet).getByRole('button', { name: 'Evening' }))
    await user.type(within(sheet).getByRole('textbox', { name: 'Title' }), ' star')
    await user.click(document.body)
    await waitFor(() =>
      expect(songOf(piecesStore.getState())).toMatchObject({ title: 'Evening star' }),
    )
  })

  it('opens each staff’s menu from its name: the piano hidden and shown, the melody taken away and back (ADR 0094)', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', {
      storage: withSong({ melody: 'B4/4 | r/4 | r/4 | r/4', hands: SILENT_HANDS }),
    })
    const menu = async (staff: string, action: string) => {
      await user.click(await screen.findByRole('button', { name: staff }, { timeout: 4000 }))
      await user.click(await screen.findByRole('button', { name: action }))
    }
    // With a tune, the piano may be hidden: a lead sheet, its music kept.
    await menu('Piano staves', 'Hide the piano')
    await waitFor(() => expect(songOf(piecesStore.getState())).toMatchObject({ leadSheet: true }))
    expect(songOf(piecesStore.getState())).toMatchObject({ hands: SILENT_HANDS })
    await menu('Melody staff', 'Show the piano')
    await waitFor(() => expect(songOf(piecesStore.getState())).not.toHaveProperty('leadSheet'))
    // The tune's staff taken away with its notes; Undo brings them back.
    await menu('Melody staff', 'Remove the melody staff')
    await waitFor(() => expect(songOf(piecesStore.getState())).not.toHaveProperty('melody'))
    await user.click(screen.getByRole('button', { name: 'Undo' }))
    await waitFor(() => expect(songOf(piecesStore.getState())).toMatchObject({ melody: 'B4/4' }))
    await user.click(screen.getByRole('button', { name: 'Redo' }))
    await waitFor(() => expect(songOf(piecesStore.getState())).not.toHaveProperty('melody'))
    // With none, the piano's menu adds one.
    await menu('Piano staves', 'Add a melody staff')
    await waitFor(() => expect(songOf(piecesStore.getState())).toMatchObject({ melody: 'r/4' }))
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
    sizedAs(LANDSCAPE_PHONE)
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

  it('opens the tempo’s popover from the tempo mark: a beat less or more, typed, or a tempo word (ADR 0094)', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', { storage: withSong() })
    await user.click(
      await screen.findByRole('button', { name: 'Tempo: 90 BPM' }, { timeout: 4000 }),
    )
    const tempo = await screen.findByRole('dialog', { name: 'Tempo' })
    await user.click(within(tempo).getByRole('button', { name: 'A beat a minute faster' }))
    await waitFor(() => expect(songOf(piecesStore.getState())).toMatchObject({ tempo: 91 }))
    const bpm = within(tempo).getByRole('spinbutton', { name: 'Beats a minute' })
    expect(bpm).toHaveValue(91)
    await user.clear(bpm)
    await user.type(bpm, '72{Enter}')
    await waitFor(() => expect(songOf(piecesStore.getState())).toMatchObject({ tempo: 72 }))
    await user.click(within(tempo).getByRole('button', { name: 'Allegro, 130 a minute' }))
    await waitFor(() => expect(songOf(piecesStore.getState())).toMatchObject({ tempo: 130 }))
    expect(within(tempo).getByRole('button', { name: 'Allegro, 130 a minute' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(bpm).toHaveValue(130)
    // The mark printed says the new tempo.
    expect(await screen.findByRole('button', { name: 'Tempo: 130 BPM' })).toBeInTheDocument()
  })

  it('changes the song’s key at its first key signature, a later section’s from its own (ADR 0094)', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', {
      storage: withSong({
        sections: [
          { kind: 'verse', lines: ['G G G G'] },
          { kind: 'chorus', lines: ['C C C C'] },
        ],
      }),
    })
    // The verse's: the song's own key, the music moved with it.
    const [first] = await screen.findAllByRole(
      'button',
      { name: 'Key signature, bar 1' },
      { timeout: 4000 },
    )
    if (!first) throw new Error('no key signature at the head')
    await user.click(first)
    const song = await screen.findByRole('dialog', { name: 'Key signature' })
    expect(within(song).getByText('The whole song')).toBeInTheDocument()
    await user.click(
      within(within(song).getByRole('group', { name: 'Key' })).getByRole('radio', { name: 'A' }),
    )
    await waitFor(() =>
      expect(songOf(piecesStore.getState())).toMatchObject({
        key: 'A',
        sections: [{ lines: ['A A A A'] }, { lines: ['D D D D'] }],
      }),
    )
    await user.keyboard('{Escape}')
    // The chorus's: a key change from it on, its notes where they are.
    const [chorus] = await screen.findAllByRole('button', { name: 'Key signature, bar 5' })
    if (!chorus) throw new Error('no key signature at the chorus')
    await user.click(chorus)
    const change = await screen.findByRole('dialog', { name: 'Key signature' })
    expect(within(change).getByText('From Chorus on (bar 5)')).toBeInTheDocument()
    await user.click(
      within(within(change).getByRole('group', { name: 'Key' })).getByRole('radio', { name: 'D' }),
    )
    await waitFor(() =>
      expect(songOf(piecesStore.getState())).toMatchObject({
        key: 'A',
        sections: [{ lines: ['A A A A'] }, { key: 'D', lines: ['D D D D'] }],
      }),
    )
  })

  it('changes key from the caret’s section on in the palette, the song’s own in its first (ADR 0089)', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', { storage: withSong() })
    await screen.findByRole('status')
    expect(screen.queryByRole('button', { name: 'Insert' })).not.toBeInTheDocument()
    const key = await openCategory(user, 'Key signature')
    expect(within(key).getByText('The whole song')).toBeInTheDocument()
    const here = within(key).getByRole('group', { name: 'Key' })
    await user.click(within(here).getByRole('radio', { name: 'D' }))
    await waitFor(() =>
      expect(songOf(piecesStore.getState())).toMatchObject({
        key: 'D',
        sections: [{ lines: ['D D D D'] }],
      }),
    )
  })

  it('changes time from the caret’s section on in the palette and where it is printed, the song’s in its first (ADR 0095)', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', {
      storage: withSong({
        sections: [
          { kind: 'verse', lines: ['G G G G'] },
          { kind: 'chorus', lines: ['C C C C'] },
        ],
        hands: { rh: `${EMPTY_TUNE} | ${EMPTY_TUNE}`, lh: `${EMPTY_TUNE} | ${EMPTY_TUNE}` },
      }),
    })
    // The caret in the chorus's first bar: the Time signature from there on.
    await user.click(await screen.findByRole('button', { name: 'Bar 5: C' }))
    const time = await openCategory(user, 'Time signature')
    expect(within(time).getByText('From Chorus on (bar 5)')).toBeInTheDocument()
    const meters = within(time).getByRole('radiogroup', { name: 'Time signature' })
    expect(within(meters).getByRole('radio', { name: '4/4' })).toBeChecked()
    await user.click(within(meters).getByRole('radio', { name: '3/4' }))
    await waitFor(() =>
      expect(songOf(piecesStore.getState())).toMatchObject({
        meter: '4/4',
        sections: [{ lines: ['G G G G'] }, { kind: 'chorus', meter: '3/4', lines: ['C C C C'] }],
        hands: { lh: 'r/4 | r/4 | r/4 | r/4 | r/3 | r/3 | r/3 | r/3' },
      }),
    )
    // Its 3/4 printed where the chorus starts, opening the same: back to the song's 4/4 there.
    const [printed] = await screen.findAllByRole(
      'button',
      { name: 'Time signature, bar 5' },
      { timeout: 4000 },
    )
    if (!printed) throw new Error('no time signature at the chorus')
    await user.click(printed)
    const change = await screen.findByRole('dialog', { name: 'Time signature' })
    expect(within(change).getByText('From Chorus on (bar 5)')).toBeInTheDocument()
    await user.click(within(change).getByRole('radio', { name: '4/4' }))
    await waitFor(() =>
      expect(songOf(piecesStore.getState())).toMatchObject({
        sections: [{ lines: ['G G G G'] }, { lines: ['C C C C'] }],
      }),
    )
    expect(piecesStore.getState().songs[0]?.sections[1]).not.toHaveProperty('meter')
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
      JSON.stringify({ state: { songs: [song], nextSong: 2 }, version: PIECES_VERSION }),
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

  it('changes the time signature to another of its kind from the one printed, each bar made the new one', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', { storage: withSong() })
    const [time] = await screen.findAllByRole(
      'button',
      { name: 'Time signature, bar 1' },
      { timeout: 4000 },
    )
    if (!time) throw new Error('no time signature')
    await user.click(time)
    const popover = await screen.findByRole('dialog', { name: 'Time signature' })
    // At the song's first bar, the whole song's (ADR 0095).
    expect(within(popover).getByText('The whole song')).toBeInTheDocument()
    const meters = within(popover).getByRole('radiogroup', { name: 'Time signature' })
    expect(
      within(meters)
        .getAllByRole('radio')
        .map((meter) => meter.textContent),
    ).toEqual(['2/4', '3/4', '4/4'])
    await user.click(within(meters).getByRole('radio', { name: '3/4' }))
    expect(songOf(piecesStore.getState())).toMatchObject({ meter: '3/4' })
  })

  it('changes a staff’s clef from its bar on, from its clef printed there (ADR 0094)', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', {
      storage: withSong({ hands: SILENT_HANDS }),
    })
    await user.click(
      await screen.findByRole('button', { name: 'Clef, Lower staff, bar 1' }, { timeout: 4000 }),
    )
    const clef = await screen.findByRole('dialog', { name: 'Clef' })
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

  it('prints a section’s name in the labels’ row as the Player does, its menu opened there (ADR 0095)', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', {
      storage: withSong({
        sections: [
          { kind: 'verse', lines: ['G G G G'] },
          { kind: 'chorus', lines: ['C C C C'] },
        ],
      }),
    })
    const chorus = await screen.findByRole('button', { name: 'Chorus' })
    // No heading over its lines: its name at its first bar, beside the line's number.
    expect(chorus.closest('[data-slot="bar-label"]')).toHaveTextContent(/^5 · Chorus$/)
    expect(screen.queryByRole('heading', { name: /Chorus/ })).not.toBeInTheDocument()
    await user.click(chorus)
    const menu = await screen.findByRole('dialog', { name: 'Section' })
    await user.click(within(menu).getByRole('button', { name: 'Join with the section before' }))
    await waitFor(() =>
      expect(songOf(piecesStore.getState())).toMatchObject({
        sections: [{ kind: 'verse', lines: ['G G G G', 'C C C C'] }],
      }),
    )
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
    await writeChord(user, 1, 'Am')
    expect(songOf(piecesStore.getState())).toMatchObject({ sections: [{ lines: ['Am G G D'] }] })
  })

  it('types a chord symbol over the staff from Cmd+K: Enter or → a beat on, ← back, Escape out (ADR 0096)', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', {
      storage: withSong({ hands: SILENT_HANDS }),
    })
    const status = () => screen.getByRole('status')
    await waitFor(() => expect(status()).toHaveTextContent(/^Upper staff · Bar 1/))
    await user.keyboard('{Control>}k{/Control}')
    const field = await screen.findByRole('textbox', { name: 'Chord symbol' })
    await waitFor(() => expect(field).toHaveFocus())
    // It holds the chord written there, chosen, so what is typed writes over it.
    expect(field).toHaveValue('G')
    expect(status()).toHaveTextContent('Chord symbol · Bar 1, beat 1 · G')
    await user.keyboard('Am7{Enter}')
    await waitFor(() =>
      expect(songOf(piecesStore.getState())).toMatchObject({
        sections: [{ lines: ['Am7 G G G'] }],
      }),
    )
    // On a beat: no chord starts there, so the field is empty.
    expect(status()).toHaveTextContent('Chord symbol · Bar 1, beat 2 · Am7')
    expect(field).toHaveValue('')
    // A chord typed on a beat splits the bar; → at the text's end goes on too.
    await user.keyboard('D{ArrowRight}')
    expect(await screen.findByRole('button', { name: 'Bar 1: Am7 D' })).toBeInTheDocument()
    expect(status()).toHaveTextContent('Bar 1, beat 3')
    // ← at its start goes back a beat, to the chord there.
    await user.keyboard('{ArrowLeft}')
    expect(status()).toHaveTextContent('Bar 1, beat 2')
    expect(field).toHaveValue('D')
    // A symbol that cannot be read marks the field, writes nothing, and stays.
    await user.keyboard('Hm{Enter}')
    expect(field).toHaveAttribute('aria-invalid', 'true')
    expect(status()).toHaveTextContent('Bar 1, beat 2')
    // Emptied, Enter takes the chord there off.
    await user.clear(field)
    expect(field).toHaveAttribute('aria-invalid', 'false')
    await user.keyboard('{Enter}')
    expect(await screen.findByRole('button', { name: 'Bar 1: Am7' })).toBeInTheDocument()
    // Escape closes it, the caret back on the staff it came from.
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('textbox', { name: 'Chord symbol' })).not.toBeInTheDocument()
    expect(status()).toHaveTextContent(/^Upper staff · Bar 1, beat 3/)
  })

  it('opens the chord-symbol field from a tap over the staff, the key’s chords suggested as one types (ADR 0096)', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', { storage: withSong() })
    const field = await chordFieldAt(user, 2)
    expect(field).toHaveValue('G')
    const suggested = screen.getByRole('group', { name: 'Suggested chords' })
    const offered = () =>
      within(suggested)
        .getAllByRole('button')
        .map((each) => each.textContent)
    // The key's chords, I to vii, then their sevenths.
    expect(offered()).toEqual([
      ...['G', 'Am', 'Bm', 'C', 'D', 'Em', 'F♯°'],
      ...['GMaj7', 'Am7', 'Bm7', 'CMaj7', 'D7', 'Em7', 'F♯m7♭5'],
    ])
    await user.keyboard('b')
    expect(offered()).toEqual(['Bm', 'Bm7'])
    // A tap writes one, and the field goes on a beat, open.
    await user.click(within(suggested).getByRole('button', { name: 'Bm7' }))
    await waitFor(() =>
      expect(songOf(piecesStore.getState())).toMatchObject({
        sections: [{ lines: ['G Bm7 G G'] }],
      }),
    )
    expect(screen.getByRole('status')).toHaveTextContent('Chord symbol · Bar 2, beat 2')
    expect(screen.getByRole('textbox', { name: 'Chord symbol' })).toHaveFocus()
  })

  it('types a chord into a bar of no chord, at its start, as a new song’s bars are (ADR 0094)', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', {
      storage: withSong(chartStart({ tonic: note('G'), minor: false }, '4/4')),
    })
    const field = await chordFieldAt(user, 1)
    expect(screen.getByRole('status')).toHaveTextContent('Bar 1, beat 1 · no chord')
    expect(field).toHaveValue('')
    await user.type(field, 'Em{Enter}')
    expect(await screen.findByRole('button', { name: 'Bar 1: Em' })).toBeInTheDocument()
    expect(songOf(piecesStore.getState())).toMatchObject({ sections: [{ lines: ['Em _ _ _'] }] })
  })

  it('opens the chord-symbol field from the palette’s one key, greyed where the View hides the chord symbols', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/edit/my-1', { storage: withSong() })
    // No category of its own: Text & pedal holds its key, beside the Lyrics' (ADR 0096).
    const kinds = await screen.findByRole('toolbar', { name: 'Kinds of tools' })
    expect(within(kinds).queryByRole('button', { name: 'Chords' })).not.toBeInTheDocument()
    expect(within(kinds).queryByRole('button', { name: 'Fingering' })).not.toBeInTheDocument()
    const text = await openCategory(user, 'Text & pedal')
    const chords = within(text).getByRole('group', { name: 'Chord symbols and lyrics' })
    expect(
      within(chords)
        .getAllByRole('button')
        .map((key) => key.getAttribute('aria-label')),
    ).toEqual(['Chord symbol', 'Lyrics'])
    await user.click(within(chords).getByRole('button', { name: 'Chord symbol' }))
    expect(await screen.findByRole('textbox', { name: 'Chord symbol' })).toHaveFocus()
    await user.keyboard('{Escape}')
    act(() => setScoreView(settingsStore, { chordNames: false }))
    const key = within(chords).getByRole('button', { name: 'Chord symbol' })
    expect(key).toBeDisabled()
    expect(key).toHaveAttribute('title', 'Chord symbols are hidden: show them from View.')
    await user.keyboard('{Control>}k{/Control}')
    expect(screen.queryByRole('textbox', { name: 'Chord symbol' })).not.toBeInTheDocument()
  })

  it('names a chord played on a MIDI keyboard', async () => {
    const user = userEvent.setup()
    const { midi: keyboard } = await renderApp('/edit/my-1', { storage: withSong() })
    await toChordRow(user)
    expect(screen.getByRole('status')).toHaveTextContent(/^Chord symbols · Bar 1/)
    act(() => {
      for (const key of [53, 57, 60]) keyboard.press(midi(key))
    })
    expect(await screen.findByRole('button', { name: 'Bar 1: F' })).toBeInTheDocument()
  })

  it('says a change the song cannot be saved with, keeping the music last saved, until one saves', async () => {
    const user = userEvent.setup()
    const silent = 'r/4 | r/4 | r/4 | r/4 | r/4'
    const { piecesStore } = await renderApp('/edit/my-1', {
      storage: withSong({
        sections: [{ kind: 'verse', lines: ['G G G G G'] }],
        melody: 'C4/4 | C4/4 | C4/4 | C4/4 | C4/4',
        hands: { rh: silent, lh: silent },
      }),
    })
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/^Melody · Bar 1/))
    const notes = await openCategory(user, 'Notes')
    const tie = () => user.click(within(notes).getByRole('button', { name: 'Tie' }))
    // Four whole notes tied: sixteen beats, the longest a note is written.
    for (const _ of [1, 2, 3]) await tie()
    await waitFor(() => expect(piecesStore.getState().songs[0]?.melody).not.toMatch(/^C4\/4 /))
    const saved = songOf(piecesStore.getState())
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    // A fifth: twenty beats, more than a song is written with.
    await tie()
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'This change can’t be saved: the song stays as it was last saved.',
    )
    expect(songOf(piecesStore.getState())).toEqual(saved)
    // Undone, the music saves again and the notice goes.
    await user.click(screen.getByRole('button', { name: 'Undo' }))
    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument())
    // Closed, it stays away until a change cannot be saved again.
    await tie()
    await user.click(await screen.findByRole('button', { name: 'Close the notice' }))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('writes nothing from a MIDI keyboard behind an open menu', async () => {
    const user = userEvent.setup()
    const { midi: keyboard, piecesStore } = await renderApp('/edit/my-1', { storage: withSong() })
    await screen.findByRole('status')
    const before = songOf(piecesStore.getState())
    await user.click(screen.getByRole('button', { name: 'View' }))
    await screen.findByRole('dialog', { name: 'View' })
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

  it('cycles the editing modes with I, the caret line naming the mode; Insert pushes the later notes right (ADR 0092)', async () => {
    const user = userEvent.setup({ delay: 120 })
    const { piecesStore, settingsStore } = await renderApp('/edit/my-1', {
      storage: withSong({ melody: EMPTY_TUNE }),
    })
    act(() => setKeyboard(settingsStore, { typing: true }))
    await user.keyboard('asd')
    const three = { melody: expect.stringMatching(/^C4\/1 D4\/1 E4\/1( r\/1)?$/) as string }
    await waitFor(() => expect(songOf(piecesStore.getState())).toMatchObject(three))
    await user.keyboard('{Home}{ArrowRight}i')
    expect(screen.getByRole('status')).toHaveTextContent(
      /^Melody · Bar 1, beat 2 · D4 quarter · Insert mode$/,
    )
    await user.keyboard('g')
    await waitFor(() =>
      expect(songOf(piecesStore.getState())).toMatchObject({ melody: 'C4/1 G4/1 D4/1 E4/1' }),
    )
    const notes = await openCategory(user, 'Notes')
    expect(within(notes).getByRole('radio', { name: 'Insert' })).toBeChecked()
    // What each mode does is in the ⓘ beside Notes, never a line under the modes (ADR 0096).
    expect(notes).not.toHaveTextContent('pushes the notes after it')
    await user.click(within(notes).getByRole('button', { name: 'About Notes' }))
    const modes = await screen.findByRole('dialog', { name: 'Notes' })
    expect(modes).toHaveTextContent(
      'A note written pushes the notes after it to the right; Delete closes the gap.',
    )
    expect(modes).toHaveTextContent('A note written takes the place of what is at the caret.')
    await user.keyboard('{Escape}')
    await waitFor(() => expect(modes).not.toBeInTheDocument())
    // The G taken back, Delete closes the gap it leaves.
    await user.keyboard('{ArrowLeft}{Backspace}')
    await waitFor(() => expect(songOf(piecesStore.getState())).toMatchObject(three))
    await user.click(within(notes).getByRole('radio', { name: 'Chord' }))
    expect(screen.getByRole('status')).toHaveTextContent(/· Chord mode$/)
    await user.keyboard('i')
    expect(screen.getByRole('status')).not.toHaveTextContent('mode')
  })

  it('opens with its keys folded on a phone on its side', async () => {
    const user = userEvent.setup()
    sizedAs(LANDSCAPE_PHONE)
    const { settingsStore } = await renderApp('/edit/my-1', { storage: withSong() })
    await user.click(await screen.findByRole('button', { name: 'View' }))
    await user.click(await screen.findByRole('switch', { name: 'Keys' }))
    expect(settingsStore.getState().keyboard.foldedLandscape).toBe(false)
    expect(settingsStore.getState().keyboard.folded).toBe(false)
    expect(screen.getByRole('button', { name: 'Hide the keys' })).toBeInTheDocument()
  })

  it('offers no side for its palette beside the sheet, nor a switch for it, in the View (ADR 0094)', async () => {
    const user = userEvent.setup()
    sizedAs(LANDSCAPE_PHONE)
    const { settingsStore } = await renderApp('/edit/my-1', { storage: withSong() })
    await user.click(await screen.findByRole('button', { name: 'View' }))
    const view = await screen.findByRole('dialog', { name: 'View' })
    expect(within(view).queryByRole('radio', { name: 'Left' })).not.toBeInTheDocument()
    expect(within(view).queryByRole('switch', { name: 'Every tool' })).not.toBeInTheDocument()
    expect(within(view).getAllByRole('switch')).toHaveLength(7)
    // Beside the sheet it stands at its right: no side is kept for it.
    expect(settingsStore.getState()).not.toHaveProperty('paletteSide')
  })

  it.each([
    ['a phone held upright', 'none'],
    ['a phone on its side', LANDSCAPE_PHONE],
  ])(
    'keeps one bar on %s: the edits, the caret’s place for a screen reader alone, the title on the sheet (ADR 0094)',
    async (_size, query) => {
      sizedAs(query)
      await renderApp('/edit/my-1', { storage: withSong() })
      // What is done to what is chosen; the staff written is chosen on the sheet (a click, Alt ↑ ↓).
      expect(namesIn(await screen.findByRole('toolbar', { name: 'Edit' }))).toEqual([
        'Delete',
        'Undo',
        'Redo',
        'Copy',
        'Cut',
        'Paste',
      ])
      expect(screen.queryByRole('button', { name: /^Next note goes in/ })).not.toBeInTheDocument()
      // The sheet prints the title, the page's one heading; it shows the caret, which the bar says
      // for a screen reader.
      const sheet = screen.getByRole('region', { name: 'Score' })
      expect(within(sheet).getByRole('heading', { level: 1, name: 'Morning' })).not.toHaveClass(
        'sr-only',
      )
      expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
      const caret = screen.getByRole('status')
      expect(caret).toHaveClass('sr-only')
      expect(caret).toHaveAttribute('aria-live', 'polite')
      expect(caret).toHaveTextContent(/^Upper staff · Bar 1/)
    },
  )

  it.each([
    ['a phone held upright', 'none'],
    ['a phone on its side', LANDSCAPE_PHONE],
    ['a laptop', '(min-width: 64rem)'],
  ])(
    'shows each control of its bar and dock as its icon on %s, named by its label and a tooltip (ADR 0094)',
    async (_size, query) => {
      sizedAs(query)
      await renderApp('/edit/my-1', { storage: withSong() })
      const midiButton = await screen.findByRole('button', { name: 'MIDI keyboard' })
      const bar = [
        ...(midiButton.closest('[data-area="bar"]')?.querySelectorAll('button, a') ?? []),
      ]
      const dock = [
        ...screen
          .getByRole('toolbar', { name: 'Play, move and record' })
          .querySelectorAll('button:not([aria-label^="Tempo"])'),
      ]
      expect(bar).toHaveLength(10)
      for (const control of [...bar, ...dock]) {
        const name = control.getAttribute('aria-label') ?? ''
        expect(shownText(control), name).toBe('')
        // Its name in a tooltip: the browser's (`title`), or the edit row's own, which adds what
        // the command acts on.
        const tooltip = control.getAttribute('title') ?? control.getAttribute('data-slot')
        expect(tooltip, name).toMatch(new RegExp(`^(${name}|tooltip-trigger)`))
      }
    },
  )

  it('keeps ‹ Play › in the dock, as the Player’s, and Record after them, as Dorico’s transport (ADR 0094)', async () => {
    const user = userEvent.setup()
    await renderApp('/edit/my-1', { storage: withSong() })
    // Named for what it does: Play, the caret moved a note back or on, and a take recorded.
    const dock = await screen.findByRole('toolbar', { name: 'Play, move and record' })
    expect(namesIn(dock)).toEqual(['Tempo: 100%', 'Previous note', 'Play', 'Next note', 'Record'])
    // No MIDI keyboard yet: Record's popover says what it needs (ADR 0096).
    await user.click(within(dock).getByRole('button', { name: 'Record' }))
    expect(await screen.findByRole('dialog', { name: 'Record' })).toBeInTheDocument()
  })

  it('plays what was written at the learner’s speed from its dock’s tempo, the song’s own kept', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', { storage: withSong() })
    await user.click(await screen.findByRole('button', { name: 'Tempo: 100%' }))
    await user.click(await screen.findByRole('option', { name: '50% speed' }))
    expect(await screen.findByRole('button', { name: 'Tempo: 50%' })).toBeInTheDocument()
    expect(songOf(piecesStore.getState())).toMatchObject({ tempo: 90 })
  })

  it('copies a bar and pastes it after the caret’s from the edit row, and adds a bar from the palette’s Bar', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', { storage: withSong() })
    await writeChord(user, 1, 'Em')
    await toChordRow(user)
    const row = screen.getByRole('toolbar', { name: 'Edit' })
    // Nothing copied yet: Paste is greyed (its tooltip saying so).
    expect(within(row).getByRole('button', { name: 'Paste' })).toHaveAttribute(
      'aria-disabled',
      'true',
    )
    await user.click(within(row).getByRole('button', { name: 'Copy' }))
    await user.click(within(row).getByRole('button', { name: 'Paste' }))
    expect(songOf(piecesStore.getState())).toMatchObject({
      sections: [{ lines: ['Em Em G G G'] }],
    })
    // No Add bar in the row: the palette's Bar adds one after the caret's (or before).
    expect(within(row).queryByRole('button', { name: /bar/i })).not.toBeInTheDocument()
    await tapIn(user, 'Bar', 'Add bar after')
    // A bar added has no chord, as a notation app adds one (ADR 0094).
    expect(songOf(piecesStore.getState())).toMatchObject({
      sections: [{ lines: ['Em Em _ G G G'] }],
    })
  })

  it('copies the notes chosen on a staff and pastes them at the caret, the bars’ clip staying the chord row’s (ADR 0092)', async () => {
    const user = userEvent.setup({ delay: 120 })
    const { piecesStore, settingsStore } = await renderApp('/edit/my-1', {
      storage: withSong({ melody: 'B4/1 A4/1 G4/1 F#4/1' }),
    })
    act(() => setKeyboard(settingsStore, { typing: true }))
    expect(await screen.findByRole('status')).toHaveTextContent('B4 quarter')
    const row = screen.getByRole('toolbar', { name: 'Edit' })
    await user.keyboard('{Shift>}{ArrowRight}{/Shift}')
    await user.keyboard('{Meta>}c{/Meta}')
    await user.keyboard('{Escape}{Alt>}{ArrowRight}{/Alt}')
    await user.click(within(row).getByRole('button', { name: 'Paste' }))
    await waitFor(() =>
      expect(songOf(piecesStore.getState())).toMatchObject({
        melody: 'B4/1 A4/1 G4/1 F#4/1 | B4/1 A4/1',
      }),
    )
    // In the chord row the clip's notes have no place: Paste says so.
    await toChordRow(user)
    expect(within(row).getByRole('button', { name: 'Paste' })).toHaveAttribute(
      'aria-disabled',
      'true',
    )
    // Cut takes the notes chosen and leaves their time as a rest.
    await user.keyboard('{Alt>}{ArrowDown}{/Alt}{Home}')
    await user.click(within(row).getByRole('button', { name: 'Cut' }))
    await waitFor(() =>
      expect(songOf(piecesStore.getState())).toMatchObject({
        melody: 'r/1 A4/1 G4/1 F#4/1 | B4/1 A4/1',
      }),
    )
  })

  it('makes the note chosen an eighth from the quick row, and the next one too', async () => {
    const user = userEvent.setup({ delay: 120 })
    const storage = createMemoryStorage()
    const song = { ...SONG, melody: 'B4/1 A4/1 G4/1 F#4/1' }
    storage.setItem(
      PIECES_STORAGE_KEY,
      JSON.stringify({ state: { songs: [song], nextSong: 2 }, version: PIECES_VERSION }),
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
      JSON.stringify({ state: { songs: [song], nextSong: 2 }, version: PIECES_VERSION }),
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
    // Greyed, a key says why in its tooltip, and so does the ⓘ beside its section's name, never a
    // line in the section (ADR 0096).
    const reason = 'Choose a note first: these change the notes chosen.'
    const staccato = within(marks).getByRole('button', { name: 'Staccato' })
    expect(staccato).toHaveAttribute('title', reason)
    expect(staccato).toHaveAccessibleDescription(reason)
    for (const line of within(marks).getAllByText(reason)) expect(line).not.toBeVisible()
    await user.click(within(marks).getByRole('button', { name: 'About Articulations' }))
    expect(await screen.findByRole('dialog', { name: 'Articulations' })).toHaveTextContent(reason)
  })

  it('keeps every tool in one palette, the hand’s own only in a hand', async () => {
    const user = userEvent.setup()
    const { piecesStore, settingsStore } = await renderApp('/edit/my-1', {
      storage: withSong({ melody: EMPTY_TUNE }),
    })
    const palette = await screen.findByRole('region', { name: 'Tools' })
    for (const name of ['Quarter note', '32nd note', 'Dotted'])
      expect(within(palette).getByRole('button', { name })).toBeInTheDocument()
    const notes = await openCategory(user, 'Notes')
    for (const name of ['Double dotted', 'Triplet', 'Rest', 'Tie', 'Sharp', 'Flat', 'Natural'])
      expect(within(notes).getByRole('button', { name })).toBeInTheDocument()
    // The editing modes, Flat's, one always chosen (ADR 0092).
    const modes = within(modesOf(notes)).getAllByRole('radio')
    expect(modes).toHaveLength(3)
    ;['Replace', 'Insert', 'Chord'].forEach((name, i) =>
      expect(modes[i]).toHaveAccessibleName(name),
    )
    expect(modes[0]).toBeChecked()
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
    // A hand's clef is greyed in the tune, saying why, and so is its fingers' key.
    const kinds = screen.getByRole('toolbar', { name: 'Kinds of tools' })
    expect(within(kinds).getByRole('button', { name: 'Clef' })).toHaveAttribute('data-off')
    act(() => setPracticeToggle(settingsStore, 'fingerNumbers', true))
    const articulations = await openCategory(user, 'Articulations')
    const fingers = within(articulations).getByRole('button', { name: 'Fingering' })
    expect(fingers).toBeDisabled()
    expect(fingers).toHaveAccessibleDescription(
      'For the piano’s staves: tap a note on the upper or lower staff.',
    )
    // A bar added has no chord, as a notation app adds one (ADR 0094).
    const bar = await tapIn(user, 'Bar', 'Add bar after')
    expect(songOf(piecesStore.getState())).toMatchObject({ sections: [{ lines: ['G _ G G G'] }] })
    await user.click(within(bar).getByRole('button', { name: 'Add bar before' }))
    expect(songOf(piecesStore.getState())).toMatchObject({
      sections: [{ lines: ['G _ _ G G G'] }],
    })
    await user.keyboard('{Alt>}{ArrowDown}{ArrowDown}{/Alt}')
    expect(within(kinds).getByRole('button', { name: 'Clef' })).not.toHaveAttribute('data-off')
    const key = within(articulations).getByRole('button', { name: 'Fingering' })
    expect(key).toBeDisabled()
    expect(key).toHaveAccessibleDescription('Choose a note first: these change the notes chosen.')
  })

  it('types fingers over the note from Shift+F, a chord’s bottom up, Enter going on (ADR 0096)', async () => {
    const user = userEvent.setup()
    const { piecesStore, settingsStore } = await renderApp('/edit/my-1', {
      storage: withSong({
        hands: { rh: 'C4+E4+G4/4 | G4/4 | r/4 | r/4', lh: 'r/4 | C3/4 | r/4 | r/4' },
      }),
    })
    const status = () => screen.getByRole('status')
    const hands = () => songOf(piecesStore.getState())
    await waitFor(() => expect(status()).toHaveTextContent(/^Upper staff · Bar 1/))
    // Typed where they print: nowhere while the View hides the finger numbers.
    await user.keyboard('{Shift>}F{/Shift}')
    expect(screen.queryByRole('textbox', { name: 'Fingering' })).not.toBeInTheDocument()
    act(() => setPracticeToggle(settingsStore, 'fingerNumbers', true))
    await user.keyboard('{Shift>}F{/Shift}')
    const field = await screen.findByRole('textbox', { name: 'Fingering' })
    await waitFor(() => expect(field).toHaveFocus())
    // Over the upper staff's notes, where their fingers print.
    expect(field.closest('[data-side]')).toHaveAttribute('data-side', 'top')
    // A phone's digits keyboard; the caret line says what it writes.
    expect(field).toHaveAttribute('inputmode', 'numeric')
    expect(status()).toHaveTextContent(/^Fingering · Upper staff · Bar 1/)
    // Digits 1 to 5 and spaces alone: what else is typed is left out.
    await user.keyboard('1 3x 5{Enter}')
    await waitFor(() =>
      expect(hands()).toMatchObject({ hands: { rh: 'C4^1+E4^3+G4^5/4 | G4/4 | r/4 | r/4' } }),
    )
    // Printed over the chord's notes.
    await waitFor(() =>
      expect(
        [...document.querySelectorAll('[data-slot="score"] g.fing')].map((g) =>
          g.textContent?.trim(),
        ),
      ).toEqual(['1', '3', '5']),
    )
    // On to the staff's next note.
    expect(status()).toHaveTextContent(/^Fingering · Upper staff · Bar 2/)
    await user.keyboard('4{Enter}')
    await waitFor(() =>
      expect(hands()).toMatchObject({ hands: { rh: 'C4^1+E4^3+G4^5/4 | G4^4/4 | r/4 | r/4' } }),
    )
    // More fingers than notes mark it and write nothing.
    await user.keyboard('{Home}{ArrowLeft}')
    expect(field).toHaveValue('1 3 5')
    await user.keyboard('1 2 3 4{Enter}')
    expect(field).toHaveAttribute('aria-invalid', 'true')
    expect(status()).toHaveTextContent(/Bar 1/)
    // Emptied, Enter takes the fingers off; Escape closes it.
    await user.clear(field)
    await user.keyboard('{Enter}{Escape}')
    await waitFor(() =>
      expect(hands()).toMatchObject({ hands: { rh: 'C4+E4+G4/4 | G4^4/4 | r/4 | r/4' } }),
    )
    expect(screen.queryByRole('textbox', { name: 'Fingering' })).not.toBeInTheDocument()
    expect(status()).toHaveTextContent(/^Upper staff · Bar 2/)
    // Under the lower staff's notes, where theirs print.
    await user.keyboard('{Alt>}{ArrowDown}{/Alt}{Shift>}F{/Shift}')
    const under = await screen.findByRole('textbox', { name: 'Fingering' })
    expect(status()).toHaveTextContent(/^Fingering · Lower staff · Bar 2/)
    expect(under.closest('[data-side]')).toHaveAttribute('data-side', 'bottom')
  })

  it('opens the fingering field from the palette’s one key, over the one note of a chord chosen (ADR 0096)', async () => {
    const user = userEvent.setup()
    const { piecesStore, settingsStore } = await renderApp('/edit/my-1', {
      storage: withSong({ hands: { rh: 'C4+E4+G4/4 | G4/4 | r/4 | r/4', lh: EMPTY_TUNE } }),
    })
    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent(/^Upper staff · Bar 1/),
    )
    // Alt ↑ chooses the chord's top note, G.
    await user.keyboard('{Alt>}{ArrowUp}{/Alt}')
    const fingering = await openCategory(user, 'Articulations')
    // Greyed while the View hides the finger numbers, saying where they are shown.
    const key = within(fingering).getByRole('button', { name: 'Fingering' })
    expect(key).toBeDisabled()
    expect(key).toHaveAccessibleDescription('Finger numbers are hidden: show them from View.')
    act(() => setPracticeToggle(settingsStore, 'fingerNumbers', true))
    await user.click(within(fingering).getByRole('button', { name: 'Fingering' }))
    expect(await screen.findByRole('textbox', { name: 'Fingering' })).toHaveValue('')
    // Leaving it keeps what it holds.
    await user.keyboard('5{Escape}')
    await waitFor(() =>
      expect(songOf(piecesStore.getState())).toMatchObject({
        hands: { rh: 'C4+E4+G4^5/4 | G4/4 | r/4 | r/4' },
      }),
    )
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

  it('shows the Text & pedal terms alone on their keys, each meaning its tooltip (ADR 0096)', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', {
      storage: withSong({ melody: 'B4/4 | A4/4 | G4/4 | F#4/4' }),
    })
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/^Melody · Bar 1/))
    const text = await openCategory(user, 'Text & pedal')
    const expressions = within(text).getByRole('group', { name: 'Expression text' })
    const dolce = within(expressions).getByRole('button', { name: 'Dolce' })
    expect(within(dolce).getByText('dolce')).toBeVisible()
    expect(dolce).toHaveAccessibleDescription('Sweetly')
    expect(within(text).getByText('Sweetly')).not.toBeVisible()
    const rit = within(expressions).getByRole('button', { name: 'Ritardando' })
    expect(within(rit).getByText('rit.')).toBeVisible()
    expect(rit).toHaveAccessibleDescription('Gradually slower')
    await user.click(dolce)
    await waitFor(() =>
      expect(songOf(piecesStore.getState())).toMatchObject({
        melody: 'B4/4[dolce] | A4/4 | G4/4 | F#4/4',
      }),
    )
  })

  it('shows a jump’s words alone on its key, what it asks its tooltip', async () => {
    const user = userEvent.setup()
    await renderApp('/edit/my-1', { storage: withSong() })
    const repeats = await openCategory(user, 'Barlines & repeats')
    const jumps = within(repeats).getByRole('group', { name: 'Signs and jumps' })
    const dcFine = within(jumps).getByRole('button', { name: 'D.C. al Fine' })
    expect(dcFine).toHaveAccessibleDescription('From the start to Fine')
    expect(within(repeats).getByText('From the start to Fine')).not.toBeVisible()
  })

  it('undoes and redoes by button and by Cmd+Z', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', { storage: withSong() })
    await writeChord(user, 1, 'C')
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

  it.each(['scroll', 'pages', 'horizontal'] as const)(
    'draws the playhead as Play plays, moving with the music, the caret left where it was, %s (ADR 0096)',
    async (layout) => {
      const user = userEvent.setup()
      const { audio, settingsStore } = await renderApp('/edit/my-1', { storage: withSong() })
      act(() => setScoreView(settingsStore, { layout }))
      // The caret in bar 3's chord row: a tap there, its chord-symbol field closed.
      await chordFieldAt(user, 3)
      await user.keyboard('{Escape}')
      const said = screen.getByRole('status').textContent
      expect(document.querySelector('[data-slot="playhead"]')).toBeNull()
      await user.click(screen.getByRole('button', { name: 'Play' }))
      const playhead = await waitFor(() => {
        const line = document.querySelector<HTMLElement>('[data-slot="playhead"]')
        if (!line) throw new Error('the playhead')
        return line
      })
      const standing = Number.parseFloat(playhead.style.left)
      // Half a beat in, the music has moved on: so has the playhead, every frame.
      const started = audio.played.at(-1)?.at ?? 0
      act(() => audio.setNow(started + 1 / 3))
      await waitFor(() => expect(Number.parseFloat(playhead.style.left)).toBeGreaterThan(standing))
      // The caret where it was, its line saying so, a line on its staff; the playhead gone with Stop.
      expect(screen.getByRole('status').textContent).toBe(said)
      expect(document.querySelector('[data-slot="caret"]')).toHaveAttribute('data-mark', 'line')
      await user.click(screen.getByRole('button', { name: 'Stop' }))
      expect(document.querySelector('[data-slot="playhead"]')).toBeNull()
    },
  )

  it('plays a written left hand in the Player, in any key', async () => {
    const user = userEvent.setup()
    const storage = createMemoryStorage()
    // C3 over G: a note the pattern never plays there.
    const song = { ...SONG, hands: { lh: 'C3/4 | - | - | -' } }
    storage.setItem(
      PIECES_STORAGE_KEY,
      JSON.stringify({ state: { songs: [song], nextSong: 2 }, version: PIECES_VERSION }),
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
      JSON.stringify({ state: { songs: [song], nextSong: 2 }, version: PIECES_VERSION }),
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
    await writeChord(user, 1, 'Em')
    await waitFor(() =>
      expect(piecesStore.getState().versions.amazing?.sections[0]?.lines[0]).toBe('Em G7 C G'),
    )
    // The sheet prints only what the learner wrote: the song's page says it is their version (ADR 0096).
    expect(screen.queryByText('Your version')).toBeNull()
    await user.click(screen.getByRole('button', { name: 'Undo' }))
    await waitFor(() => expect(piecesStore.getState().versions).toEqual({}))
    const original = pieceById('amazing')
    if (!original || isDegreePiece(original)) throw new Error('a song')
    expect(musicOf(original).sections[0]?.lines[0]).toBe('G G7 C G')
  })

  it('gives a catalog song a title of the learner’s own from the sheet, saved as its version (ADR 0094)', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/amazing', { locale: 'ru' })
    const sheet = await screen.findByRole('region', { name: 'Ноты' })
    await user.click(within(sheet).getByRole('button', { name: 'О, благодать' }))
    // The same title again is no title of the learner's own: no version.
    await user.keyboard('{Enter}')
    expect(piecesStore.getState().versions).toEqual({})
    await user.click(within(sheet).getByRole('button', { name: 'О, благодать' }))
    const field = within(sheet).getByRole('textbox', { name: 'Название' })
    await user.clear(field)
    await user.type(field, 'Благодать{Enter}')
    await waitFor(() =>
      expect(piecesStore.getState().versions.amazing).toMatchObject({ title: 'Благодать' }),
    )
    expect(within(sheet).getByRole('heading', { level: 1, name: 'Благодать' })).toBeInTheDocument()
    // Only the title the learner wrote: no "Your version" printed under it (ADR 0096).
    expect(screen.queryByText('Ваша версия')).toBeNull()
    // Undone, the catalog's title, and no version.
    await user.click(screen.getByRole('button', { name: 'Отменить' }))
    await waitFor(() => expect(piecesStore.getState().versions).toEqual({}))
    expect(
      within(sheet).getByRole('heading', { level: 1, name: 'О, благодать' }),
    ).toBeInTheDocument()
  })

  it('writes a listing’s chart, which then opens in the Player', async () => {
    const user = userEvent.setup()
    const storage = createMemoryStorage()
    const { piecesStore } = await renderApp('/edit/bz4', { storage })
    await writeChord(user, 1, 'Fm')
    expect(piecesStore.getState().versions.bz4?.sections[0]?.lines[0]).toBe('Fm _ _ _')
  })

  it('keeps the MIDI keyboard in its bar, last, as the Player does, and no Song sheet (ADR 0094)', async () => {
    await renderApp('/edit/my-1', { storage: withSong() })
    const midiButton = await screen.findByRole('button', { name: 'MIDI keyboard' })
    const bar = midiButton.closest('[data-area="bar"]')
    expect(namesIn(bar as HTMLElement)).toEqual([
      'Close',
      'Delete',
      'Undo',
      'Redo',
      'Copy',
      'Cut',
      'Paste',
      'View',
      'MIDI keyboard',
    ])
  })

  it('shows the score through the Player’s View, one menu, but what only practice has (ADR 0090, 0094)', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/edit/my-1', { storage: withSong() })
    await user.click(await screen.findByRole('button', { name: 'View' }))
    const view = await screen.findByRole('dialog', { name: 'View' })
    expect(
      within(view)
        .getAllByRole('region')
        .map((section) => section.getAttribute('aria-label')),
    ).toEqual(['Layout', 'Staves', 'Show'])
    // Nothing in it twice: the palette folds by its own handle, and stands at the sheet's right.
    // What the sheet prints, the fingers too: the fingering field types them there (ADR 0096).
    const switches = within(view).getAllByRole('switch')
    expect(switches).toHaveLength(7)
    ;[
      'Melody',
      'Upper staff',
      'Lower staff',
      'Chord symbols',
      'Lyrics',
      'Finger numbers',
      'Keys',
    ].forEach((name, i) => expect(switches[i]).toHaveAccessibleName(name))
    await user.click(within(view).getByRole('switch', { name: 'Finger numbers' }))
    expect(settingsStore.getState().practice.fingerNumbers).toBe(true)
    expect(within(view).queryByRole('radiogroup', { name: /beside/ })).not.toBeInTheDocument()
    await user.click(within(view).getByRole('radio', { name: 'Pages' }))
    expect(settingsStore.getState().scoreView.layout).toBe('pages')
    expect(settingsStore.getState()).not.toHaveProperty('editorLayout')
  })

  it('shows the tune’s staff and the chord symbols as the View says, the caret kept in sight (ADR 0094)', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/edit/my-1', {
      storage: withSong({ melody: 'B4/4 | D5/4 | G4/4 | G4/4' }),
    })
    const staves = () =>
      new Set(
        [...document.querySelectorAll('[data-slot="score"] g.staff[data-staff]')].map((staff) =>
          staff.getAttribute('data-staff'),
        ),
      )
    const chordNames = () =>
      [...document.querySelectorAll('[data-slot="line-labels"]')].map((labels) =>
        /G/.test(labels.textContent),
      )
    await waitFor(() => expect(staves()).toEqual(new Set(['melody', 'treble', 'bass'])), {
      timeout: 4000,
    })
    expect(chordNames()).toContain(true)
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/^Melody · Bar 1/))
    await user.click(screen.getByRole('button', { name: 'View' }))
    const view = await screen.findByRole('dialog', { name: 'View' })
    await user.click(within(view).getByRole('switch', { name: 'Melody' }))
    expect(settingsStore.getState().scoreView.melodyStaff).toBe(false)
    await waitFor(() => expect(staves()).toEqual(new Set(['treble', 'bass'])))
    // The caret leaves the staff out of sight for the one under it; its notes are kept.
    expect(screen.getByRole('status')).toHaveTextContent(/^Upper staff · Bar 1/)
    await user.click(within(view).getByRole('switch', { name: 'Chord symbols' }))
    expect(settingsStore.getState().scoreView.chordNames).toBe(false)
    await waitFor(() => expect(chordNames()).not.toContain(true))
    await user.keyboard('{Escape}')
    // Up from the top staff in sight there is no row to write: the caret stays.
    await user.keyboard('{Alt>}{ArrowUp}{/Alt}')
    expect(screen.getByRole('status')).toHaveTextContent(/^Upper staff · Bar 1/)
  })

  it('draws one piano staff alone where the View hides the other, the caret kept on the one in sight (ADR 0094)', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/edit/my-1', {
      storage: withSong({ hands: SILENT_HANDS }),
    })
    const staves = () =>
      new Set(
        [...document.querySelectorAll('[data-slot="score"] g.staff[data-staff]')].map((staff) =>
          staff.getAttribute('data-staff'),
        ),
      )
    await waitFor(() => expect(staves()).toEqual(new Set(['treble', 'bass'])), { timeout: 4000 })
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/^Upper staff/))
    await user.click(screen.getByRole('button', { name: 'View' }))
    const view = await screen.findByRole('dialog', { name: 'View' })
    await user.click(within(view).getByRole('switch', { name: 'Upper staff' }))
    expect(settingsStore.getState().scoreView.hidden).toEqual(['treble'])
    await waitFor(() => expect(staves()).toEqual(new Set(['bass'])))
    expect(screen.getByRole('status')).toHaveTextContent(/^Lower staff · Bar 1/)
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

  type App = Awaited<ReturnType<typeof renderApp>>

  /** A MIDI keyboard connected, as one the learner allowed before is found as the app opens. */
  const connect = (keyboard: App['midi']) =>
    act(() => keyboard.setStatus({ state: 'connected', devices: ['Keyboard'] }))

  /** Records from the dock's Record, which counts in at once with a MIDI keyboard (ADR 0096). */
  async function startTake(user: ReturnType<typeof userEvent.setup>, keyboard: App['midi']) {
    connect(keyboard)
    await user.click(await screen.findByRole('button', { name: 'Record' }))
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Count-in'))
  }

  /** The recording strip's settings, opened from its button while a take records. */
  async function recordingSettings(user: ReturnType<typeof userEvent.setup>) {
    await user.click(screen.getByRole('button', { name: 'Recording settings' }))
    return screen.findByRole('dialog', { name: 'Recording settings' })
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
  function playArpeggio(audio: App['audio'], keyboard: App['midi']) {
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

  it('records at once from the dock’s Record, keeps the take, plays it, and writes it into both hands', async () => {
    const user = userEvent.setup()
    const {
      audio,
      midi: keyboard,
      piecesStore,
      takesStore,
    } = await renderApp('/edit/my-1', {
      storage: withSong({ hands: SILENT_HANDS }),
    })
    await startTake(user, keyboard)
    // No sheet first: the count-in sounds, the recording strip in the dock's place.
    expect(screen.queryByRole('dialog')).toBeNull()
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

    // The takes' sheet opens on the take just kept.
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
    await user.click(within(form).getByRole('button', { name: 'Write from bar 1' }))
    await waitFor(() =>
      expect(songOf(piecesStore.getState())).toMatchObject({
        hands: { rh: 'G4/1 B4/1 D5/1 | r/4 | r/4 | r/4', lh: 'G2/3 | r/4 | r/4 | r/4' },
      }),
    )
    await user.click(screen.getByRole('button', { name: 'Undo' }))
    expect(songOf(piecesStore.getState())).toEqual({ ...SONG, hands: SILENT_HANDS })
  })

  it('says in Record’s popover that a MIDI keyboard is needed, and records once one is connected there', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/edit/my-1', { storage: withSong() })
    await user.click(await screen.findByRole('button', { name: 'Record' }))
    const record = await screen.findByRole('dialog', { name: 'Record' })
    expect(record).toHaveTextContent('Recording needs a MIDI keyboard.')
    expect(audio.played).toEqual([])
    await user.click(within(record).getByRole('button', { name: 'Connect a MIDI keyboard' }))
    await user.click(await within(record).findByRole('button', { name: 'Record' }))
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Count-in'))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  })

  it('cannot record in a browser without MIDI, and says so in Record’s popover', async () => {
    const user = userEvent.setup()
    await renderApp('/edit/my-1', { storage: withSong(), webMidi: false })
    await user.click(await screen.findByRole('button', { name: 'Record' }))
    const record = await screen.findByRole('dialog', { name: 'Record' })
    expect(within(record).getByText('This browser can’t connect a MIDI keyboard.')).toBeVisible()
    expect(within(record).queryByRole('button')).toBeNull()
  })

  it('keeps the metronome and the tune in the recording strip’s settings, changed as it records', async () => {
    const user = userEvent.setup()
    const {
      audio,
      midi: keyboard,
      settingsStore,
    } = await renderApp('/edit/my-1', {
      storage: withSong({ melody: 'B4/4 | D5/4 | G4/4 | G4/4' }),
    })
    await startTake(user, keyboard)
    const settings = await recordingSettings(user)
    // Settings › Recording's own switches, each saying what it does in its ⓘ, no line under it.
    expect(
      within(settings)
        .getAllByRole('switch')
        .map((each) => each.getAttribute('aria-checked')),
    ).toEqual(['true', 'false'])
    act(() => audio.setNow(0.5))
    await user.click(within(settings).getByRole('switch', { name: 'Metronome' }))
    expect(settingsStore.getState().recorder.click).toBe(false)
    // The rest of the count-in still counts; nothing clicks after it.
    expect(audio.played.at(-1)?.sounds.map((sound) => sound.at)).toEqual([BEAT, 2 * BEAT, 3 * BEAT])
    await user.click(within(settings).getByRole('switch', { name: 'Melody' }))
    expect(settingsStore.getState().recorder.tune).toBe(true)
    // The tune comes in under the take from its downbeat.
    expect(audio.played.at(-1)?.at).toBeCloseTo(DOWNBEAT)
  })

  it('offers no tune in the strip’s settings for a song without one', async () => {
    const user = userEvent.setup()
    const { midi: keyboard } = await renderApp('/edit/my-1', { storage: withSong() })
    await startTake(user, keyboard)
    const settings = await recordingSettings(user)
    expect(within(settings).getByRole('switch', { name: 'Metronome' })).toBeInTheDocument()
    expect(within(settings).queryByRole('switch', { name: 'Melody' })).not.toBeInTheDocument()
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
    await startTake(user, keyboard)
    await user.click(await screen.findByRole('button', { name: 'Stop' }))
    expect(await screen.findByRole('group', { name: 'Note value' })).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).toBeNull()

    await startTake(user, keyboard)
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
    await startTake(user, keyboard)
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
    await startTake(user, keyboard)
    act(() => audio.setNow(DOWNBEAT + 0.2))
    act(() => keyboard.press(midi(64)))
    await user.click(screen.getByRole('button', { name: 'Close' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/songs/my-1'))
    expect(takesStore.getState().takes.map((take) => take.pieceId)).toEqual(['my-1'])
  })

  it('holds the takes’ sheet in the URL, gives way while a take records, and opens it from Takes beside Record', async () => {
    const user = userEvent.setup()
    const {
      audio,
      midi: keyboard,
      router,
    } = await renderApp('/edit/my-1', {
      storage: withSong(),
    })
    // No takes yet: Record alone.
    await screen.findByRole('button', { name: 'Record' })
    expect(screen.queryByRole('button', { name: /^Takes/ })).toBeNull()
    await user.click(screen.getByRole('button', { name: 'Play' }))
    expect(screen.getByRole('button', { name: 'Stop' })).toBeInTheDocument()
    connect(keyboard)
    await user.click(screen.getByRole('button', { name: 'Record' }))

    // The song stopped as the take began, its strip in the dock's place, and the tools that change
    // it wait for Stop.
    expect(screen.queryByRole('button', { name: 'Play' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Undo' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'View' })).toBeDisabled()
    expect(router.state.location.search).toEqual({})
    playArpeggio(audio, keyboard)
    await user.click(screen.getByRole('button', { name: 'Stop' }))

    const takes = await screen.findByRole('dialog', { name: 'Takes' })
    expect(router.state.location.search).toEqual({ takes: true })
    const [row] = within(takes).getAllByRole('listitem')
    if (!row) throw new Error('the take is listed')
    await takeAction(user, row, 'Write into the score')
    const form = await screen.findByRole('dialog', { name: 'Write into the score' })
    await user.click(within(form).getByRole('button', { name: /^Write from bar/ }))
    await waitFor(() => expect(form).not.toBeInTheDocument())
    expect(router.state.location.search).toEqual({})

    // The song has a take now: its takes open from beside Record.
    await user.click(screen.getByRole('button', { name: 'Takes: 1' }))
    expect(await screen.findByRole('dialog', { name: 'Takes' })).toBeInTheDocument()
    expect(router.state.location.search).toEqual({ takes: true })
  })

  it('records at once when the song was made to record, a MIDI keyboard connected', async () => {
    const user = userEvent.setup()
    const { router, midi: keyboard } = await renderApp('/songs')
    connect(keyboard)
    await user.click(await screen.findByRole('button', { name: 'New song' }))
    await user.type(await screen.findByRole('textbox', { name: 'Title' }), 'Evening')
    await user.click(screen.getByRole('button', { name: 'Record' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/edit/my-1'))
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Count-in'))
    // Record is pressed once: the URL says nothing of it any more.
    expect(router.state.location.search).toEqual({})
  })

  it('opens Record’s popover when the song was made to record with no MIDI keyboard', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/songs')
    await user.click(await screen.findByRole('button', { name: 'New song' }))
    await user.type(await screen.findByRole('textbox', { name: 'Title' }), 'Evening')
    await user.click(screen.getByRole('button', { name: 'Record' }))
    const record = await screen.findByRole('dialog', { name: 'Record' })
    expect(record).toHaveTextContent('Recording needs a MIDI keyboard.')
    expect(router.state.location.pathname).toBe('/edit/my-1')
    expect(router.state.location.search).toEqual({})
  })
})

describe('the words under the tune (ADR 0093)', () => {
  const sung = () =>
    withSong({
      melody: 'G4/4 | A4/4 | B4/4 | C5/4',
      hands: SILENT_HANDS,
    })

  it('types a verse syllable by syllable under the notes from Cmd+L, the caret line naming the verse (ADR 0096)', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', { storage: sung() })
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/^Melody · Bar 1/))
    await user.keyboard('{Meta>}l{/Meta}')
    const field = await screen.findByRole('textbox', { name: 'Syllable' })
    await waitFor(() => expect(field).toHaveFocus())
    expect(screen.getByRole('status')).toHaveTextContent(/^Lyrics · Verse 1 · Bar 1/)
    // Its place is the sheet's: under the note on the tune's staff.
    const place = document.querySelector('[data-slot="field-anchor"]')
    expect(place?.closest('[data-slot="sheet-line"]')).not.toBeNull()
    await user.keyboard('A-')
    // The dash saves the syllable and moves on to the next note of the tune.
    await waitFor(() => expect(piecesStore.getState().songs[0]?.lyrics).toEqual(['A- ~ ~ ~']))
    expect(screen.getByRole('status')).toHaveTextContent(/Bar 2/)
    const next = screen.getByRole('textbox', { name: 'Syllable' })
    await user.type(next, 'men ')
    await waitFor(() => expect(piecesStore.getState().songs[0]?.lyrics).toEqual(['A- men ~ ~']))
    expect(screen.getByRole('status')).toHaveTextContent(/Bar 3/)
    // ↓ starts the second verse; ↑ comes back to the first, whose syllable the field shows.
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('status')).toHaveTextContent(/^Lyrics · Verse 2/)
    await user.type(screen.getByRole('textbox', { name: 'Syllable' }), 'la{ArrowUp}')
    await waitFor(() =>
      expect(piecesStore.getState().songs[0]?.lyrics).toEqual(['A- men ~ ~', '~ ~ la ~']),
    )
    expect(screen.getByRole('status')).toHaveTextContent(/^Lyrics · Verse 1/)
    await user.keyboard('{ArrowLeft}')
    expect(screen.getByRole('textbox', { name: 'Syllable' })).toHaveValue('men')
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('textbox', { name: 'Syllable' })).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent(/^Melody · Bar 2/)
    // The verse is engraved under the tune.
    await waitFor(() => expect(document.querySelectorAll('.syl').length).toBeGreaterThan(0))
  })

  it('opens the Lyrics field from the palette’s one key, under the tune’s next note from a rest (ADR 0096)', async () => {
    const user = userEvent.setup()
    await renderApp('/edit/my-1', {
      storage: withSong({ melody: 'r/4 | A4/4 | B4/4 | C5/4', hands: SILENT_HANDS }),
    })
    const text = await openCategory(user, 'Text & pedal')
    await user.click(within(text).getByRole('button', { name: 'Lyrics' }))
    expect(await screen.findByRole('textbox', { name: 'Syllable' })).toHaveValue('')
    expect(screen.getByRole('status')).toHaveTextContent(/^Lyrics · Verse 1 · Bar 2, beat 1 · A4/)
  })

  it('is greyed off the staff the lyrics are on, saying where they are', async () => {
    const user = userEvent.setup()
    await renderApp('/edit/my-1', { storage: sung() })
    await openCategory(user, 'Text & pedal')
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/^Melody · Bar 1/))
    await user.keyboard('{Alt>}{ArrowDown}{ArrowDown}{/Alt}')
    expect(screen.getByRole('status')).toHaveTextContent(/^Lower staff · Bar 1/)
    const text = await screen.findByRole('region', { name: 'Text & pedal' })
    const lyrics = within(text).getByRole('button', { name: 'Lyrics' })
    expect(lyrics).toBeDisabled()
    expect(lyrics).toHaveAttribute('title', 'Lyrics go on the melody staff: tap a note there.')
    await user.click(within(text).getByRole('button', { name: 'About Chord symbols and lyrics' }))
    expect(
      await screen.findByRole('dialog', { name: 'Chord symbols and lyrics' }),
    ).toHaveTextContent('Lyrics go on the melody staff: tap a note there.')
  })

  it('says where lyrics go in a song with none yet: the upper staff, where it has no tune', async () => {
    const user = userEvent.setup()
    await renderApp('/edit/my-1', { storage: withSong({ hands: SILENT_HANDS }) })
    await toChordRow(user)
    expect(screen.getByRole('status')).toHaveTextContent(/^Chord symbols · Bar 1/)
    const text = await openCategory(user, 'Text & pedal')
    const lyrics = within(text).getByRole('button', { name: 'Lyrics' })
    expect(lyrics).toBeDisabled()
    expect(lyrics).toHaveAccessibleDescription('Lyrics go on the upper staff: tap a note there.')
  })

  it('keeps lyrics written on the upper staff there as a melody staff is added, saved with the song', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', {
      storage: withSong({ hands: { rh: 'G4/4 | A4/4 | B4/4 | C5/4', lh: EMPTY_TUNE } }),
    })
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/^Upper staff/))
    const text = await openCategory(user, 'Text & pedal')
    await user.click(within(text).getByRole('button', { name: 'Lyrics' }))
    await screen.findByRole('textbox', { name: 'Syllable' })
    await user.keyboard('A-')
    await waitFor(() => expect(piecesStore.getState().songs[0]?.lyrics).toEqual(['A- ~ ~ ~']))
    await user.type(screen.getByRole('textbox', { name: 'Syllable' }), 'men{Escape}')
    await waitFor(() => expect(piecesStore.getState().songs[0]?.lyrics).toEqual(['A- men ~ ~']))
    await user.click(await screen.findByRole('button', { name: 'Piano staves' }))
    await user.click(await screen.findByRole('button', { name: 'Add a melody staff' }))
    await waitFor(() => expect(songOf(piecesStore.getState())).toHaveProperty('melody'))
    expect(songOf(piecesStore.getState())).toMatchObject({
      lyrics: ['A- men ~ ~'],
      lyricsOn: 'rh',
    })
    // On the melody staff the Lyrics are greyed, saying where they are.
    expect(screen.getByRole('status')).toHaveTextContent(/^Melody/)
    const section = await screen.findByRole('region', { name: 'Text & pedal' })
    const lyrics = within(section).getByRole('button', { name: 'Lyrics' })
    expect(lyrics).toBeDisabled()
    expect(lyrics).toHaveAccessibleDescription('Lyrics go on the upper staff: tap a note there.')
  })
})
