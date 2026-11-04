import { useEffect } from 'react'
import { useProgressStoreApi } from '@/entities/progress'
import { useServices } from '@/shared/lib/services'
import { recordFirst } from './record-time'

/** How long a connected piano is played before it counts as the first session on one (B1). */
export const MIDI_SESSION_MS = 60_000

/** A pause long enough that the next note starts a new session. */
const SESSION_BREAK_MS = 5 * 60_000

/**
 * The First MIDI session milestone (B1): a minute of playing on a connected piano, a note at least a
 * minute after the session's first, with no break of five minutes between. Recorded once; heard in
 * every screen while the app runs, as a connected piano plays in any of them.
 */
export function useFirstMidiSession(now: () => number = Date.now): void {
  const { midi } = useServices()
  const progress = useProgressStoreApi()
  useEffect(() => {
    if (!midi || progress.getState().firsts.midi) return
    let started: number | null = null
    let last = 0
    return midi.onNote((event) => {
      if (!event.on) return
      const at = now()
      if (started === null || at - last > SESSION_BREAK_MS) started = at
      last = at
      if (at - started >= MIDI_SESSION_MS) recordFirst(progress, 'midi', new Date(at))
    })
  }, [midi, progress, now])
}
