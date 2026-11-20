import type { OwnCourseId, OwnLessonId, OwnLessonsStore } from '@/entities/own-lessons'
import type { ProgressStore } from '@/entities/progress'
import { lessonStepId } from '@/entities/step'
import {
  deleteOwnCourse,
  deleteOwnLesson,
  restoreOwnCourse,
  restoreOwnLesson,
  type DeletedCourse,
  type DeletedLesson,
} from '@/features/manage-own-lessons'
import { resetSteps, restoreSteps } from '@/features/reset-progress'

/** What a delete took, and the Undo that puts every piece back where it stood. */
export interface DeletedOwn {
  readonly lessons: readonly DeletedLesson[]
  readonly courses: readonly DeletedCourse[]
  readonly undo: () => void
}

/**
 * Deletes the learner's lessons and courses at once (ADR 0053: a lesson goes with its progress; a
 * course's lessons stay). Each was taken from a list that shrank as the others went, so Undo puts
 * them back in the reverse order, each into the place it left.
 */
export function deleteOwn(
  store: OwnLessonsStore,
  progress: ProgressStore,
  ids: { readonly lessons?: readonly OwnLessonId[]; readonly courses?: readonly OwnCourseId[] },
): DeletedOwn | null {
  const courses = (ids.courses ?? []).flatMap((id) => deleteOwnCourse(store, id) ?? [])
  const lessons = (ids.lessons ?? []).flatMap((id) => deleteOwnLesson(store, id) ?? [])
  if (lessons.length + courses.length === 0) return null
  const forgotten = resetSteps(
    progress,
    lessons.map(({ lesson }) => lessonStepId(lesson.id)),
  )
  return {
    lessons,
    courses,
    undo: () => {
      for (const lesson of lessons.toReversed()) restoreOwnLesson(store, lesson)
      for (const course of courses.toReversed()) restoreOwnCourse(store, course)
      restoreSteps(progress, forgotten)
    },
  }
}
