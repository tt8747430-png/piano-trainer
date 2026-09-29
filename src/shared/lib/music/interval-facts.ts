import type { Interval, IntervalName } from './interval'

/**
 * The Intervals reference's cards: the thirteen within the octave, then the compound intervals a
 * chord symbol names (♭9, 9, #9, 11, #11, ♭13, 13).
 */
export const INTERVAL_GROUPS = {
  simple: ['r', 'm2', 'M2', 'm3', 'M3', 'P4', 'A4', 'P5', 'm6', 'M6', 'm7', 'M7', 'P8'],
  compound: ['m9', 'M9', 'A9', 'P11', 'A11', 'm13', 'M13'],
} as const satisfies Record<string, readonly IntervalName[]>
export type IntervalGroup = keyof typeof INTERVAL_GROUPS
export const INTERVAL_GROUP_IDS = ['simple', 'compound'] as const satisfies readonly IntervalGroup[]
/** An interval the reference writes a card for. */
export type ReferenceInterval = (typeof INTERVAL_GROUPS)[IntervalGroup][number]

export const CONSONANCES = ['perfect', 'imperfect', 'dissonance'] as const
export type Consonance = (typeof CONSONANCES)[number]

/** The semitones of the major or perfect interval over each letter distance. */
const PLAIN = [0, 2, 4, 5, 7, 9, 11]
/** The unison, 4th and 5th: perfect when plain. */
const PERFECT_STEPS = new Set([0, 3, 4])
/** 3rds and 6ths: imperfect consonances when major or minor. */
const IMPERFECT_STEPS = new Set([2, 5])

/**
 * How an interval sounds, as theory classes it by its simple interval: a perfect unison, 4th, 5th or
 * octave is a perfect consonance, a major or minor 3rd or 6th an imperfect one, and every 2nd, 7th,
 * augmented or diminished interval (the tritone among them) a dissonance.
 */
export function consonanceOf({ steps, semitones }: Interval): Consonance {
  const step = steps % 7
  const off = (semitones % 12) - (PLAIN[step] ?? 0)
  if (PERFECT_STEPS.has(step)) return off === 0 ? 'perfect' : 'dissonance'
  if (IMPERFECT_STEPS.has(step) && (off === 0 || off === -1)) return 'imperfect'
  return 'dissonance'
}
