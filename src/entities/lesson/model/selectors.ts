import { LESSONS } from '../content'
import { LESSON_MODULES, type Lesson } from './types'

const LESSON_BY_ID = new Map(LESSONS.map((lesson) => [lesson.id, lesson]))

export const lessonById = (id: string): Lesson | undefined => LESSON_BY_ID.get(id)

/** The lessons in the order Learn lists them: module by module, each in its own order. */
const IN_ORDER = LESSON_MODULES.flatMap((module) =>
  LESSONS.filter((lesson) => lesson.module === module),
)

/** The lesson after this one as Learn lists them, into the next module at a module's end; none after the last. */
export const nextLesson = (id: string): Lesson | undefined => {
  const at = IN_ORDER.findIndex((lesson) => lesson.id === id)
  return at < 0 ? undefined : IN_ORDER[at + 1]
}
