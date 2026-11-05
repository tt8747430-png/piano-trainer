import {
  isOwnLessonId,
  OWN_LINE_MAX,
  ownName,
  type OwnCourse,
  type OwnLessonsStore,
} from '@/entities/own-lessons'

/**
 * Keeps the course as edited, in its place: its title (where it is kept), its line, its cover, and
 * its lessons in order, each once, an own lesson only while it is there. False where it was deleted
 * meanwhile.
 */
export function saveOwnCourse(store: OwnLessonsStore, course: OwnCourse): boolean {
  const { courses, lessons } = store.getState()
  const was = courses.find((each) => each.id === course.id)
  if (!was) return false
  const own = new Set<string>(lessons.map((lesson) => lesson.id))
  const kept: OwnCourse = {
    ...course,
    title: ownName(course.title) ?? was.title,
    line: course.line.slice(0, OWN_LINE_MAX),
    lessons: [...new Set(course.lessons)].filter((id) => !isOwnLessonId(id) || own.has(id)),
  }
  store.setState({ courses: courses.map((each) => (each.id === course.id ? kept : each)) })
  return true
}
