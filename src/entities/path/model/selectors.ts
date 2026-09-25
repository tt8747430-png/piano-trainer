import { PATH } from '../content/path'
import { LEVELS, stepIdOf, type Level, type PathStep, type StepId } from './types'

export interface PlacedStep {
  readonly id: StepId
  readonly level: Level
  readonly step: PathStep
}

const STEPS: readonly PlacedStep[] = LEVELS.flatMap((level) =>
  PATH[level].map((step) => ({ id: stepIdOf(step), level, step })),
)
const LEVEL_BY_ID = new Map(STEPS.map(({ id, level }) => [id, level]))

/** Every step, level by level, in path order; the same array on every call. */
export const pathSteps = (): readonly PlacedStep[] => STEPS

/** A step's level; undefined for a step the path no longer has. */
export const levelOf = (id: StepId): Level | undefined => LEVEL_BY_ID.get(id)
