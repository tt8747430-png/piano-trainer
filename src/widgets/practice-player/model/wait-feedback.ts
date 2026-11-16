import {
  practisedHands,
  waitsForNotes,
  spellPitchClass,
  type BarRange,
  type PracticeState,
} from '@/features/practice'
import { WEAK, weakestBars } from '@/entities/take'
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
      /** The pass's score, its share of steps played with no slip, a whole percent. */
      readonly score: number
      /** The weakest bar or two, where they are under `WEAK` (the takes' rule). */
      readonly hardest: BarRange | null
    }

/** Wait mode's line now: the notes to play as written, a wrong key, right, or finished; nothing while stopped. */
export function waitFeedback(performance: Performance, state: PracticeState): WaitFeedback | null {
  if (!waitsForNotes(state.mode)) return null
  if (state.outcome === 'finished')
    return { kind: 'finished', ...passReport(performance, state.hands, state.slips) }
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

/** A score this close to full is full (Metronaut's `computeScore`: over 96 % counts as 100). */
const FULL_FROM = 96

/**
 * A pass's score and its hardest bars (the research's items 2 and 4): each step is a beat group the
 * practised hands play in; a step with a slip is not clean. The score is the share of clean steps,
 * full from 96 %; the hardest bars are the takes' rule (`weakestBars`) over each bar's share.
 */
export function passReport(
  performance: Performance,
  hands: PracticeState['hands'],
  slips: PracticeState['slips'],
): { score: number; hardest: BarRange | null } {
  const practised = practisedHands(hands)
  const steps = performance.bars.map(() => 0)
  for (const group of performance.beatGroups) {
    const played = group.notes.some((index) => {
      const note = performance.notes[index]
      return note !== undefined && practised[note.hand]
    })
    if (played) steps[group.bar] = (steps[group.bar] ?? 0) + 1
  }
  const total = steps.reduce((sum, count) => sum + count, 0)
  const slipped = steps.reduce((sum, count, bar) => sum + Math.min(count, slips[bar] ?? 0), 0)
  const percent = total === 0 ? 100 : Math.round((100 * (total - slipped)) / total)
  const shares = steps.map((count, bar) =>
    count === 0 ? null : 1 - Math.min(count, slips[bar] ?? 0) / count,
  )
  const worst = weakestBars(shares)
  return {
    score: percent >= FULL_FROM ? 100 : percent,
    hardest: worst && worst.share < WEAK ? worst.bars : null,
  }
}
