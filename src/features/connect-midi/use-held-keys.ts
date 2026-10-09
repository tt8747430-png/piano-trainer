import { useEffect } from 'react'
import { usePresses } from '@/shared/lib'
import type { Midi } from '@/shared/lib/music'
import { useServices } from '@/shared/lib/services'

/**
 * The keys held down on the MIDI keyboard now, each for at least the shortest press. A key let go
 * while its sustain pedal is down stays down until the pedal comes up, as the piano sounds it: the
 * screen shows what is heard.
 */
export function useHeldKeys(): ReadonlySet<Midi> {
  const { midi } = useServices()
  const { keys, press, release } = usePresses<Midi>()
  useEffect(() => {
    if (!midi) return
    let sustain = false
    /** The keys let go under the sustain: down until it comes up. */
    const sustained = new Set<Midi>()
    const stopNotes = midi.onNote((event) => {
      if (event.on) {
        sustained.delete(event.midi)
        press(event.midi, event.midi)
      } else if (sustain) sustained.add(event.midi)
      else release(event.midi)
    })
    const stopPedal = midi.onPedal((event) => {
      if (event.pedal !== 'sustain') return
      sustain = event.down
      if (sustain) return
      for (const key of sustained) release(key)
      sustained.clear()
    })
    return () => {
      stopNotes()
      stopPedal()
    }
  }, [midi, press, release])
  return keys
}
