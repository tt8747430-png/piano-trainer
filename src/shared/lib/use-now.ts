import { useSyncExternalStore } from 'react'

const MINUTE = 60_000

/** The clock, to the minute: one snapshot per minute, so every reader in a render agrees. */
function minute(): number {
  return Math.floor(Date.now() / MINUTE) * MINUTE
}

const listeners = new Set<() => void>()
let timer: ReturnType<typeof setInterval> | undefined

function tell(): void {
  listeners.forEach((each) => each())
}

// A phone stops timers while the app is away; it looks at the clock again as the app comes back.
function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  if (timer === undefined) {
    timer = setInterval(tell, MINUTE)
    document.addEventListener('visibilitychange', tell)
  }
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) {
      clearInterval(timer)
      timer = undefined
      document.removeEventListener('visibilitychange', tell)
    }
  }
}

/**
 * Now, for what a screen says relative to it ("Today", "3 days ago", "Synced 2 minutes ago", a streak's today): read
 * from one minute clock outside render, so rendering stays pure, and redrawn as each minute turns.
 */
export function useNow(): number {
  return useSyncExternalStore(subscribe, minute)
}
