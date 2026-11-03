import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { PIECES_STORAGE_KEY, PIECES_VERSION } from '@/entities/piece'
import { createMemoryStorage } from '@/shared/lib'

const SONG = {
  id: 'my-1',
  title: 'Morning',
  key: 'G',
  meter: '4/4',
  tempo: 90,
  pattern: 'r1',
  sections: [{ kind: 'verse', lines: ['G G G G'] }],
  hands: { rh: 'r/4 | r/4 | r/4 | r/4', lh: 'r/4 | r/4 | r/4 | r/4' },
}

const withSong = () => {
  const storage = createMemoryStorage()
  storage.setItem(
    PIECES_STORAGE_KEY,
    JSON.stringify({ state: { songs: [SONG], nextSong: 2 }, version: PIECES_VERSION }),
  )
  return storage
}

describe('the score’s Settings (round 28)', () => {
  it('opens from the editor’s bar and saves what prints under the title with the music', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', { storage: withSong() })
    await user.click(await screen.findByRole('button', { name: 'Score settings' }))
    const composer = await screen.findByRole('textbox', { name: 'Composer' })
    await user.type(composer, 'Clara Schumann{Enter}')
    await waitFor(() =>
      expect(piecesStore.getState().songs[0]?.header).toEqual({ composer: 'Clara Schumann' }),
    )
    // Back on the score, it prints under the title, and Undo takes it away.
    await user.click(screen.getByRole('button', { name: 'Back' }))
    expect(await screen.findByText('Clara Schumann')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Undo' }))
    await waitFor(() => expect(piecesStore.getState().songs[0]?.header).toBeUndefined())
  })

  it('opens from the Player’s Settings', async () => {
    const user = userEvent.setup()
    await renderApp('/play/my-1', { storage: withSong() })
    await user.click(await screen.findByRole('button', { name: 'Player settings' }))
    await user.click(await screen.findByRole('button', { name: 'Score settings' }))
    expect(await screen.findByRole('heading', { name: 'Score settings' })).toBeInTheDocument()
  })

  it('adds an instrument’s staff and makes the song longer, each saved', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1/settings', { storage: withSong() })
    await user.click(await screen.findByRole('button', { name: 'One more Tenor' }))
    await waitFor(() =>
      expect(piecesStore.getState().songs[0]?.staves).toEqual([
        expect.objectContaining({ name: { en: 'Tenor', ru: 'Тенор' }, clef: 'treble-8vb' }),
      ]),
    )
    expect(screen.getByRole('status', { name: 'Tenor: 1' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'One bar more' }))
    await waitFor(() =>
      expect(piecesStore.getState().songs[0]?.sections[0]?.lines[0]?.split(' ')).toHaveLength(5),
    )
  })

  it('lays the score out and hears notes as they are edited, by the learner’s choice', async () => {
    const user = userEvent.setup()
    const { piecesStore, settingsStore } = await renderApp('/edit/my-1/settings', {
      storage: withSong(),
    })
    await user.click(await screen.findByRole('combobox', { name: 'Bars per line' }))
    await user.click(await screen.findByRole('option', { name: '2' }))
    await waitFor(() => expect(piecesStore.getState().songs[0]?.layout).toEqual({ barsPerLine: 2 }))
    const editing = screen.getByRole('region', { name: 'Editing' })
    await user.click(within(editing).getByRole('switch', { name: /Hear notes as you edit/ }))
    expect(settingsStore.getState().editing.hearNotes).toBe(false)
  })
})
