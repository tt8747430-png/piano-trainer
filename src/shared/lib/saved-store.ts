import { persist, type PersistStorage } from 'zustand/middleware'
import { createStore, type StoreApi } from 'zustand/vanilla'
import { followOtherTabs } from './other-tabs'
import { safeLocalStorage } from './safe-storage'
import { isRecord } from './saved'

/** Where a saved store keeps its save, and where it hears another tab's. */
export interface SavingOptions {
  /** localStorage, or memory where the browser blocks it. */
  readonly storage?: Storage
  /** Where another tab's saves are announced: the window. */
  readonly otherTabs?: EventTarget
}

/** What `migrate` hands `merge` for a save of another version: nothing of it is read. */
const DISCARDED = Symbol('discarded')

/**
 * Saves as JSON in `storage`. A save without a numeric version reads as one of no version (NaN, which
 * no store has), so it is discarded as another version's is: zustand migrates only a numeric version,
 * and would read a save without one as the store's own.
 */
function savesIn(storage: Storage): PersistStorage<unknown> {
  return {
    getItem: (name) => {
      const json = storage.getItem(name)
      if (json === null) return null
      let saved: unknown
      try {
        saved = JSON.parse(json)
      } catch {
        return null
      }
      return isRecord(saved) && typeof saved.version === 'number'
        ? { state: saved.state, version: saved.version }
        : { state: undefined, version: Number.NaN }
    },
    setItem: (name, value) => storage.setItem(name, JSON.stringify(value)),
    removeItem: (name) => storage.removeItem(name),
  }
}

/**
 * A store saved under `key` in `version` (ADR 0038). Stored JSON is untrusted, so `read` turns a save
 * of this version into its state, field by field, taking `current`'s value for what it cannot read: a
 * field added later reads as its default. A save of another version is not read, and the store starts
 * from `initial`: a shape that changes is a new version. What is saved is the state, or what `write`
 * makes of it (a compact form); `read` reads that back. The store follows another tab's saves of its
 * version (`followOtherTabs`), so one tab never writes over another's.
 */
export function createSavedStore<State>(
  {
    key,
    version,
    initial,
    read,
    write = (state) => state,
  }: {
    key: string
    version: number
    initial: State
    read: (saved: unknown, current: State) => State
    write?: (state: State) => unknown
  },
  { storage = safeLocalStorage(), otherTabs = window }: SavingOptions = {},
): StoreApi<State> {
  const store = createStore<State>()(
    persist<State, [], [], unknown>(() => initial, {
      name: key,
      version,
      storage: savesIn(storage),
      partialize: write,
      migrate: () => DISCARDED,
      merge: (saved, current) => (saved === DISCARDED ? current : read(saved, current)),
    }),
  )
  followOtherTabs(store.persist, { key, version }, otherTabs)
  return store
}
