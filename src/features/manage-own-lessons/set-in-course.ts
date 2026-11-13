import { type OwnCourseId, type OwnLessonId, type OwnLessonsStore } from '@/entities/own-lessons'
import { saveOwnCourse } from './save-course'

/**
 * In courses (canvas 165): a lesson of the learner's put in one of their courses, last, or taken out
 * of it; the lesson itself stays. False where nothing changed.
 */
export function setInCourse(
  store: OwnLessonsStore,
  id: OwnCourseId,
  lessonId: OwnLessonId,
  inIt: boolean,
): boolean {
  const course = store.getState().courses.find((each) => each.id === id)
  if (!course || course.lessons.includes(lessonId) === inIt) return false
  const lessons = inIt
    ? [...course.lessons, lessonId]
    : course.lessons.filter((each) => each !== lessonId)
  return saveOwnCourse(store, { ...course, lessons })
}
