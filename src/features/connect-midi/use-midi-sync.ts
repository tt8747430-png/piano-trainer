import { useEffect, useEffectEvent } from 'react'
import { selectMidi, useSettings } from '@/entities/settings'
import type { Midi } from '@/shared/lib/music'
import { touchVelocity } from '@/shared/lib/schedule'
import { useServices } from '@/shared/lib/services'

/**
 * The MIDI keyboard as the settings say: the port hears the keyboard chosen,
 * shifted, its pedals read the right way round, so every reader of the port hears the same keys.
 * Its pedals are the live voice's pedals, always; its keys sound through the live voice, as loud as
 * the Touch hears them, only with Sound the MIDI keyboard on: what it sounded is let go as the switch
 * goes off or the app goes, so nothing rings on. With Play through the piano on, the app's music
 * sounds on the keyboard's speaker while it has one, and in the browser again once it goes.
 */
export function useMidiSync(): void {
  const { audio, midi } = useServices()
  const { device, octaveShift, pedal, sound, touch, throughPiano } = useSettings(selectMidi)

  useEffect(() => {
    midi?.configure({ device, octaveShift, reversedPedal: pedal === 'reversed' })
  }, [midi, device, octaveShift, pedal])

  useEffect(() => midi?.onPedal((event) => audio.pedal(event.pedal, event.down)), [midi, audio])

  useEffect(() => {
    if (!midi || !throughPiano) return
    // The speaker is asked for again as keyboards come and go, or another is chosen.
    const route = () => audio.notesTo(midi.noteOutput())
    route()
    const stop = midi.onStatus(route)
    return () => {
      stop()
      audio.notesTo(null)
    }
  }, [midi, audio, throughPiano, device])

  const heard = useEffectEvent((velocity: number) => touchVelocity(velocity, touch))
  useEffect(() => {
    if (!midi || !sound) return
    // How many note-ons each key sounded (two keyboards under Any can hold one key): one release each.
    const sounded = new Map<Midi, number>()
    const stop = midi.onNote((event) => {
      const held = sounded.get(event.midi) ?? 0
      if (event.on) {
        sounded.set(event.midi, held + 1)
        audio.press(event.midi, heard(event.velocity))
        return
      }
      if (held === 0) return
      if (held === 1) sounded.delete(event.midi)
      else sounded.set(event.midi, held - 1)
      audio.release(event.midi)
    })
    return () => {
      stop()
      for (const [key, held] of sounded) for (let i = 0; i < held; i++) audio.release(key)
    }
  }, [midi, audio, sound])
}
