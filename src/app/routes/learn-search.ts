import type { LearnEdit } from '@/widgets/curriculum'
import { routeSearch, type Raw } from './read-search'

// A level's page and the Courses' page (canvas 163): whether an editor has it in Edit mode.
export function readLearnEdit(raw: Raw): LearnEdit {
  // Edit mode (R29 B4): `edit=1` as a link writes it, `true` as the page does.
  return { edit: raw.edit === true || raw.edit === 1 || raw.edit === '1' }
}
const LEARN_EDIT_DEFAULTS: LearnEdit = { edit: false }
export const learnEditSearch = routeSearch(readLearnEdit, LEARN_EDIT_DEFAULTS)

/** A lesson's page (R30-5): the learner's course it is read in, where it is read in one. */
export interface LessonSearch {
  readonly course?: string
}
export const LESSON_DEFAULTS: LessonSearch = {}
const readLessonSearch = (raw: Raw): LessonSearch =>
  typeof raw.course === 'string' && raw.course !== '' ? { course: raw.course } : {}
export const lessonSearch = routeSearch(readLessonSearch, LESSON_DEFAULTS)
