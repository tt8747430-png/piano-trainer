// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { createMemoryStorage } from '@/shared/lib'
import { createLibraryStore, INITIAL_LIBRARY, LIBRARY_STORAGE_KEY, LIBRARY_VERSION } from './store'
import { FOLDER_NAME_MAX, MOST_FOLDERS, MOST_PIECES } from './types'

const restored = (state: unknown, version = LIBRARY_VERSION) => {
  const storage = createMemoryStorage()
  storage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify({ state, version }))
  return createLibraryStore({ storage, otherTabs: new EventTarget() }).getState()
}

const SUNDAY = {
  id: 'folder-1',
  parent: null,
  name: 'Sunday',
  picture: 'church',
  paint: 'grass',
  songs: ['bz5', 'silent'],
} as const

describe('createLibraryStore', () => {
  it('starts holding nothing the learner changed, saved as pt-library version 3', () => {
    const storage = createMemoryStorage()
    const store = createLibraryStore({ storage, otherTabs: new EventTarget() })
    expect(store.getState()).toEqual(INITIAL_LIBRARY)
    store.setState({ favourites: ['bz5'] })
    expect(JSON.parse(storage.getItem('pt-library') ?? 'null')).toEqual({
      state: { ...INITIAL_LIBRARY, favourites: ['bz5'] },
      version: 3,
    })
  })

  it('restores what was saved', () => {
    const saved = {
      folders: [
        SUNDAY,
        { id: 'hymns', parent: 'folder-1', picture: 'star', paint: 'sky', songs: ['h1'] },
      ],
      home: ['my-1'],
      favourites: ['silent'],
      archive: [
        { kind: 'song', id: 'my-2', from: { folder: 'folder-1', index: 1 } },
        {
          kind: 'folder',
          folder: {
            id: 'gorshkov',
            parent: 'hymns',
            name: 'Mine',
            picture: 'mic',
            paint: 'sand',
            songs: [],
          },
          subfolders: [
            {
              id: 'folder-3',
              parent: 'gorshkov',
              name: 'Inner',
              picture: 'star',
              paint: 'sky',
              songs: ['my-4'],
            },
          ],
          index: 2,
        },
      ],
      sort: 'recent',
      nextFolder: 4,
    }
    expect(restored(saved)).toEqual(saved)
  })

  it('reads a save of another version (one level of folders) as the initial state', () => {
    const setlists = [{ id: 'set-1', name: 'Sunday', pieces: ['bz5'] }]
    expect(restored({ favourites: ['bz5'], setlists, nextSetlist: 2 }, 1)).toEqual(INITIAL_LIBRARY)
    expect(restored({ folders: [SUNDAY], favourites: ['bz5'] }, 2)).toEqual(INITIAL_LIBRARY)
  })

  it('stands at Home a folder whose place does not read or is itself', () => {
    const state = restored({
      folders: [
        { ...SUNDAY, parent: 7 },
        { id: 'folder-2', name: 'Self', parent: 'folder-2', songs: [] },
        { id: 'hymns', parent: 'folder-1', songs: [] },
      ],
    })
    expect(state.folders.map((folder) => [folder.id, folder.parent])).toEqual([
      ['folder-1', null],
      ['folder-2', null],
      ['hymns', 'folder-1'],
    ])
  })

  it('keeps each song once across the folders, Home and the archive', () => {
    const state = restored({
      folders: [{ ...SUNDAY, songs: ['bz5', '', 7, 'bz5', 'silent'] }],
      home: ['silent', 'my-1'],
      archive: [
        { kind: 'song', id: 'my-1', from: { folder: null, index: 0 } },
        { kind: 'song', id: 'my-2', from: 'nowhere' },
      ],
    })
    expect(state.folders[0]?.songs).toEqual(['bz5', 'silent'])
    expect(state.home).toEqual(['my-1'])
    expect(state.archive).toEqual([{ kind: 'song', id: 'my-2', from: { folder: null, index: 0 } }])
  })

  it('keeps each folder once, an own one only with a name, a look that does not read as its default', () => {
    const state = restored({
      folders: [
        { ...SUNDAY, name: '  Sunday  ', picture: 'kazoo', paint: 'red' },
        { id: 'folder-2', name: '   ', picture: 'music', paint: 'sky', songs: [] },
        { id: 'folder-3', name: 'x'.repeat(FOLDER_NAME_MAX + 1), songs: [] },
        { id: 'folder-1', name: 'Twice', songs: [] },
        { id: 'studies', songs: [] },
        { id: 'hymns', songs: ['h2'] },
        'Sunday',
      ],
      archive: [{ kind: 'folder', folder: { id: 'hymns', songs: [] }, index: 0 }],
    })
    expect(state.folders).toEqual([
      { ...SUNDAY, picture: 'music', paint: 'sand' },
      { id: 'hymns', parent: null, picture: 'church', paint: 'grass', songs: ['h2'] },
    ])
    expect(state.archive).toEqual([])
  })

  it('keeps as many as it holds', () => {
    const many = Array.from({ length: MOST_PIECES + 5 }, (_, i) => `piece-${i}`)
    const folders = Array.from({ length: MOST_FOLDERS + 5 }, (_, i) => ({
      id: `folder-${i + 1}`,
      name: `Folder ${i + 1}`,
      songs: [],
    }))
    const state = restored({ favourites: many, home: many, folders })
    expect(state.favourites).toEqual(many.slice(0, MOST_PIECES))
    expect(state.home).toHaveLength(MOST_PIECES)
    expect(state.folders).toHaveLength(MOST_FOLDERS)
  })

  it('numbers the next folder past every one kept, never below 1, and reads the sort', () => {
    expect(restored({ folders: [{ ...SUNDAY, id: 'folder-6' }], nextFolder: 2 }).nextFolder).toBe(7)
    expect(restored({ nextFolder: 12 }).nextFolder).toBe(12)
    expect(restored({ nextFolder: -3, sort: 'size' })).toEqual(INITIAL_LIBRARY)
    expect(restored('nothing')).toEqual(INITIAL_LIBRARY)
  })

  it('follows another tab’s save', () => {
    const storage = createMemoryStorage()
    const otherTabs = new EventTarget()
    const store = createLibraryStore({ storage, otherTabs })
    storage.setItem(
      LIBRARY_STORAGE_KEY,
      JSON.stringify({ state: { ...INITIAL_LIBRARY, favourites: ['silent'] }, version: 3 }),
    )
    otherTabs.dispatchEvent(
      new StorageEvent('storage', {
        key: LIBRARY_STORAGE_KEY,
        newValue: storage.getItem(LIBRARY_STORAGE_KEY),
      }),
    )
    expect(store.getState().favourites).toEqual(['silent'])
  })
})
