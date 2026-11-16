import {
  practisedHands,
  waitsForNotes,
  spellPitchClass,
  type BarRange,
  type PracticeState,
} from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'
import { noteName, pitchClass } from '@/shared/lib/music'

/** What Wait mode's line says. */
export type WaitFeedback =
  | { readonly kind: 'play'; readonly notes: readonly string[] }
  | { readonly kind: 'right' }
  | { readonly kind: 'not'; readonly note: string }
  /** A key of the right name in the wrong octave: which way the written one lies. */
  | { readonly kind: 'octave'; readonly way: 'lower' | 'higher' }
  | {
      readonly kind: 'finished'
      /** The wrong keys of the pass, and the bar or two that had the most. */
      readonly slips: number
      readonly hardest: BarRange | null
    }

/** Wait mode's line now: the notes to play as written, a wrong key, right, or finished; nothing while stopped. */
export function waitFeedback(performance: Performance, state: PracticeState): WaitFeedback | null {
  if (!waitsForNotes(state.mode)) return null
  if (state.outcome === 'finished') return { kind: 'finished', ...passReport(state.slips) }
  if (!state.playing) return null
  if (state.outcome === 'correct') return { kind: 'right' }
  const group = performance.beatGroups[state.beatGroup]
  if (!group) return null
  if (state.outcome === 'wrong' && state.wrong !== null) {
    const wrong = state.wrong
    // The right name an octave or more off: the nearest written key of that name says which way.
    const named = state.expected
      .filter((key) => pitchClass(key) === pitchClass(wrong))
      .toSorted((a, b) => Math.abs(a - wrong) - Math.abs(b - wrong))[0]
    if (named !== undefined) return { kind: 'octave', way: named < wrong ? 'lower' : 'higher' }
    return { kind: 'not', note: spellPitchClass(performance, group.chord, pitchClass(wrong)) }
  }
  // The keys of the beat as written, lowest first, each named as it is spelled (B D F♯ for a B minor
  // chord over its bass), as the hands read it.
  const practised = practisedHands(state.hands)
  const played = group.notes
    .flatMap((index) => performance.notes[index] ?? [])
    .filter((note) => practised[note.hand])
  const notes = state.expected.map((key) => {
    const written = played.find((note) => note.midi === key)
    return written
      ? noteName(written.spelled)
      : spellPitchClass(performance, group.chord, pitchClass(key))
  })
  return notes.length > 0 ? { kind: 'play', notes } : null
}

/**
 * A pass's slips in a line: how many, and where most fell: the bar with the most,
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
