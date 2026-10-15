import { courseStepIds, type Course } from '@/entities/course'
import type { Journey, JourneyStep } from '@/entities/lesson'
import { stepIdOf, type StepId } from '@/entities/step'

export interface Progress {
  readonly done: number
  readonly total: number
}

type Learned = Readonly<Partial<Record<StepId, string>>>

const progressOf = (ids: readonly StepId[], learned: Learned): Progress => ({
  done: ids.filter((id) => learned[id] !== undefined).length,
  total: ids.length,
})

/** A journey's steps in the order they are taken, chapter by chapter. */
export const journeySteps = (journey: Journey): readonly JourneyStep[] =>
  journey.chapters.flatMap((chapter) => chapter.steps)

/** How much of a journey is learned: its lessons and its chapters' checks. */
export const journeyProgress = (journey: Journey, learned: Learned): Progress =>
  progressOf(journeySteps(journey).map(stepIdOf), learned)

/** How much of a course is learned: its lessons and its guided songs. */
export const courseProgress = (course: Course, learned: Learned): Progress =>
  progressOf(courseStepIds(course), learned)

export const isComplete = (progress: Progress): boolean =>
  progress.total > 0 && progress.done === progress.total
