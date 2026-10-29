import type { Lesson } from '@/entities/lesson'
import type { PieceId } from '@/entities/piece'
import { isStage, type Stage } from '@/entities/step'
import type { LocalText } from '@/shared/i18n'

/**
 * The shelves Courses lists, in order (ADR 0053): the beginner's and the intermediate's courses, the
 * technique courses, the courses on chords and improvising, then the method books.
 */
export const SHELVES = ['beginner', 'intermediate', 'technique', 'chords', 'method-books'] as const
export type Shelf = (typeof SHELVES)[number]

/**
 * A course (ADR 0053): a self-contained way through one subject, as the courses-app has it. It owns its
 * lessons, which no other course and no journey reads or links, and its guided songs, which no other
 * course has; a lesson of a course links only to its own songs and to Practice.
 */
export interface Course {
  readonly id: string
  readonly shelf: Shelf
  readonly stage: Stage
  readonly title: LocalText
  /** What the course teaches, in a sentence or two. */
  readonly summary: LocalText
  /** How long it takes at a lesson or two a week. */
  readonly weeks: number
  /** Its lessons in the order they are taught; each id unique in the course. */
  readonly lessons: readonly Lesson[]
  /** The songs that strengthen what it teaches, played in the Player. */
  readonly songs: readonly PieceId[]
}

/**
 * A course as the database keeps it (ADR 0116): its title, its summary and the ids of its lessons in
 * the order they are taught. A lesson's body is its own item, `<course>/<lesson>`.
 */
export interface CourseRecord {
  readonly id: string
  readonly title: LocalText
  readonly summary: LocalText
  /** Its lessons in order; a record without the list keeps the app's own. */
  readonly lessons?: readonly string[]
  /** Where Courses lists it, its level and its length: the app's own where it has them. */
  readonly shelf?: Shelf
  readonly stage?: Stage
  readonly weeks?: number
}

export const courseRecord = ({
  id,
  title,
  summary,
  lessons,
  shelf,
  stage,
  weeks,
}: Course): CourseRecord => ({
  id,
  title,
  summary,
  lessons: lessons.map((lesson) => lesson.id),
  shelf,
  stage,
  weeks,
})

const isShelf = (value: unknown): value is Shelf => SHELVES.some((shelf) => shelf === value)
/** How long a course may take, in weeks: the lengths an editor chooses from. */
export const COURSE_WEEKS: readonly number[] = Array.from({ length: 24 }, (_, i) => i + 1)

const isWeeks = (value: unknown): value is number =>
  typeof value === 'number' && COURSE_WEEKS.includes(value)

/** Text in both languages, blank or not. */
const isText = (value: unknown): value is LocalText => {
  if (typeof value !== 'object' || value === null) return false
  const { en, ru } = value as Partial<LocalText>
  return typeof en === 'string' && typeof ru === 'string'
}

/** Words in both languages, neither blank. */
const isWritten = (value: unknown): value is LocalText =>
  isText(value) && value.en.trim() !== '' && value.ru.trim() !== ''

const isIdList = (value: unknown): value is readonly string[] =>
  Array.isArray(value) && value.every((id) => typeof id === 'string' && id.trim() !== '')

/** Whether a body reads as a record of the course `id`, words missing or not: a draft of it. */
export function isCourseRecord(id: string, body: unknown): body is CourseRecord {
  if (typeof body !== 'object' || body === null) return false
  const record = body as Partial<CourseRecord>
  return (
    record.id === id &&
    isText(record.title) &&
    isText(record.summary) &&
    (record.lessons === undefined || isIdList(record.lessons)) &&
    (record.shelf === undefined || isShelf(record.shelf)) &&
    (record.stage === undefined || isStage(record.stage)) &&
    (record.weeks === undefined || isWeeks(record.weeks))
  )
}

/** A record that stands as a course of its own: one an editor made, with its shelf, stage and weeks. */
export type WholeCourseRecord = CourseRecord & {
  readonly lessons: readonly string[]
  readonly shelf: Shelf
  readonly stage: Stage
  readonly weeks: number
}

export const isWholeCourse = (record: CourseRecord): record is WholeCourseRecord =>
  record.lessons !== undefined &&
  record.shelf !== undefined &&
  record.stage !== undefined &&
  record.weeks !== undefined

/**
 * Whether a body from the database reads as a newer record of the course `id`: its title and summary,
 * each in both languages, and its lessons, when listed, a list of ids.
 */
export function updatesCourse(id: string, body: unknown): body is CourseRecord {
  if (typeof body !== 'object' || body === null) return false
  return isCourseRecord(id, body) && isWritten(body.title) && isWritten(body.summary)
}

/** A course an editor has only begun, as the device has it: no words, no lessons, no songs. */
export const blankCourse = (id: string): Course => ({
  id,
  shelf: 'beginner',
  stage: 'beginner',
  title: { en: '', ru: '' },
  summary: { en: '', ru: '' },
  weeks: 4,
  lessons: [],
  songs: [],
})
