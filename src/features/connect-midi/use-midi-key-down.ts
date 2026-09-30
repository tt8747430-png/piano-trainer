import { useEffect, useEffectEvent } from 'react'
import type { Midi } from '@/shared/lib/music'
import { useServices } from '@/shared/lib/services'

/** Calls `onKey` for each key going down on the MIDI keyboard; nothing where there is none. */
export function useMidiKeyDown(onKey: (key: Midi) => void): void {
  const { midi } = useServices()
  const keyDown = useEffectEvent(onKey)
  useEffect(
    () =>
      midi?.onNote((event) => {
        if (event.on) keyDown(event.midi)
      }),
    [midi],
  )
}
