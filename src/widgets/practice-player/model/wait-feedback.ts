import {
  practisedHands,
  spellPitchClass,
  type BarRange,
  type PracticeState,
} from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'
import { noteName, pitchClass, type PitchClass } from '@/shared/lib/music'

/** What Wait mode's line says (spec §2.7). */
export type WaitFeedback =
  | { readonly kind: 'play'; readonly notes: readonly string[] }
  | { readonly kind: 'right' }
  | { readonly kind: 'not'; readonly note: string }
  | {
      readonly kind: 'finished'
      /** The wrong keys of the pass, and the bar or two that had the most. */
      readonly slips: number
      readonly hardest: BarRange | null
    }

/** Wait mode's line now: the notes to play as written, a wrong key, right, or finished; nothing while stopped. */
export function waitFeedback(performance: Performance, state: PracticeState): WaitFeedback | null {
  if (state.mode !== 'wait') return null
  if (state.outcome === 'finished') return { kind: 'finished', ...passReport(state.slips) }
  if (!state.playing) return null
  if (state.outcome === 'correct') return { kind: 'right' }
  const group = performance.beatGroups[state.beatGroup]
  if (!group) return null
  if (state.outcome === 'wrong' && state.wrong !== null) {
    return { kind: 'not', note: spellPitchClass(performance, group.chord, pitchClass(state.wrong)) }
  }
  // The notes of the beat as written, lowest first: each pitch class is named by its lowest key, and
  // named in that order (B D F♯ for a B minor chord over its bass), as the hands read it.
  const practised = practisedHands(state.hands)
  const played = group.notes
    .flatMap((index) => performance.notes[index] ?? [])
    .filter((note) => practised[note.hand])
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

/**
 * A pass's slips in a line (spec 2026-10-11): how many, and where most fell: the bar with the most,
 * with the neighbour beside it that had more of the rest, so a hard passage is looped whole.
 */
export function passReport(slips: PracticeState['slips']): {
  slips: number
  hardest: BarRange | null
} {
  const bars = Object.entries(slips).map(([bar, count]) => ({
    bar: Number(bar),
    count: count ?? 0,
  }))
  const total = bars.reduce((sum, { count }) => sum + count, 0)
  const most = bars.reduce<(typeof bars)[number] | null>(
    (best, each) => (best === null || each.count > best.count ? each : best),
    null,
  )
  if (!most || most.count === 0) return { slips: total, hardest: null }
  const at = (bar: number) => slips[bar] ?? 0
  const before = at(most.bar - 1)
  const after = at(most.bar + 1)
  const hardest =
    after > 0 && after >= before
      ? { first: most.bar, last: most.bar + 1 }
      : before > 0
        ? { first: most.bar - 1, last: most.bar }
        : { first: most.bar, last: most.bar }
  return { slips: total, hardest }
}
