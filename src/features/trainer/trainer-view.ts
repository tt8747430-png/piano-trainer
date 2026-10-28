import { isOneOf } from '@/shared/lib'

// What a trainer asks, as its URL holds it: apart from its ladders, so the router's validators carry
// no trainer into the first paint.

export const TRAINER_IDS = [
  'chords',
  'intervals',
  'build-scale',
  'gaps',
  'scales-by-ear',
  'progressions-by-ear',
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
 * The four ways a drill asks the same chords or intervals: a card turned over, a choice of four read
 * off the keys and staff, played on the keys, or a choice of four heard.
 */
export const DRILLS = ['flashcards', 'quiz', 'entry', 'ear'] as const
export type Drill = (typeof DRILLS)[number]
export const isDrill = isOneOf(DRILLS)

/** What a flashcard shows of its chord or interval, the rest turned over: its name, keys or staff. */
export const CARD_SIDES = ['name', 'keys', 'staff'] as const
export type CardSide = (typeof CARD_SIDES)[number]
export const isCardSide = isOneOf(CARD_SIDES)

/** A round's time limit in seconds: once it runs out the answer is shown. */
export const TIME_LIMITS = [5, 10, 20, 30] as const
export type TimeLimit = (typeof TIME_LIMITS)[number]
export const isTimeLimit = isOneOf(TIME_LIMITS)

/**
 * A trainer's URL: its level (a level of its ladder, or Custom; absent is its first), how many rounds,
 * and Custom's choices, each a list joined by `.` or a switch, absent for its own.
 */
export interface TrainerView {
  readonly level?: string
  readonly rounds: Rounds
  /** How a drill asks (Chords, Intervals); absent is its first, Flashcards. */
  readonly drill?: Drill
  /** What a flashcard shows; absent is its name. */
  readonly show?: CardSide
  /** Each round's time limit in seconds; absent is none. */
  readonly limit?: TimeLimit
  /** Custom's chords: their qualities, the roots (`C.F#.Bb`) and whether inversions are asked. */
  readonly chords?: string
  readonly roots?: string
  readonly inversions?: boolean
  readonly scales?: string
  readonly intervals?: string
  readonly ways?: string
  /** By ear, a chord's notes one at a time. */
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
