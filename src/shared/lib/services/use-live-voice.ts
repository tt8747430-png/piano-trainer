import { useEffect, useMemo, useRef } from 'react'
import type { Midi } from '@/shared/lib/music'
import { HAND_VELOCITY } from '@/shared/lib/schedule'
import { useServices } from './use-services'

/** A hand on the keys, played through the live voice. */
interface HandVoice {
  /** A hand puts `key` down: the keys it plays (itself, or the chord it stands for) strike at `velocity`. */
  down(key: Midi, plays: readonly Midi[], velocity?: number): void
  /** A hand lets `key` go: what its press played is let go where no other press still holds it. */
  up(key: Midi): void
}

/**
 * The live voice for one hand's keys. Each press strikes what it plays, and
 * its key's letting go releases exactly that, though the screen's chords changed meanwhile: one
 * release for each key struck, so the live voice, which counts what holds each key, lets go of a key
 * two presses hold (two fingers, two chords sharing a note) with the last of them. Everything still
 * held is let go as the screen goes.
 */
export function useLiveVoice(): HandVoice {
  const { audio } = useServices()
  /** What each hand key's presses played, oldest first. */
  const presses = useRef(new Map<Midi, (readonly Midi[])[]>())

  useEffect(() => {
    const pressed = presses.current
    return () => {
      for (const played of pressed.values())
        for (const keys of played) for (const key of keys) audio.release(key)
      pressed.clear()
    }
  }, [audio])

  return useMemo(
    () => ({
      down(key, plays, velocity = HAND_VELOCITY) {
        void audio.unlock()
        presses.current.set(key, [...(presses.current.get(key) ?? []), plays])
        for (const played of plays) audio.press(played, velocity)
      },
      up(key) {
        const [played, ...later] = presses.current.get(key) ?? []
        if (!played) return
        if (later.length === 0) presses.current.delete(key)
        else presses.current.set(key, later)
        for (const letGo of played) audio.release(letGo)
      },
    }),
    [audio],
  )
}
