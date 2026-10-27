import type { PieceId } from '@/entities/piece'

/**
 * A song's lesson as the progress keeps it (ADR 0111), by what was done: a chord of a piece played
 * in its sheet, or a pass finished in Wait mode over bars as played, numbered from 1 as the Player's
 * loop prints them. A section's lessons are worked out from the music; only these keys are kept.
 */
export type LessonKey = ChordLessonKey | `${PieceId}:bars:${number}-${number}`

/** A chord of a piece, learned by holding it in its sheet (ADR 0111). */
export type ChordLessonKey = `${PieceId}:chord:${string}`

/** How many times a chord is held, let go between, to learn it (ADR 0111, Chordify's three). */
export const CHORD_HOLDS = 3

/** Bars as played, counted from 0: a loop's, or a section's. */
interface PlayedBars {
  readonly first: number
  readonly last: number
}

/** A chord of a piece, learned by playing it in its sheet. */
export const chordLessonKey = (pieceId: PieceId, symbol: string): ChordLessonKey =>
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

/** Whether a lesson key is a chord's: the one kind of lesson its holds count towards. */
export const isChordLessonKey = (key: string): key is ChordLessonKey =>
  isLessonKey(key) && key.includes(':chord:')

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

type Holds = Readonly<Partial<Record<ChordLessonKey, number>>>

/** The chords' holds as they are kept: the latest LESSONS_KEPT counted, by when each was last held. */
export function keptHolds(holds: Holds): Holds {
  const entries = Object.entries(holds)
  return entries.length <= LESSONS_KEPT ? holds : Object.fromEntries(entries.slice(-LESSONS_KEPT))
}
