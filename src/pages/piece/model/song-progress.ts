import { sectionCount, type Piece } from '@/entities/piece'
import { lessonsDone, type LessonKey, type ProgressState } from '@/entities/progress'

/** How many of some lessons are done, of all of them: each key counted once. */
export interface LessonProgress {
  readonly done: number
  readonly total: number
}

type Lessons = ProgressState['lessons']

export function progressOf(keys: readonly LessonKey[], lessons: Lessons): LessonProgress {
  const each = [...new Set(keys)]
  return { done: lessonsDone(lessons, each), total: each.length }
}

/** A section's index from its route's param, counted from 1; none for one the piece has not. */
export function sectionIndex(piece: Piece, param: string): number | null {
  const number = /^[1-9]\d{0,3}$/.test(param) ? Number(param) : 0
  return number >= 1 && number <= sectionCount(piece) ? number - 1 : null
}
