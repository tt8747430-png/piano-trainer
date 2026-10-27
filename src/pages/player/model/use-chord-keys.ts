import { useMemo } from 'react'
import { usePieceInversions } from '@/features/choose-diagram-inversion'
import { diagramChord, diagramMarks, type PracticeState } from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'
import { rangeOf, type KeyRange, type Midi } from '@/shared/lib/music'
import type { KeyMark } from '@/shared/ui'

/** No chord sounding: no key marked. */
const NO_MARKS: ReadonlyMap<Midi, KeyMark> = new Map()

/**
 * The keys at the foot of a chord view while Listen plays (ADR 0108): the chord sounding as its
 * diagram draws it, in the inversion its piece chose, those keys kept in sight; none marked in a bar
 * of no chord, the tune heard and not marked. None in Wait mode, which marks what it waits for, nor
 * over the sheet music (`chordView` false), which marks the notes heard: the Player's own marks.
 */
export function useChordKeys(
  performance: Performance,
  state: Pick<PracticeState, 'mode' | 'beatGroup'>,
  chordView: boolean,
): { readonly marks: ReadonlyMap<Midi, KeyMark>; readonly inView: KeyRange | undefined } | null {
  const chosen = usePieceInversions()?.chosen
  const listening = chordView && state.mode === 'listen'
  const chord = performance.beatGroups[state.beatGroup]?.chord
  // Stable while the chord sounding is, so the keyboard's memoised keys re-render only as it changes.
  return useMemo(() => {
    if (!listening) return null
    const drawn = chord === undefined ? null : diagramChord(performance, chord, chosen)
    return drawn
      ? { marks: diagramMarks(drawn), inView: rangeOf(drawn.keys) }
      : { marks: NO_MARKS, inView: undefined }
  }, [listening, performance, chord, chosen])
}
