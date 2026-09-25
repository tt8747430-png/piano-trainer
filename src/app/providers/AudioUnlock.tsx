import { useEffect } from 'react'
import { useServices } from '@/shared/lib/services'

const GESTURES = ['pointerdown', 'keydown'] as const

/** Browsers start audio suspended: the first tap or key press anywhere unlocks it. Renders nothing. */
export function AudioUnlock() {
  const { audio } = useServices()

  useEffect(() => {
    const unlock = () => {
      stopListening()
      void audio.unlock()
    }
    const stopListening = () => {
      for (const gesture of GESTURES) window.removeEventListener(gesture, unlock, true)
    }
    for (const gesture of GESTURES) window.addEventListener(gesture, unlock, true)
    return stopListening
  }, [audio])

  return null
}
