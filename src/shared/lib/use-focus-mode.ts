import { useSyncExternalStore } from 'react'

/**
 * Focus (the canvas's laptop window, `lapwin.py`): the sidebar and every side panel hidden, so the
 * page's one thing fills the window, as macOS full screen and Notes' focus do. It lasts the session:
 * a reload opens the app with its sidebar, as the learner left it.
 */
let on = false
const listeners = new Set<() => void>()

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** Whether Focus is on; the component re-renders when it turns. */
export function useFocusMode(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => on,
    () => false,
  )
}

/** Turns Focus on or off. */
export function setFocusMode(next: boolean): void {
  if (next === on) return
  on = next
  for (const listener of listeners) listener()
}
