import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { keyboardOpen } from './keyboard-viewport'

/** Scrolls shorter than this are a finger's jitter, not a direction. */
const DEAD_ZONE = 8

/** Where the page is scrolled to, inside its range: a browser's overshoot at either end is no scroll. */
function scrolledTo(): number {
  const end = document.documentElement.scrollHeight - window.innerHeight
  return Math.min(Math.max(0, window.scrollY), end > 0 ? end : Infinity)
}

/** A field written in, or a menu or list open over the page: the page under it is not being read. */
function busy(): boolean {
  const focused = document.activeElement
  return (
    (focused instanceof HTMLElement &&
      (focused.matches('input, textarea, select') || focused.isContentEditable)) ||
    document.querySelector('[role="menu"], [role="listbox"]') !== null
  )
}

/**
 * Whether a screen's bar shows: while the page has scrolled no further than `past` (the bar's own
 * height, so it never leaves a gap where it stood), and from the moment the page scrolls up until
 * it scrolls down again. While the phone's keyboard is up it holds still: the page scrolled to lift a
 * field clear of it is no reading (Mindscape's ADR 0002: the bar does not move as the keyboard opens).
 * It stays, too, while a field is written in or a menu is open, and on a page shorter than `tall`
 * screens, where hiding it would only take the controls under it along (A31).
 */
export function useShownOnScrollUp(past = 0, { tall = 0 }: { tall?: number } = {}): boolean {
  const [shown, setShown] = useState(true)
  const last = useRef(0)
  const onScroll = useEffectEvent(() => {
    const y = scrolledTo()
    if (keyboardOpen() || busy()) {
      last.current = y
      return
    }
    if (y <= past || document.documentElement.scrollHeight < tall * window.innerHeight) {
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
