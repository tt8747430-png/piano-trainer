import { pathSteps, pieceStepId, stepById, type PlacedStep, type StepId } from '@/entities/path'
import type { PieceId } from '@/entities/piece'
import type { SkillId } from '@/shared/lib/music'
import { NO_ANSWERS, ratingOf, type Rating } from './mastery'
import type { Answer, ProgressState, QuizStats } from './types'

export const selectLearned = (state: ProgressState) => state.learned
export const selectPractised = (state: ProgressState) => state.practised
export const selectQuizStats = (state: ProgressState): QuizStats => state.quiz

export const selectAllAnswers = (state: ProgressState) => state.answers

/** The pieces opened in the Player, the most recent first. */
function practisedByRecency(practised: ProgressState['practised']): PieceId[] {
  return Object.entries(practised)
    .map(([id, date]) => ({ id, at: Date.parse(date ?? '') }))
    .sort((a, b) => b.at - a.at)
    .map(({ id }) => id)
}

/** The piece opened in the Player most recently, or null. */
export const selectLastPractised = (state: ProgressState): PieceId | null =>
  practisedByRecency(state.practised)[0] ?? null

/**
 * Continue (spec §5): the most recently practised piece still on the path, while it is not learned;
 * else the first unlearned step in path order; null when everything is learned.
 */
export function selectSuggestedStep(state: ProgressState): PlacedStep | null {
  const onPath = practisedByRecency(state.practised)
    .map((id) => stepById(pieceStepId(id)))
    .find((placed) => placed !== undefined)
  if (onPath && state.learned[onPath.id] === undefined) return onPath
  return pathSteps().find((placed) => state.learned[placed.id] === undefined) ?? null
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
    ratingOf(state.answers, skill)
