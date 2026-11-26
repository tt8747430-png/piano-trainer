import type { FolderLook } from '@/entities/library'
import type { Lesson } from '@/entities/lesson'
import type { LocalText } from '@/shared/i18n'

/**
 * A course the app hands the learner to start from (New course › Start from): its name and line in
 * both languages, its cover, and its lessons whole. Starting from it copies every lesson into Your
 * lessons under new ids, and the course into Your courses, both the learner's to change.
 */
export interface OwnCourseTemplate {
  readonly id: string
  readonly title: LocalText
  readonly line: LocalText
  readonly look: FolderLook
  readonly lessons: readonly Lesson[]
}
