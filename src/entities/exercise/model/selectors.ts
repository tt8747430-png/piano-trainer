import { isOneOf } from '@/shared/lib'
import { EXERCISES } from '../content/catalogue'
import { EXERCISE_IDS, type Exercise, type ExerciseGroup, type ExerciseId } from './types'

/** Whether a value names an exercise. */
export const isExerciseId = isOneOf(EXERCISE_IDS)

const BY_ID = new Map(EXERCISES.map((exercise) => [exercise.id, exercise] as const))

/** An exercise by its id. */
export function exerciseOf(id: ExerciseId): Exercise {
  const exercise = BY_ID.get(id)
  if (!exercise) throw new RangeError(`No exercise ${id}`)
  return exercise
}

/** A group's exercises, in the catalogue's order. */
export const exercisesIn = (group: ExerciseGroup): readonly Exercise[] =>
  EXERCISES.filter((exercise) => exercise.group === group)
