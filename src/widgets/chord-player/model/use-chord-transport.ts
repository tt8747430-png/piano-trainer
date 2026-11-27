import { useEffect, useLayoutEffect, useState, useSyncExternalStore } from 'react'
import { useServices } from '@/shared/lib/services'
import { steadyTicker } from '@/shared/lib/ticker'
import { createChordEngine, type BoxPlace, type PlayPlan, type TransportState } from './engine'

/** The Chord player's transport over the sheet in hand (R29 CP4): its state, Play, Stop and Loop. */
interface ChordTransport extends TransportState {
  /** Plays, from `at` on the audio clock where given; returns when its first chord sounds, on that clock. */
  play(loop?: number | null, from?: BoxPlace, at?: number): number
  stop(): void
  /** The section looped, or none: the whole sheet repeats. */
  readonly looped: number | null
  setLoop(section: number | null): void
  /** The first bar in play order still to be queued: where a section pressed on the stand-in arranger's panel lands. */
  nextBar(): number
}

/**
 * `onBar` hears each bar in play order as it is queued, with when it begins on the audio clock: where a
 * followed arranger's cues go out.
 */
export function useChordTransport(
  plan: PlayPlan,
  onBar: (bar: number, at: number) => void = () => {},
): ChordTransport {
  const { audio } = useServices()
  const [{ engine, listeners, setPlan }] = useState(() => {
    // The plan and the bar's listener as last rendered, read by the engine before each chord.
    let current = plan
    let heard = onBar
    const listeners = new Set<() => void>()
    const engine = createChordEngine({
      audio,
      ticker: steadyTicker(50),
      plan: () => current,
      onChange: () => listeners.forEach((listener) => listener()),
      onBar: (bar, at) => heard(bar, at),
    })
    return {
      engine,
      listeners,
      setPlan: (next: PlayPlan, listener: typeof onBar) => {
        current = next
        heard = listener
      },
    }
  })
  useLayoutEffect(() => setPlan(plan, onBar))
  const [looped, setLooped] = useState<number | null>(null)
  // Leaving the page leaves nothing sounding.
  useEffect(() => () => engine.dispose(), [engine])
  const state = useSyncExternalStore((onChange) => {
    listeners.add(onChange)
    return () => listeners.delete(onChange)
  }, engine.state)
  return {
    ...state,
    play: (loop = looped, from, at) =>
      engine.play({ loop, ...(from ? { from } : {}), ...(at === undefined ? {} : { at }) }),
    stop: engine.stop,
    nextBar: engine.nextBar,
    looped,
    setLoop: (section) => {
      setLooped(section)
      engine.loop(section)
    },
  }
}
