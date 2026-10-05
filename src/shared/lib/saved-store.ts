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

/**
 * A store saved under `key` in `version`. Saved data keeps working (CLAUDE.md): stored JSON is
 * untrusted and may be any version's, so `read` turns whatever was saved into this version's state,
 * taking `current`'s value for what it cannot read, and a save is never reset. What is saved is the
 * state, or what `write` makes of it (a compact form); `read` reads that back. The store follows
 * another tab's saves (`followOtherTabs`), so one tab never writes over another's.
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
      migrate: (saved) => read(saved, initial),
      merge: (saved, current) => read(saved, current),
    }),
  )
  followOtherTabs(store.persist, { key, version }, otherTabs)
  return store
}
