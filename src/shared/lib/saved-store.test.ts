import { describe, expect, it } from 'vitest'
import { createMemoryStorage } from './safe-storage'
import { isRecord } from './saved'
import { createSavedStore } from './saved-store'

interface Count {
  readonly count: number
}

const KEY = 'pt-count'
const read = (saved: unknown, current: Count): Count =>
  isRecord(saved) && typeof saved.count === 'number' ? { count: saved.count } : current

/** Puts a save in storage, as an earlier session or another tab would have; returns its JSON. */
function save(storage: Storage, state: unknown, version: number) {
  const json = JSON.stringify({ state, version })
  storage.setItem(KEY, json)
  return json
}

function counter(storage = createMemoryStorage()) {
  const otherTabs = new EventTarget()
  const store = createSavedStore(
    { key: KEY, version: 2, initial: { count: 0 }, read },
    { storage, otherTabs },
  )
  /** Another tab saves `state` in `version`, and this tab hears of it. */
  const savedElsewhere = (state: unknown, version: number) =>
    otherTabs.dispatchEvent(
      new StorageEvent('storage', { key: KEY, newValue: save(storage, state, version) }),
    )
  return { storage, store, savedElsewhere }
}

describe('createSavedStore', () => {
  it('saves its state under its key, in its version', () => {
    const { storage, store } = counter()
    store.setState({ count: 3 })
    expect(JSON.parse(storage.getItem(KEY) ?? 'null')).toEqual({ state: { count: 3 }, version: 2 })
  })

  it('saves what `write` makes of its state, and reads it back through `read`', () => {
    const storage = createMemoryStorage()
    const options = {
      key: KEY,
      version: 1,
      initial: { count: 0 },
      write: ({ count }: Count) => ({ n: count }),
      read: (saved: unknown, current: Count): Count =>
        isRecord(saved) && typeof saved.n === 'number' ? { count: saved.n } : current,
    }
    const store = createSavedStore(options, { storage, otherTabs: new EventTarget() })
    store.setState({ count: 7 })
    expect(JSON.parse(storage.getItem(KEY) ?? 'null')).toEqual({ state: { n: 7 }, version: 1 })
    const again = createSavedStore(options, { storage, otherTabs: new EventTarget() })
    expect(again.getState()).toEqual({ count: 7 })
  })

  it('reads a save of its version for what it can', () => {
    const storage = createMemoryStorage()
    save(storage, { count: 4, more: true }, 2)
    expect(counter(storage).store.getState()).toEqual({ count: 4 })
  })

  it.each([1, 3])(
    'starts from its initial state over a version-%i save, and saves that',
    (version) => {
      const storage = createMemoryStorage()
      save(storage, { count: 4 }, version)
      expect(counter(storage).store.getState()).toEqual({ count: 0 })
      expect(JSON.parse(storage.getItem(KEY) ?? 'null')).toEqual({
        state: { count: 0 },
        version: 2,
      })
    },
  )

  it.each([
    ['without a version', { state: { count: 4 } }],
    ['of a version that is not a number', { state: { count: 4 }, version: '2' }],
  ])('starts from its initial state over a save %s, and saves that', (_, saved) => {
    const storage = createMemoryStorage()
    storage.setItem(KEY, JSON.stringify(saved))
    expect(counter(storage).store.getState()).toEqual({ count: 0 })
    expect(JSON.parse(storage.getItem(KEY) ?? 'null')).toEqual({
      state: { count: 0 },
      version: 2,
    })
  })

  it('starts from its initial state over a save that is not JSON', () => {
    const storage = createMemoryStorage()
    storage.setItem(KEY, '{oops')
    expect(counter(storage).store.getState()).toEqual({ count: 0 })
  })

  it('keeps its initial state for what a save cannot give', () => {
    const storage = createMemoryStorage()
    save(storage, { count: 'four' }, 2)
    expect(counter(storage).store.getState()).toEqual({ count: 0 })
  })

  it('takes in what another tab saved, so its next save keeps it', () => {
    const { store, savedElsewhere } = counter()
    savedElsewhere({ count: 5 }, 2)
    expect(store.getState()).toEqual({ count: 5 })
  })

  it('leaves another version’s save in another tab alone, never writing it back in its own', () => {
    const { storage, store, savedElsewhere } = counter()
    savedElsewhere({ count: 5, more: true }, 3)
    expect(store.getState()).toEqual({ count: 0 })
    expect(JSON.parse(storage.getItem(KEY) ?? 'null')).toEqual({
      state: { count: 5, more: true },
      version: 3,
    })
  })
})
