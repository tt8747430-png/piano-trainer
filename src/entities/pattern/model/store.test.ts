import { describe, expect, it } from 'vitest'
import { createMemoryStorage } from '@/shared/lib'
import { createPatternsStore, PATTERNS_STORAGE_KEY } from './store'

const restored = (state: unknown, version = 1) => {
  const storage = createMemoryStorage()
  storage.setItem(PATTERNS_STORAGE_KEY, JSON.stringify({ state, version }))
  return createPatternsStore({ storage, otherTabs: new EventTarget() }).getState()
}

const SUNDAY = { id: 'my-1', name: 'Sunday', rh: 'jaz', lh: 'walk' }

describe('createPatternsStore', () => {
  it('starts with no favourites, nothing hidden and none of the learner’s own', () => {
    const storage = createMemoryStorage()
    const store = createPatternsStore({ storage, otherTabs: new EventTarget() })
    expect(store.getState()).toEqual({ favourites: [], hidden: [], own: [], nextOwn: 1 })
    store.setState({ favourites: ['ballad'] })
    expect(JSON.parse(storage.getItem('pt-patterns') ?? 'null')).toEqual({
      state: { favourites: ['ballad'], hidden: [], own: [], nextOwn: 1 },
      version: 1,
    })
  })

  it('restores what was saved', () => {
    const saved = { favourites: ['my-1', 'M1'], hidden: ['funk'], own: [SUNDAY], nextOwn: 2 }
    expect(restored(saved)).toEqual(saved)
  })

  it('reads an own pattern saved with the held 1–5–8 left hand as the 1–5–8 it became', () => {
    const held = { id: 'my-1', name: 'Held', rh: 'b3', lh: 'arp' }
    expect(restored({ own: [held], nextOwn: 2 }).own).toEqual([{ ...held, lh: 'fig' }])
  })

  it('keeps an own pattern only with a name of 1 to 40 characters and known figures', () => {
    const own = [
      { ...SUNDAY, name: '  Sunday  ' },
      { id: 'my-2', name: '   ', rh: 'jaz', lh: 'walk' },
      { id: 'my-3', name: 'x'.repeat(41), rh: 'jaz', lh: 'walk' },
      { id: 'my-4', name: 'Odd', rh: 'nope', lh: 'walk' },
      { id: 'yours-5', name: 'Odd', rh: 'jaz', lh: 'walk' },
      { id: 'my-1', name: 'Twice', rh: 'b1', lh: 'o' },
      'Sunday',
    ]
    expect(restored({ own, nextOwn: 9 }).own).toEqual([SUNDAY])
  })

  it('keeps favourites and hidden that name what is there, each once; only a built-in is hidden', () => {
    const state = restored({
      favourites: ['ballad', 'my-1', 'my-7', 'nope', 'ballad', 3],
      hidden: ['funk', 'my-1', 'nope'],
      own: [SUNDAY],
    })
    expect(state.favourites).toEqual(['ballad', 'my-1'])
    expect(state.hidden).toEqual(['funk'])
  })

  it('numbers the next own pattern past every one kept, never below 1', () => {
    expect(restored({ own: [{ ...SUNDAY, id: 'my-6' }], nextOwn: 2 }).nextOwn).toBe(7)
    expect(restored({ own: [], nextOwn: 12 }).nextOwn).toBe(12)
    expect(restored({ nextOwn: -3 }).nextOwn).toBe(1)
    expect(restored('nothing')).toEqual({ favourites: [], hidden: [], own: [], nextOwn: 1 })
  })

  it('follows another tab’s save', () => {
    const storage = createMemoryStorage()
    const otherTabs = new EventTarget()
    const store = createPatternsStore({ storage, otherTabs })
    storage.setItem(
      PATTERNS_STORAGE_KEY,
      JSON.stringify({
        state: { favourites: ['rock'], hidden: [], own: [], nextOwn: 1 },
        version: 1,
      }),
    )
    otherTabs.dispatchEvent(
      new StorageEvent('storage', {
        key: PATTERNS_STORAGE_KEY,
        newValue: storage.getItem(PATTERNS_STORAGE_KEY),
      }),
    )
    expect(store.getState().favourites).toEqual(['rock'])
  })
})
