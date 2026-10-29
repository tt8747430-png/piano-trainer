import type { Lesson } from '@/entities/lesson'
import type { PieceId } from '@/entities/piece'
import type { Stage } from '@/entities/step'
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

/** A course's own texts as the database keeps them (ADR 0116, round 12): its title and summary. */
export interface CourseTexts {
  readonly id: string
  readonly title: LocalText
  readonly summary: LocalText
}

export const courseTexts = ({ id, title, summary }: Course): CourseTexts => ({ id, title, summary })

/** Words in both languages, neither blank. */
const isWritten = (value: unknown): value is LocalText => {
  if (typeof value !== 'object' || value === null) return false
  const { en, ru } = value as Partial<LocalText>
  return typeof en === 'string' && typeof ru === 'string' && en.trim() !== '' && ru.trim() !== ''
}

/** Whether a body from the database reads as newer texts of the course `id`: its title and summary, each in both languages. */
export function updatesCourse(id: string, body: unknown): body is CourseTexts {
  if (typeof body !== 'object' || body === null) return false
  const texts = body as Partial<CourseTexts>
  return texts.id === id && isWritten(texts.title) && isWritten(texts.summary)
}
