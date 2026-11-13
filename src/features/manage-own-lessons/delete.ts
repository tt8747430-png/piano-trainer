import {
  type OwnCourse,
  type OwnCourseId,
  type OwnLesson,
  type OwnLessonId,
  type OwnLessonsStore,
} from '@/entities/own-lessons'

/** A lesson deleted: it, where it stood in Your lessons, and where it stood in each course that listed it. */
export interface DeletedLesson {
  readonly lesson: OwnLesson
  readonly at: number
  readonly inCourses: readonly { readonly course: OwnCourseId; readonly at: number }[]
}

/** A course deleted: it and where it stood in Your courses. */
export interface DeletedCourse {
  readonly course: OwnCourse
  readonly at: number
}

/** Delete: the lesson goes from Your lessons and from every course of the learner's that lists it. */
export function deleteOwnLesson(store: OwnLessonsStore, id: OwnLessonId): DeletedLesson | null {
  const { lessons, courses } = store.getState()
  const at = lessons.findIndex((each) => each.id === id)
  const lesson = lessons[at]
  if (!lesson) return null
  const inCourses = courses.flatMap((course) => {
    const index = course.lessons.indexOf(id)
    return index < 0 ? [] : [{ course: course.id, at: index }]
  })
  store.setState({
    lessons: lessons.filter((each) => each.id !== id),
    courses: courses.map((course) =>
      course.lessons.includes(id)
        ? { ...course, lessons: course.lessons.filter((each) => each !== id) }
        : course,
    ),
  })
  return { lesson, at, inCourses }
}

/** Undo: the lesson back in its place, and in each course that still exists, where it stood. */
export function restoreOwnLesson(store: OwnLessonsStore, deleted: DeletedLesson): void {
  const { lessons, courses } = store.getState()
  if (lessons.some((each) => each.id === deleted.lesson.id)) return
  store.setState({
    lessons: lessons.toSpliced(Math.min(deleted.at, lessons.length), 0, deleted.lesson),
    courses: courses.map((course) => {
      const was = deleted.inCourses.find((each) => each.course === course.id)
      return was
        ? {
            ...course,
            lessons: course.lessons.toSpliced(
              Math.min(was.at, course.lessons.length),
              0,
              deleted.lesson.id,
            ),
          }
        : course
    }),
  })
}

/** Delete: the course goes; its lessons stay, the learner's in Your lessons. */
export function deleteOwnCourse(store: OwnLessonsStore, id: OwnCourseId): DeletedCourse | null {
  const { courses } = store.getState()
  const at = courses.findIndex((each) => each.id === id)
  const course = courses[at]
  if (!course) return null
  store.setState({ courses: courses.filter((each) => each.id !== id) })
  return { course, at }
}

/** Undo: the course back in its place, with those of its lessons that still exist. */
export function restoreOwnCourse(store: OwnLessonsStore, deleted: DeletedCourse): void {
  const { lessons, courses } = store.getState()
  if (courses.some((each) => each.id === deleted.course.id)) return
  const kept = new Set<string>(lessons.map((each) => each.id))
  const course = {
    ...deleted.course,
    lessons: deleted.course.lessons.filter((each) => kept.has(each)),
  }
  store.setState({ courses: courses.toSpliced(Math.min(deleted.at, courses.length), 0, course) })
}
