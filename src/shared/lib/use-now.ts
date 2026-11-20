import { useSyncExternalStore } from 'react'

const MINUTE = 60_000

/** The clock, to the minute: one snapshot per minute, so every reader in a render agrees. */
function minute(): number {
  return Math.floor(Date.now() / MINUTE) * MINUTE
}

const listeners = new Set<() => void>()
let timer: ReturnType<typeof setInterval> | undefined

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  timer ??= setInterval(() => listeners.forEach((each) => each()), MINUTE)
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) {
      clearInterval(timer)
      timer = undefined
    }
  }
}

/**
 * Now, for what a screen says relative to it ("Today", "3 days ago", "Synced 2 minutes ago"): read
 * from one minute clock outside render, so rendering stays pure, and redrawn as each minute turns.
 */
export function useNow(): number {
  return useSyncExternalStore(subscribe, minute)
}
