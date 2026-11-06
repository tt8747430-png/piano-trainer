import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { LIBRARY_STORAGE_KEY, LIBRARY_VERSION, type LibraryState } from '@/entities/library'
import { PIECES_STORAGE_KEY, PIECES_VERSION } from '@/entities/piece'
import { createMemoryStorage } from '@/shared/lib'

const song = (id: string, title: string) => ({
  id,
  title,
  key: 'G',
  meter: '4/4',
  tempo: 90,
  pattern: 'r1',
  sections: [{ kind: 'verse', lines: ['G C D G'] }],
})

/** A device whose Trash holds two of the learner's songs, one deleted from Home. */
function trashed() {
  const storage = createMemoryStorage()
  storage.setItem(
    PIECES_STORAGE_KEY,
    JSON.stringify({
      state: { songs: [song('my-1', 'Morning'), song('my-2', 'Evening')], nextSong: 3 },
      version: PIECES_VERSION,
    }),
  )
  storage.setItem(
    LIBRARY_STORAGE_KEY,
    JSON.stringify({
      state: {
        trash: [
          { id: 'my-1', from: { folder: null, index: 0 } },
          { id: 'my-2', from: { folder: null, index: 1 } },
        ],
      },
      version: LIBRARY_VERSION,
    }),
  )
  return storage
}

const savedLibrary = (storage: Storage): LibraryState =>
  (JSON.parse(storage.getItem(LIBRARY_STORAGE_KEY) ?? '{}') as { state: LibraryState }).state

const savedSongs = (storage: Storage): string[] =>
  (
    JSON.parse(storage.getItem(PIECES_STORAGE_KEY) ?? '{}') as {
      state: { songs: { id: string }[] }
    }
  ).state.songs.map((each) => each.id)

describe('The Trash (R34)', () => {
  it('lists the songs deleted, newest first, and restores one where it stood', async () => {
    const storage = trashed()
    await renderApp('/songs/trash', { storage })
    expect(await screen.findByRole('heading', { level: 1, name: 'Trash' })).toBeInTheDocument()
    const rows = within(screen.getByRole('list', { name: 'Trash' })).getAllByRole('listitem')
    expect(rows.map((row) => row.textContent)).toEqual([
      expect.stringMatching(/^Morning/),
      expect.stringMatching(/^Evening/),
    ])
    await userEvent.click(screen.getByRole('button', { name: 'Restore Morning' }))
    await waitFor(() =>
      expect(savedLibrary(storage).trash.map((each) => each.id)).toEqual(['my-2']),
    )
    expect(savedLibrary(storage).home).toContain('my-1')
  })

  it('deletes one for good, asked first, and empties the rest, asked first', async () => {
    const storage = trashed()
    await renderApp('/songs/trash', { storage })
    const rows = within(await screen.findByRole('list', { name: 'Trash' })).getAllByRole('listitem')
    await userEvent.click(within(rows[0] as HTMLElement).getByRole('button', { name: 'More' }))
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Delete permanently' }))
    const ask = await screen.findByRole('alertdialog', { name: 'Delete “Morning” permanently?' })
    await userEvent.click(within(ask).getByRole('button', { name: 'Delete permanently' }))
    await waitFor(() => expect(savedSongs(storage)).toEqual(['my-2']))
    await userEvent.click(screen.getByRole('button', { name: 'Empty Trash' }))
    const emptying = await screen.findByRole('alertdialog', { name: 'Empty the Trash?' })
    expect(emptying).toHaveTextContent(
      'Songs (1) and their recordings will be permanently deleted.',
    )
    await userEvent.click(within(emptying).getByRole('button', { name: 'Empty Trash' }))
    await waitFor(() => expect(savedSongs(storage)).toEqual([]))
    expect(await screen.findByText('The Trash is empty')).toBeInTheDocument()
  })
})
