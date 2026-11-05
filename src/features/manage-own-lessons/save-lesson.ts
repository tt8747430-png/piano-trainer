import { type OwnLesson, type OwnLessonsStore } from '@/entities/own-lessons'

/** Keeps the lesson as written, in its place; false where it was deleted meanwhile (another tab's). */
export function saveOwnLesson(store: OwnLessonsStore, lesson: OwnLesson): boolean {
  const { lessons } = store.getState()
  if (!lessons.some((each) => each.id === lesson.id)) return false
  store.setState({ lessons: lessons.map((each) => (each.id === lesson.id ? lesson : each)) })
  return true
}
