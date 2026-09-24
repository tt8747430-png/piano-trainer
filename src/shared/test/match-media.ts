import { vi } from 'vitest'

/**
 * A controllable `prefers-color-scheme` for jsdom, which has no matchMedia. Every query answers
 * with the same dark flag; `setDark` flips it and notifies listeners, like an OS theme switch.
 */
export function stubMatchMedia({ dark }: { dark: boolean }) {
  const state = { dark }
  const listeners = new Set<() => void>()
  const matchMedia = vi.fn((media: string) => ({
    media,
    get matches() {
      return state.dark
    },
    onchange: null,
    addEventListener: (_type: 'change', listener: () => void) => void listeners.add(listener),
    removeEventListener: (_type: 'change', listener: () => void) => void listeners.delete(listener),
    addListener: (listener: () => void) => void listeners.add(listener),
    removeListener: (listener: () => void) => void listeners.delete(listener),
    dispatchEvent: () => false,
  }))
  vi.stubGlobal('matchMedia', matchMedia)
  return {
    setDark(next: boolean) {
      state.dark = next
      for (const listener of listeners) listener()
    },
    listenerCount: () => listeners.size,
  }
}
