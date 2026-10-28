import { useEffect } from 'react'
import { selectMidi, useSettingsStoreApi } from '@/entities/settings'
import { useServices } from '@/shared/lib/services'

/**
 * A MIDI keyboard the learner allowed before is connected again as the app opens, so every screen
 * that listens to it (Wait mode, the quizzes, the tools) hears it without a visit to Connect. Where
 * it was never allowed, or MIDI input was turned off, nothing is asked. Renders nothing.
 */
export function MidiReconnect() {
  const { midi } = useServices()
  const settings = useSettingsStoreApi()
  // Read as the app opens only: MIDI input turned on or off later connects or disconnects itself.
  useEffect(() => {
    if (selectMidi(settings.getState()).input) void midi?.reconnect()
  }, [midi, settings])
  return null
}
