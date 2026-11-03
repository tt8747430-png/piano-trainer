import { vi } from 'vitest'

/**
 * A controllable `prefers-color-scheme` for jsdom, which has no matchMedia. A pointer query answers
 * by `pointer` when given (a computer's `fine`, a phone's `coarse`); every other query with
 * the dark flag; `setDark` flips it and notifies listeners, like an OS theme switch.
 */
export function stubMatchMedia({
  dark,
  pointer,
  anyPointer = pointer,
}: {
  dark: boolean
  /** The main pointer (`pointer:`); unset, a pointer query answers as any other (the dark flag). */
  pointer?: 'fine' | 'coarse'
  /** Any pointer (`any-pointer:`), a touch laptop's trackpad beside its screen; else as `pointer`. */
  anyPointer?: 'fine' | 'coarse'
}) {
  const state = { dark }
  const listeners = new Set<() => void>()
  // A plain function, not a mock: a worker keeps every mock made in it, and this is made per test.
  const matchMedia = (media: string) => ({
    media,
    get matches() {
      if (anyPointer && media.includes('any-pointer')) return anyPointer === 'fine'
      return pointer && media.includes('pointer') ? pointer === 'fine' : state.dark
    },
    onchange: null,
    addEventListener: (_type: 'change', listener: () => void) => void listeners.add(listener),
    removeEventListener: (_type: 'change', listener: () => void) => void listeners.delete(listener),
    addListener: (listener: () => void) => void listeners.add(listener),
    removeListener: (listener: () => void) => void listeners.delete(listener),
    dispatchEvent: () => false,
  })
  vi.stubGlobal('matchMedia', matchMedia)
  return {
    setDark(next: boolean) {
      state.dark = next
      for (const listener of listeners) listener()
    },
    listenerCount: () => listeners.size,
  }
}
