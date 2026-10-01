import { describe, expect, it } from 'vitest'
import { createMemoryStorage } from '@/shared/lib'
import { createViewsStore, VIEWS_STORAGE_KEY } from './store'
import { MOST_VIEWS } from './view'

const writeSaved = (storage: Storage, state: unknown, version = 1) =>
  storage.setItem(VIEWS_STORAGE_KEY, JSON.stringify({ state, version }))

const restored = (state: unknown) => {
  const storage = createMemoryStorage()
  writeSaved(storage, state)
  return createViewsStore({ storage }).getState()
}

describe('createViewsStore', () => {
  it('starts with no screen remembered and saves under pt-views, version 1', () => {
    const storage = createMemoryStorage()
    const store = createViewsStore({ storage })
    expect(store.getState()).toEqual({ views: {} })
    store.setState({ views: { '/learn/chords': { root: 'G' } } })
    expect(JSON.parse(storage.getItem('pt-views') ?? 'null')).toEqual({
      state: { views: { '/learn/chords': { root: 'G' } } },
      version: 1,
    })
  })

  it('keeps a screen’s params that are text, numbers or switches', () => {
    expect(
      restored({ views: { '/play/bz5': { key: 'A', tempo: 80, swing: true, inversion: 1 } } }),
    ).toEqual({ views: { '/play/bz5': { key: 'A', tempo: 80, swing: true, inversion: 1 } } })
  })

  it('drops what is not a view: a path not from the root, a view not an object, a param neither text, number nor switch', () => {
    expect(
      restored({
        views: {
          'play/bz5': { key: 'A' },
          '/play/flow': { key: 'G', loop: { from: 1 }, tempo: null, bad: Number.NaN },
          '/learn/keys': 'G',
        },
      }),
    ).toEqual({ views: { '/play/flow': { key: 'G' } } })
    expect(restored('views')).toEqual({ views: {} })
    expect(restored({ views: [] })).toEqual({ views: {} })
  })

  it('keeps the screens used last, at most 200', () => {
    const views = Object.fromEntries(
      Array.from({ length: MOST_VIEWS + 1 }, (_, i) => [`/play/p${i}`, { tempo: i }]),
    )
    const kept = Object.keys(restored({ views }).views)
    expect(kept).toHaveLength(MOST_VIEWS)
    expect(kept[0]).toBe('/play/p1')
    expect(kept.at(-1)).toBe(`/play/p${MOST_VIEWS}`)
  })

  it('follows a view saved in another tab', () => {
    const storage = createMemoryStorage()
    const otherTabs = new EventTarget()
    const store = createViewsStore({ storage, otherTabs })
    writeSaved(storage, { views: { '/learn/scales': { root: 'D' } } })
    otherTabs.dispatchEvent(
      new StorageEvent('storage', {
        key: VIEWS_STORAGE_KEY,
        newValue: storage.getItem(VIEWS_STORAGE_KEY),
      }),
    )
    expect(store.getState().views).toEqual({ '/learn/scales': { root: 'D' } })
  })
})
