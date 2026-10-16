import type { PieceId } from '@/entities/piece'
import type { SkillId } from '@/shared/lib/music'
import { NO_ANSWERS } from './mastery'
import type { Answer, ProgressState, RunKey, TrainerRecord } from './types'
import type { StepId } from '@/entities/step'

export const selectLearned = (state: ProgressState) => state.learned
export const selectDays = (state: ProgressState) => state.days
export const selectPractised = (state: ProgressState) => state.practised
export const selectTrainerRecords = (state: ProgressState) => state.trainers

export const selectAllAnswers = (state: ProgressState) => state.answers

export const selectIsLearned =
  (id: StepId) =>
  (state: ProgressState): boolean =>
    state.learned[id] !== undefined

export const selectAnswers =
  (skill: SkillId) =>
  (state: ProgressState): readonly Answer[] =>
    state.answers[skill] ?? NO_ANSWERS

export const selectTrainerRecord =
  (key: RunKey) =>
  (state: ProgressState): TrainerRecord | undefined =>
    state.trainers[key]

/** The pieces opened in the Player, latest first. A new list each time: memoise it over `practised`. */
export function byLastOpened(practised: ProgressState['practised']): PieceId[] {
  return Object.entries(practised)
    .flatMap(([id, at]) => (at === undefined ? [] : [{ id, at: Date.parse(at) }]))
    .sort((a, b) => b.at - a.at)
    .map(({ id }) => id)
}
