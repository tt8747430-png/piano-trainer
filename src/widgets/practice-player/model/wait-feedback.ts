import { spellPitchClass, type PracticeState } from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'
import { noteName, pitchClass } from '@/shared/lib/music'

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
  const played = group.notes.map((index) => performance.notes[index])
  const notes = state.expected.map((pc) => {
    const written = played.find((n) => n !== undefined && pitchClass(n.midi) === pc)
    return written ? noteName(written.spelled) : spellPitchClass(performance, group.chord, pc)
  })
  return notes.length > 0 ? { kind: 'play', notes } : null
}
