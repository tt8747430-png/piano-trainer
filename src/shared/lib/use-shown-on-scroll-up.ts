import { useEffect, useState } from 'react'

/** Scrolls shorter than this are a finger's jitter, not a direction. */
const DEAD_ZONE = 8

/**
 * Whether a screen's bar shows: at the top of the page, and from the moment the page scrolls up until
 * it scrolls down again.
 */
export function useShownOnScrollUp(): boolean {
  const [shown, setShown] = useState(true)
  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      if (y <= 0) {
        last = 0
        setShown(true)
        return
      }
      if (Math.abs(y - last) < DEAD_ZONE) return
      setShown(y < last)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return shown
}
