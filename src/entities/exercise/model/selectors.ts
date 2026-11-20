import { isOneOf } from '@/shared/lib'
import { EXERCISES } from '../content/catalog'
import {
  EXERCISE_IDS,
  EXERCISE_SHELVES,
  SHELF_GROUPS,
  type Exercise,
  type ExerciseGroup,
  type ExerciseId,
  type ExerciseShelf,
} from './types'

/** Whether a value names an exercise. */
export const isExerciseId = isOneOf(EXERCISE_IDS)

const BY_ID = new Map(EXERCISES.map((exercise) => [exercise.id, exercise] as const))

/** An exercise by its id. */
export function exerciseOf(id: ExerciseId): Exercise {
  const exercise = BY_ID.get(id)
  if (!exercise) throw new RangeError(`No exercise ${id}`)
  return exercise
}

/** A group's exercises, in the catalog's order. */
export const exercisesIn = (group: ExerciseGroup): readonly Exercise[] =>
  EXERCISES.filter((exercise) => exercise.group === group)

/** Whether a value names a shelf. */
export const isExerciseShelf = isOneOf(EXERCISE_SHELVES)

/** The shelf a group stands on, where it has one (a scale's and a chord's open from their pages). */
export const shelfOf = (group: ExerciseGroup): ExerciseShelf | undefined =>
  EXERCISE_SHELVES.find((shelf) => SHELF_GROUPS[shelf].includes(group))

/** A shelf's exercises, source by source. */
export const exercisesOnShelf = (shelf: ExerciseShelf): readonly Exercise[] =>
  SHELF_GROUPS[shelf].flatMap(exercisesIn)
