import { useMemo, useState } from 'react'
import { useMidiKeyDown } from '@/features/connect-midi'
import type { Midi } from '@/shared/lib/music'
import { EMPTY_TRAIL, strike, type Trail } from '@/widgets/live-score'

/** Play's trail (spec 2026-10-09 §5.1): what was played, chord by chord, and Clear. */
export interface FreePlay {
  readonly chords: readonly (readonly Midi[])[]
  /** A key tapped or typed: struck now. */
  play(key: Midi): void
  clear(): void
}

export function useFreePlay(): FreePlay {
  const [trail, setTrail] = useState<Trail>(EMPTY_TRAIL)
  useMidiKeyDown((key, time) => setTrail((current) => strike(current, key, time)))
  const chords = useMemo(() => trail.map((chord) => chord.keys), [trail])
  return {
    chords,
    play: (key) => setTrail((current) => strike(current, key, performance.now())),
    clear: () => setTrail(EMPTY_TRAIL),
  }
}
