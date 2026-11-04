import { useEffect, useLayoutEffect, useState, useSyncExternalStore } from 'react'
import { useServices } from '@/shared/lib/services'
import { createChordEngine, workerTicker, type PlayPlan, type TransportState } from './engine'

/** The Chord player's transport over the sheet in hand (R29 CP4): its state, Play, Stop and Loop. */
export interface ChordTransport extends TransportState {
  play(loop?: number | null): void
  stop(): void
  /** The section looped, or none: the whole sheet repeats. */
  readonly looped: number | null
  setLoop(section: number | null): void
}

export function useChordTransport(plan: PlayPlan): ChordTransport {
  const { audio } = useServices()
  const [{ engine, listeners, setPlan }] = useState(() => {
    // The plan as last rendered, read by the engine before each chord.
    let current = plan
    const listeners = new Set<() => void>()
    const engine = createChordEngine({
      audio,
      ticker: workerTicker,
      plan: () => current,
      onChange: () => listeners.forEach((listener) => listener()),
    })
    return {
      engine,
      listeners,
      setPlan: (next: PlayPlan) => {
        current = next
      },
    }
  })
  useLayoutEffect(() => setPlan(plan))
  const [looped, setLooped] = useState<number | null>(null)
  // Leaving the page leaves nothing sounding.
  useEffect(() => () => engine.dispose(), [engine])
  const state = useSyncExternalStore((onChange) => {
    listeners.add(onChange)
    return () => listeners.delete(onChange)
  }, engine.state)
  return {
    ...state,
    play: (loop = looped) => engine.play({ loop }),
    stop: engine.stop,
    looped,
    setLoop: (section) => {
      setLooped(section)
      engine.loop(section)
    },
  }
}
