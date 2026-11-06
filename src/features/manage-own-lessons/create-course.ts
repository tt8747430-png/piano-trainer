import {
  MOST_OWN,
  OWN_COURSE_LOOK,
  ownCourseId,
  ownName,
  type OwnCourse,
  type OwnCourseId,
  type OwnLessonsStore,
} from '@/entities/own-lessons'

/** New course (R30-5): an empty course of this name, last in Your courses; null where none is made. */
export function createOwnCourse(store: OwnLessonsStore, name: string): OwnCourseId | null {
  const kept = ownName(name)
  const { courses, nextCourse } = store.getState()
  if (!kept || courses.length >= MOST_OWN) return null
  const id = ownCourseId(nextCourse)
  const course: OwnCourse = { id, title: kept, line: '', look: OWN_COURSE_LOOK, lessons: [] }
  store.setState({ courses: [...courses, course], nextCourse: nextCourse + 1 })
  return id
}
