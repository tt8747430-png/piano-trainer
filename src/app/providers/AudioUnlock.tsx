import { useEffect } from 'react'
import { useServices } from '@/shared/lib/services'

/**
 * The gestures a browser lets start audio: a mouse's press, a finger's or pen's lift, a key. A touch's
 * press does not count, so the lift must be heard too.
 */
const GESTURES = ['pointerdown', 'pointerup', 'keydown'] as const

/**
 * Browsers start audio suspended, and some suspend it again (iOS after a call): every gesture anywhere
 * unlocks it, which does nothing once it runs. Renders nothing.
 */
export function AudioUnlock() {
  const { audio } = useServices()

  useEffect(() => {
    const unlock = () => void audio.unlock()
    for (const gesture of GESTURES) window.addEventListener(gesture, unlock, true)
    return () => {
      for (const gesture of GESTURES) window.removeEventListener(gesture, unlock, true)
    }
  }, [audio])

  return null
}
