import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import {
  arrangeLibrary,
  LIBRARY_STORAGE_KEY,
  LIBRARY_VERSION,
  libraryCatalog,
  placeIn,
  type LibraryState,
} from '@/entities/library'
import { PIECES_STORAGE_KEY, PIECES_VERSION } from '@/entities/piece'
import { createMemoryStorage } from '@/shared/lib'

const MORNING = {
  id: 'my-1',
  title: 'Morning',
  key: 'G',
  meter: '4/4',
  tempo: 90,
  pattern: 'r1',
  sections: [{ kind: 'verse', lines: ['G C D G'] }],
}

/** A device whose archive holds a song of the app's, the learner's own and a folder. */
function archived() {
  const storage = createMemoryStorage()
  storage.setItem(
    PIECES_STORAGE_KEY,
    JSON.stringify({ state: { songs: [MORNING], nextSong: 2 }, version: PIECES_VERSION }),
  )
  storage.setItem(
    LIBRARY_STORAGE_KEY,
    JSON.stringify({
      state: {
        archive: [
          { kind: 'song', id: 'silent', from: { folder: 'hymns', index: 2 } },
          { kind: 'song', id: 'my-1', from: { folder: null, index: 0 } },
          {
            kind: 'folder',
            folder: { id: 'gorshkov', picture: 'mic', paint: 'sand', songs: [] },
            index: 5,
          },
        ],
      },
      version: LIBRARY_VERSION,
    }),
  )
  return storage
}

const placeOf = (state: LibraryState, id: string) =>
  placeIn(arrangeLibrary(state, libraryCatalog({ ownSongs: [{ id: 'my-1' }] })), id)

describe('The archive (ADR 0106)', () => {
  it('lists what was archived, newest first: songs as Songs shows them, a folder with its songs counted', async () => {
    await renderApp('/songs/archive', { storage: archived() })
    expect(await screen.findByRole('heading', { level: 1, name: 'Archive' })).toBeInTheDocument()
    const rows = within(screen.getByRole('list', { name: 'Archive' })).getAllByRole('listitem')
    expect(rows.map((row) => row.textContent)).toEqual([
      expect.stringMatching(/^Silent Night/),
      expect.stringMatching(/^Morning/),
      expect.stringMatching(/^Gorshkov’s songs 4 songs/),
    ])
    // An archived song still opens.
    expect(
      within(rows[0] as HTMLElement).getByRole('link', { name: /Silent Night/ }),
    ).toHaveAttribute('href', '/songs/silent')
  })

  it('restores a song where it stood, and a folder at Home, last, with its songs', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs/archive', { storage: archived() })
    await user.click(await screen.findByRole('button', { name: 'Restore Silent Night' }))
    expect(placeOf(libraryStore.getState(), 'silent')).toEqual({ folder: 'hymns', index: 2 })
    expect(await screen.findByText('“Silent Night” is back in the library')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Restore Gorshkov’s songs' }))
    const { folders } = arrangeLibrary(
      libraryStore.getState(),
      libraryCatalog({ ownSongs: [{ id: 'my-1' }] }),
    )
    expect(folders.at(-1)).toMatchObject({ id: 'gorshkov', songs: expect.arrayContaining([]) })
    expect(folders.at(-1)?.songs).toHaveLength(4)
  })

  it('restores everything by Restore all, then says it is empty', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs/archive', { storage: archived() })
    await user.click(await screen.findByRole('button', { name: 'Restore all' }))
    expect(libraryStore.getState().archive).toEqual([])
    expect(await screen.findByText('Nothing archived')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Restore all' })).toBeNull()
  })

  it('deletes the learner’s own song for good, asked first; the app’s has no Delete', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/songs/archive', { storage: archived() })
    const rows = within(await screen.findByRole('list', { name: 'Archive' })).getAllByRole(
      'listitem',
    )
    expect(within(rows[0] as HTMLElement).queryByRole('button', { name: 'More' })).toBeNull()
    await user.click(within(rows[1] as HTMLElement).getByRole('button', { name: 'More' }))
    await user.click(await screen.findByRole('button', { name: 'Delete' }))
    const ask = await screen.findByRole('alertdialog', { name: 'Delete “Morning”?' })
    await user.click(within(ask).getByRole('button', { name: 'Delete' }))
    await waitFor(() => expect(piecesStore.getState().songs).toEqual([]))
  })

  it('says what it is for while it is empty, and goes Back to Songs', async () => {
    await renderApp('/songs/archive')
    expect(await screen.findByText('Nothing archived')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument()
  })

  it('reads in Russian', async () => {
    await renderApp('/songs/archive', { locale: 'ru', storage: archived() })
    expect(await screen.findByRole('heading', { level: 1, name: 'Архив' })).toBeInTheDocument()
    expect(untranslated(document.body)).toEqual([])
  })
})
