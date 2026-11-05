import {
  ownName,
  ownTitle,
  type OwnCourseId,
  type OwnLessonId,
  type OwnLessonsStore,
} from '@/entities/own-lessons'
import { saveOwnLesson } from './save-lesson'
import { saveOwnCourse } from './save-course'

/** Rename: the lesson's title, in both languages; false for a name that is not kept. */
export function renameOwnLesson(store: OwnLessonsStore, id: OwnLessonId, name: string): boolean {
  const kept = ownName(name)
  const lesson = store.getState().lessons.find((each) => each.id === id)
  if (!kept || !lesson) return false
  return saveOwnLesson(store, { ...lesson, title: ownTitle(kept) })
}

/** Rename: the course's title; false for a name that is not kept. */
export function renameOwnCourse(store: OwnLessonsStore, id: OwnCourseId, name: string): boolean {
  const kept = ownName(name)
  const course = store.getState().courses.find((each) => each.id === id)
  return kept && course ? saveOwnCourse(store, { ...course, title: kept }) : false
}
