import type { PieceId } from '@/entities/piece'

/**
 * A song's lesson as the progress keeps it (ADR 0100), by what was done: a chord of a piece played
 * in its sheet, or a pass finished in Wait mode over bars as played, numbered from 1 as the Player's
 * loop prints them. A section's lessons are worked out from the music; only these keys are kept.
 */
export type LessonKey = `${PieceId}:chord:${string}` | `${PieceId}:bars:${number}-${number}`

/** Bars as played, counted from 0: a loop's, or a section's. */
interface PlayedBars {
  readonly first: number
  readonly last: number
}

/** A chord of a piece, learned by playing it in its sheet. */
export const chordLessonKey = (pieceId: PieceId, symbol: string): LessonKey =>
  `${pieceId}:chord:${symbol}`

/**
 * A pass over bars as played, numbered as `loopParam` writes them: the one way a key is made, so
 * the Player that records a pass and the page that lists the lesson agree.
 */
export const barsLessonKey = (pieceId: PieceId, { first, last }: PlayedBars): LessonKey =>
  `${pieceId}:bars:${first + 1}-${last + 1}`

/** The longest key read back: a piece's id and a chord's symbol are short. */
const KEY_MAX = 100

const KEY = /^[^:\s]+:(?:chord:\S.*|bars:([1-9]\d*)-([1-9]\d*))$/

export function isLessonKey(key: string): key is LessonKey {
  const match = key.length <= KEY_MAX ? KEY.exec(key) : null
  if (!match) return false
  const [, first, last] = match
  return first === undefined || Number(first) <= Number(last)
}

/** How many lessons done are kept: the latest, more than every song in the books has. */
export const LESSONS_KEPT = 2000

type Lessons = Readonly<Partial<Record<LessonKey, string>>>

/** The lessons as they are kept: the latest LESSONS_KEPT by the date each was first done. */
export function keptLessons(lessons: Lessons): Lessons {
  const entries = Object.entries(lessons) as [LessonKey, string][]
  if (entries.length <= LESSONS_KEPT) return lessons
  const latest = entries
    .toSorted(([, a], [, b]) => Date.parse(b) - Date.parse(a))
    .slice(0, LESSONS_KEPT)
  return Object.fromEntries(latest)
}
