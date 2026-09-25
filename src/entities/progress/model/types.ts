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

export interface QuizStats {
  readonly correct: number
  readonly total: number
  readonly streak: number
  readonly best: number
}

/** What the learner has done, saved on this device. Dates are ISO strings. */
export interface ProgressState {
  /** When each step was marked learned. */
  readonly learned: Readonly<Partial<Record<StepId, string>>>
  /** Each piece's last opening in the Player. */
  readonly practised: Readonly<Partial<Record<PieceId, string>>>
  /** Each skill's evidence, oldest first, at most EVIDENCE_SIZE answers. */
  readonly answers: Readonly<Partial<Record<SkillId, readonly Answer[]>>>
  readonly quiz: QuizStats
}

export const NO_QUIZ_STATS: QuizStats = { correct: 0, total: 0, streak: 0, best: 0 }

export const EMPTY_PROGRESS: ProgressState = {
  learned: {},
  practised: {},
  answers: {},
  quiz: NO_QUIZ_STATS,
}
