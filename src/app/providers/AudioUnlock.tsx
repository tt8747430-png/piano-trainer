import { useEffect } from 'react'
import { useServices } from '@/shared/lib/services'

/**
 * The gestures a browser lets start audio: a mouse's press, a finger's or pen's lift, a key. A touch's
 * press does not count, so the lift must be heard too, and as a touch's end, which WebKit counts.
 */
const GESTURES = ['pointerdown', 'pointerup', 'touchend', 'keydown'] as const

/**
 * Whether this event let the page start audio. A touch's press, or Shift alone, does not: audio made
 * then starts held back, with a warning. Where the browser cannot say, every gesture is tried.
 */
const activated = () => navigator.userActivation?.isActive ?? true

/**
 * Browsers start audio suspended: every gesture anywhere readies it until it first runs, so the first
 * sound is not late. Audio taken later by another app comes back with a sound, never a stray tap.
 * Renders nothing.
 */
export function AudioUnlock() {
  const { audio } = useServices()

  useEffect(() => {
    const unlock = () => {
      if (activated()) audio.prime()
    }
    for (const gesture of GESTURES) window.addEventListener(gesture, unlock, true)
    return () => {
      for (const gesture of GESTURES) window.removeEventListener(gesture, unlock, true)
    }
  }, [audio])

  return null
}
