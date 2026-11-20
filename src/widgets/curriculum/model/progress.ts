import { isLearned } from '@/entities/progress'
import type { Course } from '@/entities/course'
import type { Journey, JourneyStep } from '@/entities/lesson'
import { courseLessonStepId, stepIdOf, type StepId } from '@/entities/step'

export interface Progress {
  readonly done: number
  readonly total: number
}

type Learned = Readonly<Partial<Record<StepId, string>>>

const progressOf = (ids: readonly StepId[], learned: Learned): Progress => ({
  done: ids.filter((id) => isLearned(learned, id)).length,
  total: ids.length,
})

/** A journey's steps in the order they are taken, chapter by chapter. */
export const journeySteps = (journey: Journey): readonly JourneyStep[] =>
  journey.chapters.flatMap((chapter) => chapter.steps)

/** How much of a journey is learned: its lessons and its chapters' checks. */
export const journeyProgress = (journey: Journey, learned: Learned): Progress =>
  progressOf(journeySteps(journey).map(stepIdOf), learned)

/**
 * How much of a course is learned: its lessons, as its lesson count and the Course board's "3 of 8
 * learned" say; its guided songs are on its page, not in the count.
 */
export const courseProgress = (course: Course, learned: Learned): Progress =>
  progressOf(
    course.lessons.map((lesson) => courseLessonStepId(course.id, lesson.id)),
    learned,
  )

/**
 * How much of a lesson is read, 0 to 1: its sections read of all it has; the whole of it once it is
 * learned.
 */
export function lessonShare(
  sections: number,
  read: readonly number[] | undefined,
  learned: boolean,
): number {
  if (learned) return 1
  if (sections === 0) return 0
  return (read ?? []).filter((section) => section < sections).length / sections
}

export const isComplete = (progress: Progress): boolean =>
  progress.total > 0 && progress.done === progress.total
