import { isOneOf } from '@/shared/lib'
import { EXERCISES } from '../content/catalogue'
import {
  EXERCISE_IDS,
  isRuleExercise,
  type Exercise,
  type ExerciseGroup,
  type ExerciseId,
  type RuleExercise,
} from './types'

/** Whether a value names an exercise its own rule writes. */
export const isExerciseId = isOneOf(EXERCISE_IDS)

const RULES = new Map(
  EXERCISES.filter(isRuleExercise).map((exercise) => [exercise.id, exercise] as const),
)

/** The exercise a rule writes, by its id. */
export function ruleExercise(id: ExerciseId): RuleExercise {
  const exercise = RULES.get(id)
  if (!exercise) throw new RangeError(`No exercise ${id}`)
  return exercise
}

/** A group's exercises, in the catalogue's order. */
export const exercisesIn = (group: ExerciseGroup): readonly Exercise[] =>
  EXERCISES.filter((exercise) => exercise.group === group)
