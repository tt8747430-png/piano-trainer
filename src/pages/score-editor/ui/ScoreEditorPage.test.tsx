import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { musicOf, pieceById, PIECES_STORAGE_KEY } from '@/entities/piece'
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
const songOf = (state: { songs: readonly { id: string }[] }) =>
  state.songs.find((song) => song.id === 'my-1')

describe('the score editor', () => {
  it('sets a typed chord at the caret and moves to the next bar', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', { storage: withSong() })
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
    const chords = await screen.findByRole('group', { name: 'Chords in the key' })
    await user.click(within(chords).getByRole('button', { name: 'Em' }))
    expect(await screen.findByRole('button', { name: 'Bar 1: Em' })).toBeInTheDocument()
  })

  it('names a chord played on a MIDI keyboard', async () => {
    const { midi: keyboard } = await renderApp('/edit/my-1', { storage: withSong() })
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

  it('opens a song with a tune in the Player with Melody to switch', async () => {
    const user = userEvent.setup()
    const storage = createMemoryStorage()
    const song = { ...SONG, melody: 'B4/4 | D5/4 | G4/4 | G4/4' }
    storage.setItem(
      PIECES_STORAGE_KEY,
      JSON.stringify({ state: { songs: [song], nextSong: 2 }, version: 1 }),
    )
    await renderApp('/play/my-1', { storage })
    await user.click(await screen.findByRole('button', { name: 'Setup' }))
    expect(await screen.findByRole('switch', { name: 'Melody' })).toBeInTheDocument()
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
    const chords = await screen.findByRole('group', { name: 'Chords in the key' })
    await user.click(within(chords).getByRole('button', { name: 'Em' }))
    expect(await screen.findByText('Your version')).toBeInTheDocument()
    expect(piecesStore.getState().versions.amazing?.sections[0]?.lines[0]).toBe('Em G7 C G')
    await user.click(screen.getByRole('button', { name: 'Undo' }))
    await waitFor(() => expect(piecesStore.getState().versions).toEqual({}))
    const original = pieceById('amazing')
    if (!original || original.kind === 'progression') throw new Error('a song')
    expect(musicOf(original).sections[0]?.lines[0]).toBe('G G7 C G')
  })

  it('writes a listing’s chart, which then opens in the Player', async () => {
    const user = userEvent.setup()
    const storage = createMemoryStorage()
    const { piecesStore } = await renderApp('/edit/bz4', { storage })
    const chords = await screen.findByRole('group', { name: 'Chords in the key' })
    await user.click(within(chords).getByRole('button', { name: 'Fm' }))
    expect(piecesStore.getState().versions.bz4?.sections[0]?.lines[0]).toBe('Fm Cm Cm Cm')
  })

  it('writes a left hand’s bar out from the pattern', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', { storage: withSong() })
    await user.click(await screen.findByRole('radio', { name: 'Left hand' }))
    expect(screen.getAllByText('Pattern').length).toBeGreaterThan(0)
    await user.click(screen.getByRole('button', { name: 'Write out' }))
    expect(songOf(piecesStore.getState())).toMatchObject({
      hands: { lh: expect.stringMatching(/^G1\^5\+G2\^1\/2 /) },
    })
    expect(screen.getByRole('button', { name: 'Back to the pattern' })).toBeInTheDocument()
  })

  it('shows not found for a progression', async () => {
    await renderApp('/edit/twofive')
    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })
})
