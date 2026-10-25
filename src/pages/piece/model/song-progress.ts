import { sectionCount, type Piece } from '@/entities/piece'
import { lessonsDone, type LessonKey, type ProgressState } from '@/entities/progress'
import { lessonKeys, type SectionLessons } from './section-lessons'

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

/** A song's progress (spec §3.3): its sections' lessons together, a key two sections share once. */
export const songProgress = (
  sections: readonly (SectionLessons | null)[],
  lessons: Lessons,
): LessonProgress =>
  progressOf(
    sections.flatMap((each) => (each ? lessonKeys(each) : [])),
    lessons,
  )

/**
 * Where the song's page sends the learner (spec §3.1): to start at the first section with lessons,
 * on to the first with one not yet done, or, every lesson done, to play it through. None for a song
 * with nothing to learn (no chord symbols).
 */
export type NextStep =
  { readonly kind: 'start' | 'next'; readonly section: number } | { readonly kind: 'done' }

export function nextStep(
  sections: readonly (SectionLessons | null)[],
  lessons: Lessons,
): NextStep | null {
  const { done, total } = songProgress(sections, lessons)
  if (total === 0) return null
  if (done === total) return { kind: 'done' }
  const section = sections.findIndex(
    (each) => each !== null && lessonKeys(each).some((key) => lessons[key] === undefined),
  )
  return { kind: done === 0 ? 'start' : 'next', section }
}

/** A section's index from its route's param, counted from 1; none for one the piece has not. */
export function sectionIndex(piece: Piece, param: string): number | null {
  const number = /^[1-9]\d{0,3}$/.test(param) ? Number(param) : 0
  return number >= 1 && number <= sectionCount(piece) ? number - 1 : null
}
