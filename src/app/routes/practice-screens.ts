import type { StepId } from '@/entities/step'
import { checkPlan } from '@/features/trainer'

export { isTrainerId, ownTrainerView, trainerOf } from '@/features/trainer'
export { isExerciseId } from '@/entities/exercise'
export { CheckPage } from '@/pages/check'
export { ExercisePage } from '@/pages/exercise'
export { ExercisesPage } from '@/pages/exercises'
export { PracticePage } from '@/pages/practice'
export { TrainerPage } from '@/pages/trainer'

/** Whether a Check has questions: a journey's chapter's chord family or scale. */
export const checkIn = (of: StepId) => checkPlan(of) !== null
