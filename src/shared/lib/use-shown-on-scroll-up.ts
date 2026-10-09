import { useEffect, useEffectEvent, useRef, useState } from 'react'

/** Scrolls shorter than this are a finger's jitter, not a direction. */
const DEAD_ZONE = 8

/** Where the page is scrolled to, inside its range: a browser's overshoot at either end is no scroll. */
function scrolledTo(): number {
  const end = document.documentElement.scrollHeight - window.innerHeight
  return Math.min(Math.max(0, window.scrollY), end > 0 ? end : Infinity)
}

/**
 * Whether a screen's bar shows: while the page has scrolled no further than `past` (the bar's own
 * height, so it never leaves a gap where it stood), and from the moment the page scrolls up until
 * it scrolls down again.
 */
export function useShownOnScrollUp(past = 0): boolean {
  const [shown, setShown] = useState(true)
  const last = useRef(0)
  const onScroll = useEffectEvent(() => {
    const y = scrolledTo()
    if (y <= past) {
      last.current = y
      setShown(true)
      return
    }
    if (Math.abs(y - last.current) < DEAD_ZONE) return
    setShown(y < last.current)
    last.current = y
  })
  useEffect(() => {
    last.current = scrolledTo()
    const listener = () => onScroll()
    window.addEventListener('scroll', listener, { passive: true })
    return () => window.removeEventListener('scroll', listener)
  }, [])
  return shown
}
