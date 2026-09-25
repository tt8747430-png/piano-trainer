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
const BY_ID = new Map(STEPS.map((placed) => [placed.id, placed]))

/** Every step, level by level, in path order; the same array on every call. */
export const pathSteps = (): readonly PlacedStep[] => STEPS

/** A step on the path; undefined for a step the path no longer has. */
export const stepById = (id: StepId): PlacedStep | undefined => BY_ID.get(id)

/** A step's level; undefined for a step the path no longer has. */
export const levelOf = (id: StepId): Level | undefined => BY_ID.get(id)?.level
