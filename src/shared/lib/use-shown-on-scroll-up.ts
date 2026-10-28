import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { keyboardOpen } from './keyboard-viewport'

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
 * it scrolls down again. While the phone's keyboard is up it holds still: the page scrolled to lift a
 * field clear of it is no reading (Mindscape's ADR 0002: the bar does not move as the keyboard opens).
 */
export function useShownOnScrollUp(past = 0): boolean {
  const [shown, setShown] = useState(true)
  const last = useRef(0)
  const onScroll = useEffectEvent(() => {
    const y = scrolledTo()
    if (keyboardOpen()) {
      last.current = y
      return
    }
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
