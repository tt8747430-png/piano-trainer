import type { FolderLook } from '@/entities/library'
import type { OwnCourseId, OwnLessonsStore } from '@/entities/own-lessons'
import { saveOwnCourse } from './save-course'

/** A course's cover: its picture and paint, chosen on its Settings page; false for a course not kept. */
export function setOwnCourseLook(
  store: OwnLessonsStore,
  id: OwnCourseId,
  look: FolderLook,
): boolean {
  const course = store.getState().courses.find((each) => each.id === id)
  return course ? saveOwnCourse(store, { ...course, look }) : false
}
