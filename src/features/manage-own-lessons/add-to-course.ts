import { type OwnCourseId, type OwnLessonsStore } from '@/entities/own-lessons'
import { saveOwnCourse } from './save-course'

/** Add lesson: a lesson, the learner's or the app's by reference, last in the course, once. */
export function addToCourse(store: OwnLessonsStore, id: OwnCourseId, lessonId: string): boolean {
  const course = store.getState().courses.find((each) => each.id === id)
  if (!course || course.lessons.includes(lessonId)) return false
  return saveOwnCourse(store, { ...course, lessons: [...course.lessons, lessonId] })
}
