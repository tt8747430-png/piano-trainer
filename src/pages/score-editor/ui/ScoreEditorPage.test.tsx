import { act, fireEvent, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { isDegreePiece, musicOf, pieceById, PIECES_STORAGE_KEY } from '@/entities/piece'
import { setKeyboard } from '@/features/set-preference'
import { createMemoryStorage } from '@/shared/lib'
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

const songOf = (state: { songs: readonly { id: string }[] }) =>
  state.songs.find((song) => song.id === 'my-1')

describe('the score editor', () => {
  it('opens on the tune, with no control for what it writes but the treble staff’s two voices', async () => {
    const user = userEvent.setup()
    await renderApp('/edit/my-1', { storage: withSong() })
    expect(await screen.findByRole('status')).toHaveTextContent(/^Melody · Bar 1/)
    expect(screen.queryByRole('radiogroup', { name: 'Write' })).not.toBeInTheDocument()
    const voice = screen.getByRole('radiogroup', { name: 'Voice' })
    await user.click(within(voice).getByRole('radio', { name: 'Right hand' }))
    expect(screen.getByRole('status')).toHaveTextContent(/^Right hand · Bar 1/)
  })

  it('hides the chord names, and a click over the staff then writes the tune', async () => {
    const user = userEvent.setup()
    await renderApp('/edit/my-1', { storage: withSong() })
    await toChordRow(user)
    expect(screen.getByRole('status')).toHaveTextContent(/^Chords · /)
    const names = screen.getByRole('button', { name: 'Chord names' })
    expect(names).toHaveAttribute('aria-pressed', 'true')
    await user.click(names)
    expect(names).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('status')).toHaveTextContent(/^Melody · /)
    await toChordRow(user)
    expect(screen.getByRole('status')).toHaveTextContent(/^Melody · /)
  })

  it('opens the song’s key, tempo and meter from the clef and signatures at a line’s head', async () => {
    const user = userEvent.setup()
    await renderApp('/edit/my-1', { storage: withSong() })
    const [head] = await screen.findAllByRole('button', { name: 'Key and time signature' })
    if (!head) throw new Error('no line head')
    await user.click(head)
    const settings = await screen.findByRole('dialog', { name: 'Song settings' })
    expect(within(settings).getByRole('group', { name: 'Key' })).toBeInTheDocument()
    expect(within(settings).queryByRole('combobox', { name: 'Pattern' })).not.toBeInTheDocument()
  })

  it('changes the time signature to another of its kind, each bar made the new one', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', { storage: withSong() })
    const [head] = await screen.findAllByRole('button', { name: 'Key and time signature' })
    if (!head) throw new Error('no line head')
    await user.click(head)
    const meters = within(await screen.findByRole('dialog', { name: 'Song settings' })).getByRole(
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

  it('sets a typed chord at the caret and moves to the next bar', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', { storage: withSong() })
    await toChordRow(user)
    const field = await screen.findByRole('textbox', { name: 'Chord' })
    await user.clear(field)
    await user.type(field, 'Am{Enter}')
    expect(await screen.findByRole('button', { name: 'Bar 1: Am' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Bar 2, beat 1 · G')
    expect(songOf(piecesStore.getState())).toMatchObject({ sections: [{ lines: ['Am G G G'] }] })
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
    await screen.findByRole('textbox', { name: 'Chord' })
    act(() => {
      for (const key of [53, 57, 60]) keyboard.press(midi(key))
    })
    expect(await screen.findByRole('button', { name: 'Bar 1: F' })).toBeInTheDocument()
  })

  it('writes the melody from the computer keyboard, a value at a time', async () => {
    const user = userEvent.setup({ delay: 120 })
    const { piecesStore, settingsStore } = await renderApp('/edit/my-1', { storage: withSong() })
    act(() => setKeyboard(settingsStore, { typing: true }))
    await user.click(await screen.findByRole('radio', { name: 'Melody' }))
    await user.keyboard('asd2f')
    await waitFor(() =>
      expect(songOf(piecesStore.getState())).toMatchObject({ melody: 'C4/1 D4/1 E4/1 F4/2' }),
    )
    expect(screen.getByRole('status')).toHaveTextContent('Bar 2, beat 2')
    // Off the layer's radio group, whose arrows choose a layer.
    await user.click(screen.getByRole('status'))
    await user.keyboard('{ArrowLeft}{ArrowLeft}')
    expect(screen.getByRole('status')).toHaveTextContent('Bar 1, beat 4 · F4 half')
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
    await user.click(screen.getByRole('button', { name: 'Write out' }))
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

  /** Plays a G major arpeggio over a held G2, a beat a note, from the downbeat. */
  function playArpeggio(
    audio: Awaited<ReturnType<typeof renderApp>>['audio'],
    keyboard: Awaited<ReturnType<typeof renderApp>>['midi'],
  ) {
    const at = (beats: number) => act(() => audio.setNow(DOWNBEAT + beats * BEAT))
    at(0.03)
    act(() => {
      keyboard.press(midi(67), { velocity: 90 })
      keyboard.press(midi(43), { velocity: 70 })
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
    expect(await screen.findByRole('status')).toHaveTextContent('Count-in')
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
    expect(takesStore.getState().takes).toHaveLength(1)

    const sheet = await screen.findByRole('dialog', { name: 'Takes' })
    const [take] = within(sheet).getAllByRole('listitem')
    if (!take) throw new Error('the take is listed')
    expect(take).toHaveTextContent('0:02 · 90 BPM')
    await user.click(within(take).getByRole('button', { name: 'Play' }))
    expect(
      audio.played.at(-1)?.sounds.flatMap((sound) => (sound.kind === 'note' ? [sound.midi] : [])),
    ).toEqual([43, 67, 71, 74])

    await user.click(within(take).getByRole('button', { name: 'Write into the score' }))
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
    await user.click(within(sheet).getByRole('switch', { name: 'Click' }))
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
    expect(await screen.findByRole('radiogroup', { name: 'Voice' })).toBeInTheDocument()
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
    await user.click(within(sheet).getByRole('button', { name: 'Download' }))
    expect(saved[0]).toMatch(/^Morning \d{4}-\d\d-\d\d \d\d\.\d\d\.mid$/)
    expect(files[0]?.type).toBe('audio/midi')

    await user.click(within(sheet).getByRole('button', { name: 'Delete' }))
    const keeping = await screen.findByRole('alertdialog', { name: 'Delete this take?' })
    await user.click(within(keeping).getByRole('button', { name: 'Keep it' }))
    expect(takesStore.getState().takes).toHaveLength(1)

    await user.click(within(sheet).getByRole('button', { name: 'Delete' }))
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
    expect(screen.getByRole('button', { name: 'Song settings' })).toBeDisabled()
    playArpeggio(audio, keyboard)
    await user.click(screen.getByRole('button', { name: 'Stop' }))

    const takes = await screen.findByRole('dialog', { name: 'Takes' })
    expect(router.state.location.search).toEqual({ record: true })
    await user.click(within(takes).getByRole('button', { name: 'Write into the score' }))
    const form = await screen.findByRole('dialog', { name: 'Write into the score' })
    await user.click(within(form).getByRole('button', { name: 'Write' }))
    await waitFor(() => expect(form).not.toBeInTheDocument())
    expect(router.state.location.search).toEqual({})

    await user.click(screen.getByRole('button', { name: 'Record' }))
    const again = await screen.findByRole('dialog', { name: 'Takes' })
    expect(within(again).getByRole('button', { name: 'Record' })).toBeEnabled()
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
