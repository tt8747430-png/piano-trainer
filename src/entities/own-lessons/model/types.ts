import { FOLDER_PAINTS, isFolderPicture, type FolderLook } from '@/entities/library'
import type { Lesson } from '@/entities/lesson'
import type { LocalText } from '@/shared/i18n'
import { isOneOf, isRecord } from '@/shared/lib'

/** A lesson the learner wrote (R30-5): `own-lesson-` and its number, never given twice. */
export type OwnLessonId = `own-lesson-${number}`
/** A course the learner put together: `own-course-` and its number, never given twice. */
export type OwnCourseId = `own-course-${number}`

/** A lesson of the learner's own: the same document as the app's, under its own id. */
export type OwnLesson = Lesson & { readonly id: OwnLessonId }

/**
 * A course of the learner's own (R30-5): its title, a line on what it is for, its cover (a picture on
 * a paint, as a Songs folder wears), and its lessons in order, by id: their own, and the app's
 * journey lessons added by reference, which stay the app's.
 */
export interface OwnCourse {
  readonly id: OwnCourseId
  readonly title: string
  readonly line: string
  readonly look: FolderLook
  readonly lessons: readonly string[]
}

/** The longest name a lesson or a course of the learner's takes. */
export const OWN_NAME_MAX = 80
/** The longest line under an own course's title. */
export const OWN_LINE_MAX = 200
/** The most lessons, and the most courses, the learner keeps. */
export const MOST_OWN = 200

/** A new course's cover until the learner chooses one. */
export const OWN_COURSE_LOOK: FolderLook = { picture: 'book', paint: 'sky' }

const OWN_LESSON = /^own-lesson-[1-9]\d*$/
const OWN_COURSE = /^own-course-[1-9]\d*$/

export const isOwnLessonId = (value: unknown): value is OwnLessonId =>
  typeof value === 'string' && OWN_LESSON.test(value)
export const isOwnCourseId = (value: unknown): value is OwnCourseId =>
  typeof value === 'string' && OWN_COURSE.test(value)

export const ownLessonId = (number: number): OwnLessonId => `own-lesson-${number}`
export const ownCourseId = (number: number): OwnCourseId => `own-course-${number}`

/** The number an own id carries. */
export const ownNumber = (id: OwnLessonId | OwnCourseId): number =>
  Number(id.slice(id.lastIndexOf('-') + 1))

/** A name as kept: trimmed, 1 to 80 characters; null for one that is not. */
export function ownName(name: string): string | null {
  const kept = name.trim()
  return kept.length > 0 && kept.length <= OWN_NAME_MAX ? kept : null
}

const isPaint = isOneOf(FOLDER_PAINTS)

/** A saved cover as kept: its picture and paint where both are the folders', else the default. */
export function ownLook(value: unknown): FolderLook {
  if (!isRecord(value)) return OWN_COURSE_LOOK
  const { picture, paint } = value
  return isFolderPicture(picture) && isPaint(paint) ? { picture, paint } : OWN_COURSE_LOOK
}

/** An own lesson's title in both languages: the learner names it once, and it reads in either. */
export const ownTitle = (name: string): LocalText => ({ en: name, ru: name })
