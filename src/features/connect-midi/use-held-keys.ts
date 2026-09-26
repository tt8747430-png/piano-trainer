import { useEffect } from 'react'
import { usePresses } from '@/shared/lib'
import type { Midi } from '@/shared/lib/music'
import { useServices } from '@/shared/lib/services'

/** The keys held down on the MIDI keyboard now, each for at least the shortest press. */
export function useHeldKeys(): ReadonlySet<Midi> {
  const { midi } = useServices()
  const { keys, press, release } = usePresses<Midi>()
  useEffect(
    () =>
      midi?.onNote((event) => {
        if (event.on) press(event.midi, event.midi)
        else release(event.midi)
      }),
    [midi, press, release],
  )
  return keys
}
