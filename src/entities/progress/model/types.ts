import type { StepId } from '@/entities/step'
import type { PieceId } from '@/entities/piece'
import type { SongPlay } from './songs'
import type { SkillId } from '@/shared/lib/music'
import type { ChordLessonKey, LessonKey } from './lessons'

/** One quiz answer on a skill. `at` is an ISO date. */
export interface Answer {
  readonly correct: boolean
  readonly at: string
}

/** A quiz answer as the quiz gives it: the skill it was on, and whether it was right. */
export interface QuizAnswer {
  readonly skill: SkillId
  readonly correct: boolean
}

/** How a trainer's run went: right answers out of 100, and the most in a row; how many answered and how long each took. */
export interface RunResult {
  readonly accuracy: number
  readonly streak: number
  readonly answered: number
  readonly averageMs: number
}

/** One practice run as the history keeps it (canvas 160): a quiz's or a run played, where, how it went, when (ISO). */
export type PracticeRun = QuizRun | PlayedRun

/** A trainer's quiz run: its answers right out of 100, the most in a row, how many and how long each took. */
export interface QuizRun extends RunResult {
  readonly kind: 'quiz'
  readonly id: string
  readonly key: RunKey
  readonly at: string
}

/**
 * How a bar of a run played in Wait mode went (the practice machine's pass): played at once, with a
 * slip (a wrong key), or after a pause of over two beats (shown, never scored).
 */
export type RunStep = 'clean' | 'slip' | 'pause'

/** A note of a run's chord on the treble staff: its diatonic steps above middle C and its accidental. */
export interface StaffNote {
  /** Diatonic steps from C4: E4 is 2, B3 is −1. */
  readonly step: number
  readonly accidental: -2 | -1 | 0 | 1 | 2
}

/** A run played to its end in Wait mode (the run view's results, `PlayChord`): what it was and how each bar went. */
export interface PlayedRun {
  readonly kind: 'played'
  readonly id: string
  readonly key: RunKey
  /** Its name as it was played ("Cmaj7: Inversions"). */
  readonly title: string
  /** The route that plays it again, with its choices. */
  readonly href: string
  readonly tempo: number
  /** Each bar's step, in order. */
  readonly steps: readonly RunStep[]
  /** Each bar's chord as the run walks it, a whole note on the treble staff; none for an engraved line. */
  readonly chords: readonly (readonly StaffNote[])[]
  /** The pass's score: its share of bars with no slip, a whole percent. */
  readonly accuracy: number
  readonly at: string
}

/** A run played as it is kept, before its id and its time. */
export type PlayedResult = Omit<PlayedRun, 'kind' | 'id' | 'key' | 'at'>

/** How many runs the history keeps, the latest. */
export const HISTORY_KEPT = 200

/** A trainer's runs at one level (or Custom): how many, the last and best accuracy, the best streak. */
export interface TrainerRecord {
  readonly runs: number
  readonly last: number
  readonly best: number
  readonly bestStreak: number
}

/** Where a trainer keeps a level's record: `name-chord:3`, `intervals-by-ear:custom`. */
export type RunKey = `${string}:${string}`

/** What the learner has done, saved on this device. Dates are ISO strings. */
export interface ProgressState {
  /** When each step or lesson was marked learned. */
  readonly learned: Readonly<Partial<Record<StepId, string>>>
  /** Each piece's last opening in the Player. */
  readonly practised: Readonly<Partial<Record<PieceId, string>>>
  /** Each skill's evidence, oldest first, at most EVIDENCE_SIZE answers. */
  readonly answers: Readonly<Partial<Record<SkillId, readonly Answer[]>>>
  /** Each trainer's record, by trainer and level. */
  readonly trainers: Readonly<Partial<Record<RunKey, TrainerRecord>>>
  /** The days on the learner's calendar they practised (`2026-10-11`), oldest first, the latest DAYS_KEPT. */
  readonly days: readonly string[]
  /** When each song lesson was first done (ADR 0111), the latest LESSONS_KEPT. */
  readonly lessons: Readonly<Partial<Record<LessonKey, string>>>
  /**
   * How many times each chord lesson's chord was held so far (ADR 0111), 1 or 2: on its third hold
   * it is done in `lessons` and leaves here. The latest LESSONS_KEPT, last held last.
   */
  readonly holds: Readonly<Partial<Record<ChordLessonKey, number>>>
  /** The sections of each lesson read so far, by their place, in order: what fills its ring. */
  readonly read: Readonly<Partial<Record<StepId, readonly number[]>>>
  /**
   * Each exercise's last tempo, beats a minute, by what it is kept under (`hanon:5`, `scale`): where
   * it opens next time, so its tempo ladder goes on from the rung it reached.
   */
  readonly tempos: Readonly<Partial<Record<string, number>>>
  /** The seconds played each day (B1), by the day on the learner's calendar, the latest DAYS_KEPT. */
  readonly seconds: Readonly<Partial<Record<string, number>>>
  /** The keys practised (B1, Scale Master): a scale or a key's chords played in it, and the day it first was. */
  readonly keys: Readonly<Partial<Record<string, string>>>
  /** The day each badge tier (`streak:2`) and milestone (`first-lesson`) was first reached. */
  readonly earned: Readonly<Partial<Record<string, string>>>
  /** The day of a first the stores do not keep: a song published, a minute on a connected piano. */
  readonly firsts: Readonly<Partial<Record<FirstId, string>>>
  /** The best a take in the Player was played, per cent of its notes right (B8's Feedback; A perfect take). */
  readonly bestTake: number
  /** The day each exercise was last played through (A41), by its id: its row ticked that day. */
  readonly exercised: Readonly<Partial<Record<string, string>>>
  /** Every practice run, newest first, the latest HISTORY_KEPT (canvas 160): Profile's Practice history. */
  readonly history: readonly PracticeRun[]
  /** Each song as played in the Player (canvas 125), the latest SONGS_KEPT, last played last. */
  readonly songs: Readonly<Partial<Record<PieceId, SongPlay>>>
}

/** The firsts the progress keeps the day of, written where they happen. */
export const FIRSTS = ['published', 'midi'] as const
export type FirstId = (typeof FIRSTS)[number]

export const EMPTY_PROGRESS: ProgressState = {
  learned: {},
  practised: {},
  answers: {},
  trainers: {},
  days: [],
  lessons: {},
  holds: {},
  read: {},
  tempos: {},
  seconds: {},
  keys: {},
  earned: {},
  firsts: {},
  bestTake: 0,
  exercised: {},
  history: [],
  songs: {},
}
