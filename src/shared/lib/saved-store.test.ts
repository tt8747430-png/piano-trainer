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

  it.each([1, 2, 3])('reads a version-%i save for what it can', (version) => {
    const storage = createMemoryStorage()
    save(storage, { count: 4 }, version)
    expect(counter(storage).store.getState()).toEqual({ count: 4 })
  })

  it('keeps its initial state for what a save cannot give', () => {
    const storage = createMemoryStorage()
    save(storage, { count: 'four' }, 1)
    expect(counter(storage).store.getState()).toEqual({ count: 0 })
  })

  it('takes in what another tab saved, so its next save keeps it', () => {
    const { store, savedElsewhere } = counter()
    savedElsewhere({ count: 5 }, 2)
    expect(store.getState()).toEqual({ count: 5 })
  })

  it('brings an older version’s save from another tab up to date', () => {
    const { storage, store, savedElsewhere } = counter()
    savedElsewhere({ count: 5 }, 1)
    expect(store.getState()).toEqual({ count: 5 })
    expect(JSON.parse(storage.getItem(KEY) ?? 'null')).toEqual({ state: { count: 5 }, version: 2 })
  })

  it('leaves a newer version’s save in another tab alone, never writing it back in its own', () => {
    const { storage, store, savedElsewhere } = counter()
    savedElsewhere({ count: 5, more: true }, 3)
    expect(store.getState()).toEqual({ count: 0 })
    expect(JSON.parse(storage.getItem(KEY) ?? 'null')).toEqual({
      state: { count: 5, more: true },
      version: 3,
    })
  })
})
