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
    let gone = false
    const ask = () => {
      if (document.visibilityState !== 'visible') return
      navigator.wakeLock.request('screen').then(
        (granted) => {
          if (gone) void granted.release()
          else lock = granted
        },
        () => {},
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
