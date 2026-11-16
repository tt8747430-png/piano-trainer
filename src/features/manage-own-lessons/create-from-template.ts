import {
  MOST_OWN,
  ownCourseId,
  ownLessonId,
  ownName,
  type OwnCourse,
  type OwnCourseId,
  type OwnCourseTemplate,
  type OwnLesson,
  type OwnLessonsStore,
} from '@/entities/own-lessons'
import { localText, type Locale } from '@/shared/i18n'

/**
 * New course from a template (New course › Start from): every lesson of the template copied whole into
 * Your lessons under the next numbers, then the course under the name given, its line in the learner's
 * language and the template's cover, holding those copies in order. All of it or nothing: null, and
 * nothing made, for a name not kept or where the copies would pass the most kept.
 */
export function createOwnCourseFrom(
  store: OwnLessonsStore,
  template: OwnCourseTemplate,
  name: string,
  locale: Locale,
): OwnCourseId | null {
  const kept = ownName(name)
  const { lessons, courses, nextLesson, nextCourse } = store.getState()
  if (!kept || courses.length >= MOST_OWN || lessons.length + template.lessons.length > MOST_OWN)
    return null
  const copies: OwnLesson[] = template.lessons.map((lesson, at) => {
    const { after: _after, ...rest } = lesson
    return { ...rest, id: ownLessonId(nextLesson + at) }
  })
  const id = ownCourseId(nextCourse)
  const course: OwnCourse = {
    id,
    title: kept,
    line: localText(template.line, locale),
    look: template.look,
    lessons: copies.map((copy) => copy.id),
  }
  store.setState({
    lessons: [...lessons, ...copies],
    courses: [...courses, course],
    nextLesson: nextLesson + copies.length,
    nextCourse: nextCourse + 1,
  })
  return id
}
