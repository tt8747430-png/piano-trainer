import { useEffect, useState } from 'react'
import type { Midi } from '@/shared/lib/music'
import { useServices } from '@/shared/lib/services'

const NONE: ReadonlySet<Midi> = new Set()

/** The keys held down on the MIDI keyboard now. */
export function useHeldKeys(): ReadonlySet<Midi> {
  const { midi } = useServices()
  const [held, setHeld] = useState(NONE)
  useEffect(
    () =>
      midi?.onNote((event) =>
        setHeld((keys) => {
          const next = new Set(keys)
          if (event.on) next.add(event.midi)
          else next.delete(event.midi)
          return next
        }),
      ),
    [midi],
  )
  return held
}
