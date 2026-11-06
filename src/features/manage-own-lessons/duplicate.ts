import {
  MOST_OWN,
  ownCourseId,
  ownLessonId,
  ownName,
  ownTitle,
  type OwnCourse,
  type OwnCourseId,
  type OwnLesson,
  type OwnLessonId,
  type OwnLessonsStore,
} from '@/entities/own-lessons'

/**
 * Duplicate: the lesson whole under a new id and the name given, just after it. Hands back the copy's
 * id; null where the lesson is gone, the name is not kept or the most are kept.
 */
export function duplicateOwnLesson(
  store: OwnLessonsStore,
  id: OwnLessonId,
  name: string,
): OwnLessonId | null {
  const kept = ownName(name)
  const { lessons, nextLesson } = store.getState()
  const at = lessons.findIndex((each) => each.id === id)
  const lesson = lessons[at]
  if (!kept || !lesson || lessons.length >= MOST_OWN) return null
  const copy: OwnLesson = { ...lesson, id: ownLessonId(nextLesson), title: ownTitle(kept) }
  store.setState({
    lessons: [...lessons.slice(0, at + 1), copy, ...lessons.slice(at + 1)],
    nextLesson: nextLesson + 1,
  })
  return copy.id
}

/** Duplicate: the course whole (its lessons by the same reference) under the name given, after it. */
export function duplicateOwnCourse(
  store: OwnLessonsStore,
  id: OwnCourseId,
  name: string,
): OwnCourseId | null {
  const kept = ownName(name)
  const { courses, nextCourse } = store.getState()
  const at = courses.findIndex((each) => each.id === id)
  const course = courses[at]
  if (!kept || !course || courses.length >= MOST_OWN) return null
  const copy: OwnCourse = { ...course, id: ownCourseId(nextCourse), title: kept }
  store.setState({
    courses: [...courses.slice(0, at + 1), copy, ...courses.slice(at + 1)],
    nextCourse: nextCourse + 1,
  })
  return copy.id
}
