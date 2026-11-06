// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { createMemoryStorage } from '@/shared/lib'
import {
  selectFavouritesOf,
  selectIsFavouriteOf,
  selectOwnProgression,
  selectOwnProgressions,
} from './selectors'
import { createPracticeLibraryStore, PRACTICE_LIBRARY_STORAGE_KEY } from './store'
import { ownProgressionName } from './types'
import { EMPTY_ARRANGEMENT as EMPTY } from './arrangement'

const restored = (state: unknown, version = 2) => {
  const storage = createMemoryStorage()
  storage.setItem(PRACTICE_LIBRARY_STORAGE_KEY, JSON.stringify({ state, version }))
  return createPracticeLibraryStore({ storage, otherTabs: new EventTarget() }).getState()
}

const SAD = { id: 'mine-1', name: 'Sad loop', line: 'vi-IV-I-V', minor: false }

describe('createPracticeLibraryStore', () => {
  it('starts with no favourites of either kind and no progression of the learner’s own', () => {
    const storage = createMemoryStorage()
    const store = createPracticeLibraryStore({ storage, otherTabs: new EventTarget() })
    expect(store.getState()).toEqual({
      favourites: { exercises: [], progressions: [] },
      progressions: [],
      nextOwn: 1,
      arrangements: { exercises: EMPTY, accompaniment: EMPTY, progressions: EMPTY },
      nextFolder: 1,
    })
    store.setState({ favourites: { exercises: ['hanon'], progressions: [] } })
    expect(JSON.parse(storage.getItem('pt-practice-library') ?? 'null')).toEqual({
      state: {
        favourites: { exercises: ['hanon'], progressions: [] },
        progressions: [],
        nextOwn: 1,
        arrangements: { exercises: EMPTY, accompaniment: EMPTY, progressions: EMPTY },
        nextFolder: 1,
      },
      version: 2,
    })
  })

  it('restores what was saved', () => {
    const saved = {
      favourites: { exercises: ['hanon', 'modes'], progressions: ['axis', 'mine-1'] },
      progressions: [
        SAD,
        { id: 'mine-2', name: 'Dorian', line: 'i-IV', minor: true, mode: 'dorian' },
      ],
      nextOwn: 3,
      arrangements: {
        exercises: {
          ...EMPTY,
          order: ['jonny', 'technique'],
          placeNames: { technique: 'Warm-ups' },
          folders: [{ id: 'folder-1', name: 'Morning routine' }],
          placed: { modes: 'folder-1' },
          itemNames: { hanon: 'Hanon No. 1' },
          hiddenItems: ['five-finger'],
          sequence: { technique: ['hanon', 'five-finger'] },
        },
        accompaniment: { ...EMPTY, hiddenPlaces: ['styles'] },
        progressions: EMPTY,
      },
      nextFolder: 2,
    }
    expect(restored(saved)).toEqual(saved)
  })

  it('keeps of an arrangement only what reads, and never reuses a folder’s number (R32)', () => {
    const state = restored({
      arrangements: {
        exercises: {
          folders: [
            { id: 'folder-4', name: 'Keep' },
            { id: 'nope', name: 'x' },
            { id: 'folder-5', name: ' ' },
          ],
          placeNames: { technique: '', jonny: 42 },
          hiddenItems: ['hanon', 7, 'hanon'],
        },
      },
    })
    expect(state.arrangements.exercises).toEqual({
      ...EMPTY,
      folders: [{ id: 'folder-4', name: 'Keep' }],
      hiddenItems: ['hanon'],
    })
    expect(state.nextFolder).toBe(5)
  })

  it('reads a save of another version as nothing kept', () => {
    expect(restored({ favourites: { exercises: ['hanon'] } }, 0).favourites.exercises).toEqual([])
  })

  it('keeps each favourite once, and a favourite of its own only while it is kept', () => {
    const state = restored({
      favourites: { exercises: ['hanon', 'hanon', 7, ''], progressions: ['mine-9', 'axis'] },
      progressions: [SAD],
    })
    expect(state.favourites).toEqual({ exercises: ['hanon'], progressions: ['axis'] })
  })

  it('keeps an own progression only with a name, a line that reads and its mode', () => {
    const state = restored({
      progressions: [
        { ...SAD, name: '  Sad loop  ' },
        { ...SAD, id: 'mine-2', name: '   ' },
        { ...SAD, id: 'mine-3', line: 'not numerals' },
        { ...SAD, id: 'mine-4', minor: 'yes' },
        { ...SAD, id: 'mine-5', mode: 'nowhere' },
        { ...SAD, id: 'mine-1', name: 'Twice' },
        { ...SAD, id: 'yours-6' },
      ],
    })
    expect(state.progressions).toEqual([SAD, { ...SAD, id: 'mine-5' }])
  })

  it('never reuses an id: the next is past every one kept', () => {
    expect(restored({ progressions: [{ ...SAD, id: 'mine-7' }], nextOwn: 2 }).nextOwn).toBe(8)
    expect(restored({ nextOwn: 12 }).nextOwn).toBe(12)
  })
})

describe('the practice library’s selectors', () => {
  const state = restored({
    favourites: { exercises: ['hanon'], progressions: ['axis'] },
    progressions: [SAD],
  })

  it('read each kind’s favourites apart', () => {
    expect(selectFavouritesOf('exercises')(state)).toEqual(['hanon'])
    expect(selectIsFavouriteOf('progressions', 'axis')(state)).toBe(true)
    expect(selectIsFavouriteOf('exercises', 'axis')(state)).toBe(false)
  })

  it('find the learner’s own progressions', () => {
    expect(selectOwnProgressions(state)).toEqual([SAD])
    expect(selectOwnProgression('mine-1')(state)).toEqual(SAD)
    expect(selectOwnProgression('mine-2')(state)).toBeUndefined()
  })
})

describe('ownProgressionName', () => {
  it('keeps a name trimmed, of 1 to 40 characters', () => {
    expect(ownProgressionName('  Loop ')).toBe('Loop')
    expect(ownProgressionName(' ')).toBeNull()
    expect(ownProgressionName('x'.repeat(41))).toBeNull()
  })
})
