import { createJSONStorage, persist } from 'zustand/middleware'
import { createStore, type StoreApi } from 'zustand/vanilla'
import { followOtherTabs } from './other-tabs'
import { safeLocalStorage } from './safe-storage'

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
      storage: createJSONStorage(() => storage),
      partialize: write,
      migrate: () => DISCARDED,
      merge: (saved, current) => (saved === DISCARDED ? current : read(saved, current)),
    }),
  )
  followOtherTabs(store.persist, { key, version }, otherTabs)
  return store
}
