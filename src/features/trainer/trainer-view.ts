import { isOneOf } from '@/shared/lib'

// What a trainer asks, as its URL holds it: apart from its ladders, so the router's validators carry
// no trainer into the first paint.

export const TRAINER_IDS = [
  'build-chord',
  'name-chord',
  'build-scale',
  'gaps',
  'intervals-by-ear',
  'chords-by-ear',
  'scales-by-ear',
  'reading-notes',
  'key-signatures',
  'key-degrees',
  'chord-role',
] as const
export type TrainerId = (typeof TRAINER_IDS)[number]
export const isTrainerId = isOneOf(TRAINER_IDS)

/** A run's rounds: ten, twenty, or until stopped (0). */
export const ROUNDS = [10, 20, 0] as const
export type Rounds = (typeof ROUNDS)[number]
export const isRounds = isOneOf(ROUNDS)

/** Custom: the level a trainer's own choices make. */
export const CUSTOM = 'custom'

/**
 * A trainer's URL: its level (a level of its ladder, or Custom; absent is its first), how many rounds,
 * and Custom's choices, each a list joined by `.` or a switch, absent for its own.
 */
export interface TrainerView {
  readonly level?: string
  readonly rounds: Rounds
  /** Build and Name chord's types: sizes, suspensions and added tones as lists, Altered a switch. */
  readonly sizes?: string
  readonly suspended?: string
  readonly added?: string
  readonly altered?: boolean
  readonly scales?: string
  readonly intervals?: string
  readonly ways?: string
  readonly qualities?: string
  readonly arpeggio?: boolean
  readonly kinds?: string
  readonly descending?: boolean
  /** Reading notes' range: from and to a note with its octave, `C3`, `G5`. */
  readonly from?: string
  readonly to?: string
  readonly accidentals?: boolean
}

/** A level as a URL writes it: lower case words joined by `-`. */
export const isLevelParam = (value: unknown): value is string =>
  typeof value === 'string' && /^[a-z][a-z0-9-]*$/.test(value)

/** A list of values as the URL writes it, each known one once, in the list's own order; none read is none. */
export function readList<T extends string>(raw: unknown, values: readonly T[]): T[] {
  const written = typeof raw === 'string' ? raw.split('.') : []
  return values.filter((value) => written.includes(value))
}

/** A list as the URL writes it. */
export const listParam = (values: readonly string[]): string => values.join('.')
