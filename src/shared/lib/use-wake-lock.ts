import { useEffect } from 'react'

/**
 * Keeps the screen on while `active`: a phone on the music stand does not dim and lock in the middle
 * of a song. The browser lets the lock go when the page is hidden, so it is asked for again when the
 * page shows; where there is no Wake Lock (an older Safari), or it is refused, nothing happens.
 */
export function useWakeLock(active = true): void {
  useEffect(() => {
    if (!active || !('wakeLock' in navigator)) return
    let lock: WakeLockSentinel | null = null
    // One request at a time: a page shown again before the first is granted asks no second.
    let asking = false
    let gone = false
    const ask = () => {
      if (asking || document.visibilityState !== 'visible') return
      asking = true
      navigator.wakeLock.request('screen').then(
        (granted) => {
          asking = false
          if (gone) void granted.release()
          else lock = granted
        },
        () => {
          asking = false
        },
      )
    }
    const onShow = () => {
      if (lock === null || lock.released) ask()
    }
    ask()
    document.addEventListener('visibilitychange', onShow)
    return () => {
      gone = true
      document.removeEventListener('visibilitychange', onShow)
      void lock?.release()
    }
  }, [active])
}
