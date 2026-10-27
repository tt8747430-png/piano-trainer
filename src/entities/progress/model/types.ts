import type { StepId } from '@/entities/step'
import type { PieceId } from '@/entities/piece'
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

/** How a trainer's run went: right answers out of 100, and the most in a row. */
export interface RunResult {
  readonly accuracy: number
  readonly streak: number
}

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
}

export const EMPTY_PROGRESS: ProgressState = {
  learned: {},
  practised: {},
  answers: {},
  trainers: {},
  days: [],
  lessons: {},
  holds: {},
}
