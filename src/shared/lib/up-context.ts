import type { RouterHistory, ValidateNavigateOptions } from '@tanstack/react-router'
import { createContext } from 'react'

/** Where Back goes: a link's options. */
export type Up = ValidateNavigateOptions

/** The parent of the screen on show, or null on a place (the app's parents table, ADR 0052). */
export type FindUp = () => Up | null | Promise<Up | null>

/** Outside the app's provider (a widget tested on its own) every screen's parent is Learn. */
export const UpContext = createContext<FindUp>(() => ({ to: '/' }))

/**
 * The pathname of each history entry the app has seen, by its index: what Back would return to; null
 * for an entry whose screen is gone (`forgetScreens`), which Back steps past.
 */
const seen = new WeakMap<RouterHistory, Map<number, string | null>>()

export function entriesOf(history: RouterHistory): Map<number, string | null> {
  const known = seen.get(history)
  if (known) return known
  const entries = new Map<number, string | null>()
  seen.set(history, entries)
  return entries
}

/**
 * Marks the history's entries for a thing just deleted as gone (its page and those under it, each
 * `prefix`): Back steps past them rather than back onto a page with nothing to show.
 */
export function forgetScreens(history: RouterHistory, ...prefixes: readonly string[]): void {
  const entries = entriesOf(history)
  for (const [index, path] of entries) {
    if (path && prefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}/`)))
      entries.set(index, null)
  }
}
