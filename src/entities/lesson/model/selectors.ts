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

/** When a lesson was marked learned, as saved; none if it is not. */
export type LearnedOn = (lesson: Lesson) => string | undefined

/**
 * The lesson to go on with among `lessons`: the first not learned after the one learned last, along
 * its track; none where none of them is learned, or nothing after it is left.
 */
export function lessonAfterLast(
  lessons: readonly Lesson[],
  learnedOn: LearnedOn,
): Lesson | undefined {
  const last = lessons
    .flatMap((lesson) => {
      const date = learnedOn(lesson)
      return date === undefined ? [] : [{ lesson, date }]
    })
    .reduce<{ lesson: Lesson; date: string } | undefined>(
      (latest, each) => (latest === undefined || each.date > latest.date ? each : latest),
      undefined,
    )
  let next = last ? nextLesson(last.lesson.id) : undefined
  while (next && learnedOn(next) !== undefined) next = nextLesson(next.id)
  return next
}

/** The lesson to read next of all: on from the one learned last, else the first not learned. */
export const lessonUpNext = (learnedOn: LearnedOn): Lesson | undefined =>
  lessonAfterLast(LESSONS, learnedOn) ?? LESSONS.find((lesson) => learnedOn(lesson) === undefined)
