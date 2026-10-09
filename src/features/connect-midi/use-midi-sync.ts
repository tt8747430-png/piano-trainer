import { useEffect, useEffectEvent } from 'react'
import { selectMidi, useSettings } from '@/entities/settings'
import type { Midi } from '@/shared/lib/music'
import { touchVelocity } from '@/shared/lib/schedule'
import { useServices } from '@/shared/lib/services'

/**
 * The MIDI keyboard as the settings say (spec 2026-10-09 §3.2): the port hears the keyboard chosen,
 * shifted, its pedals read the right way round, so every reader of the port hears the same keys.
 * Its pedals are the live voice's pedals, always; its keys sound through the live voice, as loud as
 * the Touch hears them, only with Sound the MIDI keyboard on: what it sounded is let go as the switch
 * goes off or the app goes, so nothing rings on.
 */
export function useMidiSync(): void {
  const { audio, midi } = useServices()
  const { device, octaveShift, pedal, sound, touch } = useSettings(selectMidi)

  useEffect(() => {
    midi?.configure({ device, octaveShift, reversedPedal: pedal === 'reversed' })
  }, [midi, device, octaveShift, pedal])

  useEffect(() => midi?.onPedal((event) => audio.pedal(event.pedal, event.down)), [midi, audio])

  const heard = useEffectEvent((velocity: number) => touchVelocity(velocity, touch))
  useEffect(() => {
    if (!midi || !sound) return
    const sounded = new Set<Midi>()
    const stop = midi.onNote((event) => {
      if (event.on) {
        sounded.add(event.midi)
        audio.press(event.midi, heard(event.velocity))
      } else if (sounded.delete(event.midi)) audio.release(event.midi)
    })
    return () => {
      stop()
      for (const key of sounded) audio.release(key)
    }
  }, [midi, audio, sound])
}
