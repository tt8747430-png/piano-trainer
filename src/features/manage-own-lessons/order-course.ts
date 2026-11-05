import { type OwnCourseId, type OwnLessonsStore } from '@/entities/own-lessons'
import { saveOwnCourse } from './save-course'

/** Drags the course's lessons into a new order. */
export function orderCourseLessons(
  store: OwnLessonsStore,
  id: OwnCourseId,
  order: readonly string[],
): boolean {
  const course = store.getState().courses.find((each) => each.id === id)
  return course ? saveOwnCourse(store, { ...course, lessons: order }) : false
}
