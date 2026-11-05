import { type OwnCourseId, type OwnLessonId, type OwnLessonsStore } from '@/entities/own-lessons'

/** Delete: the lesson goes from Your lessons and from every course of the learner's that lists it. */
export function deleteOwnLesson(store: OwnLessonsStore, id: OwnLessonId): void {
  const { lessons, courses } = store.getState()
  store.setState({
    lessons: lessons.filter((each) => each.id !== id),
    courses: courses.map((course) =>
      course.lessons.includes(id)
        ? { ...course, lessons: course.lessons.filter((each) => each !== id) }
        : course,
    ),
  })
}

/** Delete: the course goes; its lessons stay, the learner's in Your lessons. */
export function deleteOwnCourse(store: OwnLessonsStore, id: OwnCourseId): void {
  store.setState({ courses: store.getState().courses.filter((each) => each.id !== id) })
}
