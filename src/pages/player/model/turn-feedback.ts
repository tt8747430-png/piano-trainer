import { spellPitchClass, type PracticeState } from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'
import { pitchClass } from '@/shared/lib/music'

/** What Your turn's feedback line says (spec §4.4). */
export type TurnFeedback =
  | { readonly kind: 'play'; readonly notes: readonly string[] }
  | { readonly kind: 'right' }
  | { readonly kind: 'not'; readonly note: string }
  | { readonly kind: 'finished' }

/** Your turn's line now: the notes to play, a wrong key, right, or finished. Nothing outside Your turn. */
export function turnFeedback(performance: Performance, state: PracticeState): TurnFeedback | null {
  if (state.mode !== 'turn') return null
  if (state.outcome === 'finished') return { kind: 'finished' }
  if (state.outcome === 'correct') return { kind: 'right' }
  const group = performance.beatGroups[state.beatGroup]
  if (!group) return null
  if (state.outcome === 'wrong' && state.wrong !== null) {
    return { kind: 'not', note: spellPitchClass(performance, group.chord, pitchClass(state.wrong)) }
  }
  return state.expected.length > 0
    ? {
        kind: 'play',
        notes: state.expected.map((pc) => spellPitchClass(performance, group.chord, pc)),
      }
    : null
}
