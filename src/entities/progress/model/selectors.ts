import type { StepId } from '@/entities/path'
import type { PieceId } from '@/entities/piece'
import type { SkillId } from '@/shared/lib/music'
import { rate, type Rating } from './mastery'
import type { Answer, ProgressState, QuizStats } from './types'

/** One array for every skill with no evidence, so a subscriber never sees a new reference. */
const NO_ANSWERS: readonly Answer[] = []

export const selectLearned = (state: ProgressState) => state.learned
export const selectPractised = (state: ProgressState) => state.practised
export const selectQuizStats = (state: ProgressState): QuizStats => state.quiz

/** The piece opened in the Player most recently, or null. */
export function selectLastPractised(state: ProgressState): PieceId | null {
  let latest: { id: PieceId; at: number } | null = null
  for (const [id, date] of Object.entries(state.practised)) {
    const at = Date.parse(date ?? '')
    if (!latest || at > latest.at) latest = { id, at }
  }
  return latest?.id ?? null
}

export const selectIsLearned =
  (id: StepId) =>
  (state: ProgressState): boolean =>
    state.learned[id] !== undefined

export const selectAnswers =
  (skill: SkillId) =>
  (state: ProgressState): readonly Answer[] =>
    state.answers[skill] ?? NO_ANSWERS

export const selectRating =
  (skill: SkillId) =>
  (state: ProgressState): Rating =>
    rate(selectAnswers(skill)(state))
