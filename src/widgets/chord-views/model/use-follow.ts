import { useEffect, useState, type RefObject } from 'react'
import { selectPlayback, useSettings } from '@/entities/settings'

/** The keys that scroll a view by hand. */
const SCROLL_KEYS = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'])

/** Whether a view keeps the music playing in sight, and the way back to it (A37). */
export interface Follow {
  /** The view brings the playing line into sight as the music reaches it. */
  readonly following: boolean
  /** Paused by the learner's own scroll: the pill "Back to the playhead" is offered. */
  readonly paused: boolean
  /** Counts each return to the playhead, so the view brings it into sight again at once. */
  readonly returns: number
  /** Back to the playhead now. */
  resume(): void
}

/**
 * The one follow rule of the Player's views (A37): while the music plays, the view keeps the playing
 * line in sight (Settings › Display › Follow the music); a scroll by hand (wheel, touch, a key)
 * pauses that, until the pill brings it back or, where Settings says, a few seconds after the last
 * scroll. Stopped, a scroll pauses nothing: the next play follows again.
 */
export function useFollow(box: RefObject<HTMLElement | null>, playing: boolean): Follow {
  const { follow, followReturn } = useSettings(selectPlayback)
  const [paused, setPaused] = useState(false)
  // Each manual scroll, counted, so the return timer starts again from the last one.
  const [scrolled, setScrolled] = useState(0)
  const [returns, setReturns] = useState(0)
  // Stopping ends a pause: the next play follows from the start.
  const [wasPlaying, setWasPlaying] = useState(playing)
  if (playing !== wasPlaying) {
    setWasPlaying(playing)
    if (!playing) setPaused(false)
  }
  const resume = () => {
    setPaused(false)
    setReturns((count) => count + 1)
  }

  useEffect(() => {
    const element = box.current
    if (!element || !playing || !follow) return
    const byHand = () => {
      setPaused(true)
      setScrolled((count) => count + 1)
    }
    const onKey = (event: KeyboardEvent) => {
      if (SCROLL_KEYS.has(event.key)) byHand()
    }
    element.addEventListener('wheel', byHand, { passive: true })
    element.addEventListener('touchmove', byHand, { passive: true })
    element.addEventListener('keydown', onKey)
    return () => {
      element.removeEventListener('wheel', byHand)
      element.removeEventListener('touchmove', byHand)
      element.removeEventListener('keydown', onKey)
    }
  }, [box, playing, follow])

  // Back by itself after the delay Settings gives, counted from the last scroll; 0 waits for the pill.
  useEffect(() => {
    if (!paused || followReturn === 0) return
    const timer = setTimeout(() => {
      setPaused(false)
      setReturns((count) => count + 1)
    }, followReturn * 1000)
    return () => clearTimeout(timer)
  }, [paused, scrolled, followReturn])

  return { following: follow && !paused, paused: follow && paused, returns, resume }
}
