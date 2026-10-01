import { useEffect } from 'react'
import { useServices } from '@/shared/lib/services'

/**
 * A MIDI keyboard the learner allowed before is connected again as the app opens, so every screen
 * that listens to it (Wait mode, the quizzes, the tools) hears it without a visit to Connect. Where
 * it was never allowed, nothing is asked. Renders nothing.
 */
export function MidiReconnect() {
  const { midi } = useServices()
  useEffect(() => {
    void midi?.reconnect()
  }, [midi])
  return null
}
