import { useEffect, useMemo, useRef } from 'react'
import type { Midi } from '@/shared/lib/music'
import { HAND_VELOCITY } from '@/shared/lib/schedule'
import { useServices } from './use-services'

/** A hand on the keys, played through the live voice. */
export interface HandVoice {
  /** A hand puts `key` down: the keys it plays (itself, or the chord it stands for) strike at `velocity`. */
  down(key: Midi, plays: readonly Midi[], velocity?: number): void
  /** A hand lets `key` go: what its press played is let go where no other press still holds it. */
  up(key: Midi): void
}

/**
 * The live voice for one hand's keys (spec 2026-10-09 §2.2). Each press strikes what it plays; a key
 * two presses hold (two fingers, two chords sharing a note) is let go with the last of them, and a
 * press lets go of what it played, though the screen's chords changed meanwhile. Everything still
 * held is let go as the screen goes.
 */
export function useLiveVoice(): HandVoice {
  const { audio } = useServices()
  /** What each hand key's presses played, oldest first. */
  const presses = useRef(new Map<Midi, (readonly Midi[])[]>())
  /** How many presses hold each key sounding. */
  const holds = useRef(new Map<Midi, number>())

  useEffect(() => {
    const held = holds.current
    const pressed = presses.current
    return () => {
      for (const key of held.keys()) audio.release(key)
      held.clear()
      pressed.clear()
    }
  }, [audio])

  return useMemo(
    () => ({
      down(key, plays, velocity = HAND_VELOCITY) {
        void audio.unlock()
        presses.current.set(key, [...(presses.current.get(key) ?? []), plays])
        for (const played of plays) {
          holds.current.set(played, (holds.current.get(played) ?? 0) + 1)
          audio.press(played, velocity)
        }
      },
      up(key) {
        const [played, ...later] = presses.current.get(key) ?? []
        if (!played) return
        if (later.length === 0) presses.current.delete(key)
        else presses.current.set(key, later)
        for (const letGo of played) {
          const left = (holds.current.get(letGo) ?? 1) - 1
          if (left > 0) {
            holds.current.set(letGo, left)
            continue
          }
          holds.current.delete(letGo)
          audio.release(letGo)
        }
      },
    }),
    [audio],
  )
}
