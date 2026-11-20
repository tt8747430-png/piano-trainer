import { readText } from '@/shared/lib'
import type { LearnEdit, OwnLibraryView } from '@/widgets/curriculum'
import { routeSearch, type Raw } from './read-search'

// A level's page and the Courses' page (canvas 163): whether an editor has it in Edit mode.
function readLearnEdit(raw: Raw): LearnEdit {
  // Edit mode (R29 B4): `edit=1` as a link writes it, `true` as the page does.
  return { edit: raw.edit === true || raw.edit === 1 || raw.edit === '1' }
}
const LEARN_EDIT_DEFAULTS: LearnEdit = { edit: false }
export const learnEditSearch = routeSearch(readLearnEdit, LEARN_EDIT_DEFAULTS)

/** A lesson's page (R30-5): the learner's course it is read in, where it is read in one. */
interface LessonSearch {
  readonly course?: string
}
const LESSON_DEFAULTS: LessonSearch = {}
const readLessonSearch = (raw: Raw): LessonSearch =>
  typeof raw.course === 'string' && raw.course !== '' ? { course: raw.course } : {}
export const lessonSearch = routeSearch(readLessonSearch, LESSON_DEFAULTS)

// Your lessons (canvas 165), a library as Practice's: what is searched, the kind shown, the order.
const YOURS_DEFAULTS: OwnLibraryView = { q: '', kind: 'all', sort: 'recent' }
export function readYoursSearch(raw: Raw): OwnLibraryView {
  return {
    q: readText(raw.q, YOURS_DEFAULTS.q),
    kind: raw.kind === 'lessons' || raw.kind === 'courses' ? raw.kind : YOURS_DEFAULTS.kind,
    sort: raw.sort === 'name' ? 'name' : YOURS_DEFAULTS.sort,
  }
}
/** What Your lessons remembers between visits: its order; the search and the kind are one visit's. */
export const YOURS_KEPT = ['sort'] as const satisfies readonly (keyof OwnLibraryView)[]
export const yoursSearch = routeSearch(readYoursSearch, YOURS_DEFAULTS)
