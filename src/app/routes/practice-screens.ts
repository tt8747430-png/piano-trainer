import { repertoire, type PiecesState } from '@/entities/piece'
import type { StepId } from '@/entities/step'
import { checkPlan } from '@/features/trainer'

export { isTrainerId, ownTrainerView, trainerOf } from '@/features/trainer'
export { CheckPage } from '@/pages/check'
export { ExercisesPage } from '@/pages/exercises'
export { PracticePage } from '@/pages/practice'
export { QuizPage } from '@/pages/quiz'
export { TrainerPage } from '@/pages/trainer'

/** Whether a Check has questions: a piece's as the learner plays it, their version or own song. */
export const checkIn = (state: PiecesState, of: StepId) =>
  checkPlan(of, undefined, repertoire(state).piece) !== null
