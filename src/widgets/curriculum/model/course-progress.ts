import { stepIdOf, stepsOf, type Course, type StepId } from '@/entities/course'

/** How much of a course is learned: its steps learned, of all its steps. */
export interface CourseProgress {
  readonly done: number
  readonly total: number
}

/** A course's steps learned, of all of them, by what the progress store has learned. */
export function courseProgress(
  course: Course,
  learned: Readonly<Partial<Record<StepId, string>>>,
): CourseProgress {
  const steps = stepsOf(course)
  return {
    done: steps.filter((step) => learned[stepIdOf(step)] !== undefined).length,
    total: steps.length,
  }
}

export const isComplete = ({ done, total }: CourseProgress): boolean => done === total
