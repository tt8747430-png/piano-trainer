import { lessonById, type Lesson } from '@/entities/lesson'
import type { OwnLessonsState } from './store'
import {
  isOwnLessonId,
  type OwnCourse,
  type OwnCourseId,
  type OwnLesson,
  type OwnLessonId,
} from './types'

/** The learner's lessons, in the order made: Your lessons. */
export const selectOwnLessons = (state: OwnLessonsState): readonly OwnLesson[] => state.lessons

/** The learner's lesson with this id, while it is there. */
export const selectOwnLesson =
  (id: string) =>
  (state: OwnLessonsState): OwnLesson | undefined =>
    state.lessons.find((lesson) => lesson.id === id)

/** The learner's courses, in the order made: Your courses. */
export const selectOwnCourses = (state: OwnLessonsState): readonly OwnCourse[] => state.courses

/** The learner's course with this id, while it is there. */
export const selectOwnCourse =
  (id: string) =>
  (state: OwnLessonsState): OwnCourse | undefined =>
    state.courses.find((course) => course.id === id)

/** A lesson as an own course lists it: the lesson, and whether it is the learner's or the app's. */
export interface CourseLesson {
  readonly lesson: Lesson
  readonly own: boolean
}

/**
 * An own course's lessons that are there, in its order: each own one from the learner's, each of the
 * app's from the app's journeys (one the app no longer has passed over).
 */
export function ownCourseLessons(
  course: OwnCourse,
  lessons: readonly OwnLesson[],
): readonly CourseLesson[] {
  const own = new Map<string, OwnLesson>(lessons.map((lesson) => [lesson.id, lesson]))
  return course.lessons.flatMap((id): CourseLesson[] => {
    const lesson = isOwnLessonId(id) ? own.get(id) : lessonById(id)
    return lesson ? [{ lesson, own: isOwnLessonId(id) }] : []
  })
}

/** The learner's courses that list this lesson. */
export const coursesWith = (
  state: OwnLessonsState,
  lessonId: OwnLessonId | string,
): readonly OwnCourseId[] =>
  state.courses.filter((course) => course.lessons.includes(lessonId)).map((course) => course.id)
