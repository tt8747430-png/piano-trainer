import type { StepId } from '@/entities/path'
import type { PieceId } from '@/entities/piece'
import type { SkillId } from '@/shared/lib/music'

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
  /** When each step was marked learned. */
  readonly learned: Readonly<Partial<Record<StepId, string>>>
  /** Each piece's last opening in the Player. */
  readonly practised: Readonly<Partial<Record<PieceId, string>>>
  /** Each skill's evidence, oldest first, at most EVIDENCE_SIZE answers. */
  readonly answers: Readonly<Partial<Record<SkillId, readonly Answer[]>>>
  /** Each trainer's record, by trainer and level. */
  readonly trainers: Readonly<Partial<Record<RunKey, TrainerRecord>>>
}

export const EMPTY_PROGRESS: ProgressState = {
  learned: {},
  practised: {},
  answers: {},
  trainers: {},
}
