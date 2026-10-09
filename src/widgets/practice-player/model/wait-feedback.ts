import { spellPitchClass, type PracticeState } from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'
import { noteName, pitchClass, type PitchClass } from '@/shared/lib/music'

/** What Wait mode's line says (spec §2.7). */
export type WaitFeedback =
  | { readonly kind: 'play'; readonly notes: readonly string[] }
  | { readonly kind: 'right' }
  | { readonly kind: 'not'; readonly note: string }
  | { readonly kind: 'finished' }

/** Wait mode's line now: the notes to play as written, a wrong key, right, or finished; nothing while stopped. */
export function waitFeedback(performance: Performance, state: PracticeState): WaitFeedback | null {
  if (state.mode !== 'wait') return null
  if (state.outcome === 'finished') return { kind: 'finished' }
  if (!state.playing) return null
  if (state.outcome === 'correct') return { kind: 'right' }
  const group = performance.beatGroups[state.beatGroup]
  if (!group) return null
  if (state.outcome === 'wrong' && state.wrong !== null) {
    return { kind: 'not', note: spellPitchClass(performance, group.chord, pitchClass(state.wrong)) }
  }
  // The notes of the beat as written, lowest first: each pitch class is named by its lowest key, and
  // named in that order (B D F♯ for a B minor chord over its bass), as the hands read it.
  const played = group.notes
    .flatMap((index) => performance.notes[index] ?? [])
    .toSorted((a, b) => a.midi - b.midi)
  const lowest = (pc: PitchClass) => played.find((n) => pitchClass(n.midi) === pc)
  const notes = state.expected
    .map((pc) => ({ pc, written: lowest(pc) }))
    .toSorted((a, b) => (a.written?.midi ?? Infinity) - (b.written?.midi ?? Infinity))
    .map(({ pc, written }) =>
      written ? noteName(written.spelled) : spellPitchClass(performance, group.chord, pc),
    )
  return notes.length > 0 ? { kind: 'play', notes } : null
}
