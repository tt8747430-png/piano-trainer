import { LESSONS } from '../content'
import { isCourse, LESSON_MODULES, SUBJECT_MODULES, type Lesson, type LessonModule } from './types'

const LESSON_BY_ID = new Map(LESSONS.map((lesson) => [lesson.id, lesson]))

export const lessonById = (id: string): Lesson | undefined => LESSON_BY_ID.get(id)

/** A module's lessons in the order they are taught. */
export const lessonsIn = (module: LessonModule): readonly Lesson[] =>
  LESSONS.filter((lesson) => lesson.module === module)

/** What a lesson is read among (ADR 0042): its course alone, or the subjects' modules in turn. */
const trackOf = (module: LessonModule): readonly Lesson[] =>
  isCourse(module) ? lessonsIn(module) : SUBJECT_MODULES.flatMap(lessonsIn)

const TRACKS = new Map(LESSON_MODULES.map((module) => [module, trackOf(module)]))

/** The lesson after this one along its track: into the next subject at a module's end, never past a course. */
export function nextLesson(id: string): Lesson | undefined {
  const lesson = lessonById(id)
  const track = lesson ? (TRACKS.get(lesson.module) ?? []) : []
  const at = track.findIndex((each) => each.id === id)
  return at < 0 ? undefined : track[at + 1]
}
