// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { createMemoryStorage } from '@/shared/lib'
import { createLibraryStore, LIBRARY_STORAGE_KEY, LIBRARY_VERSION } from './store'
import { MOST_PIECES, MOST_SETLISTS, SETLIST_NAME_MAX } from './types'

const restored = (state: unknown, version = LIBRARY_VERSION) => {
  const storage = createMemoryStorage()
  storage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify({ state, version }))
  return createLibraryStore({ storage, otherTabs: new EventTarget() }).getState()
}

const SUNDAY = { id: 'set-1', name: 'Sunday', pieces: ['bz5', 'silent'] }
const EMPTY = { favourites: [], setlists: [], nextSetlist: 1 }

describe('createLibraryStore', () => {
  it('starts with no favourites and no setlists, saved as pt-library version 1', () => {
    const storage = createMemoryStorage()
    const store = createLibraryStore({ storage, otherTabs: new EventTarget() })
    expect(store.getState()).toEqual(EMPTY)
    store.setState({ favourites: ['bz5'] })
    expect(JSON.parse(storage.getItem('pt-library') ?? 'null')).toEqual({
      state: { ...EMPTY, favourites: ['bz5'] },
      version: 1,
    })
  })

  it('restores what was saved', () => {
    const saved = { favourites: ['silent', 'bz5'], setlists: [SUNDAY], nextSetlist: 2 }
    expect(restored(saved)).toEqual(saved)
  })

  it('starts afresh over a save of another version', () => {
    expect(restored({ favourites: ['bz5'] }, 2)).toEqual(EMPTY)
  })

  it('keeps each song once, in order, and no id that names none', () => {
    const state = restored({
      favourites: ['bz5', '', 'silent', 'bz5', 7, null, 'x'.repeat(101)],
      setlists: [{ ...SUNDAY, pieces: ['silent', 'silent', 3, 'bz5'] }],
    })
    expect(state.favourites).toEqual(['bz5', 'silent'])
    expect(state.setlists[0]?.pieces).toEqual(['silent', 'bz5'])
  })

  it('keeps a setlist only with its id and a name of 1 to 40 characters, trimmed', () => {
    const setlists = [
      { ...SUNDAY, name: '  Sunday  ' },
      { id: 'set-2', name: '   ', pieces: [] },
      { id: 'set-3', name: 'x'.repeat(SETLIST_NAME_MAX + 1), pieces: [] },
      { id: 'list-4', name: 'Odd', pieces: [] },
      { id: 'set-1', name: 'Twice', pieces: [] },
      { id: 'set-5', name: 'No songs' },
      'Sunday',
    ]
    expect(restored({ setlists, nextSetlist: 9 }).setlists).toEqual([
      SUNDAY,
      { id: 'set-5', name: 'No songs', pieces: [] },
    ])
  })

  it('keeps as many as it holds: the first setlists, and the first songs of a list', () => {
    const many = Array.from({ length: MOST_PIECES + 5 }, (_, i) => `piece-${i}`)
    const lists = Array.from({ length: MOST_SETLISTS + 5 }, (_, i) => ({
      id: `set-${i + 1}`,
      name: `List ${i + 1}`,
      pieces: [],
    }))
    const state = restored({ favourites: many, setlists: lists })
    expect(state.favourites).toEqual(many.slice(0, MOST_PIECES))
    expect(state.setlists).toHaveLength(MOST_SETLISTS)
    expect(state.setlists.at(-1)?.id).toBe(`set-${MOST_SETLISTS}`)
  })

  it('numbers the next setlist past every one kept, never below 1', () => {
    expect(restored({ setlists: [{ ...SUNDAY, id: 'set-6' }], nextSetlist: 2 }).nextSetlist).toBe(7)
    expect(restored({ setlists: [], nextSetlist: 12 }).nextSetlist).toBe(12)
    expect(restored({ nextSetlist: -3 }).nextSetlist).toBe(1)
    expect(restored('nothing')).toEqual(EMPTY)
  })

  it('follows another tab’s save', () => {
    const storage = createMemoryStorage()
    const otherTabs = new EventTarget()
    const store = createLibraryStore({ storage, otherTabs })
    storage.setItem(
      LIBRARY_STORAGE_KEY,
      JSON.stringify({ state: { ...EMPTY, favourites: ['silent'] }, version: 1 }),
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
