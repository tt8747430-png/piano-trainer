import type { PracticePageId } from '@/widgets/practice-pages'

/** At most this many cards under Up next: one row on a laptop. */
export const UP_NEXT_MOST = 3

/**
 * One card of Practice's Up next (R32): what the learner's own record says is next, or, before there
 * is any, where to start.
 */
export type UpNextCard =
  /** Skills the Quiz has found unsure, waiting in My gaps. */
  | { readonly kind: 'review'; readonly count: number }
  /** The exercise last played through, and the day it was. */
  | { readonly kind: 'exercise'; readonly id: string; readonly day: string }
  /** The Practice page last opened. */
  | { readonly kind: 'page'; readonly page: PracticePageId }
  /** A first exercise, for a learner with nothing practised yet. */
  | { readonly kind: 'firstExercise'; readonly id: string }
  /** Chords, the first page a new learner opens. */
  | { readonly kind: 'firstPage'; readonly page: PracticePageId }

/** The page a card stands for, so a page is never offered twice. */
const pageOf = (card: UpNextCard): PracticePageId | null =>
  card.kind === 'review'
    ? 'quiz'
    : card.kind === 'exercise' || card.kind === 'firstExercise'
      ? 'exercises'
      : card.page

/**
 * Practice's Up next (R32), from the learner's record, most pressing first: the skills due for review,
 * the exercise last played through, then the Practice page last opened (one the cards before do not
 * already stand for). With none of these, Start here: the first exercise and Chords.
 */
export function upNext({
  gaps,
  exercised,
  recent,
  firstExercise,
}: {
  /** How many skills My gaps holds. */
  gaps: number
  /** Each exercise's last day played through (`2026-11-03`). */
  exercised: Readonly<Partial<Record<string, string>>>
  /** The Practice pages opened, the latest first. */
  recent: readonly PracticePageId[]
  /** The exercise a new learner starts with. */
  firstExercise: string | undefined
}): readonly UpNextCard[] {
  const cards: UpNextCard[] = []
  if (gaps > 0) cards.push({ kind: 'review', count: gaps })
  const last = Object.entries(exercised)
    .flatMap(([id, day]) => (day ? [{ id, day }] : []))
    .toSorted((a, b) => b.day.localeCompare(a.day) || a.id.localeCompare(b.id))[0]
  if (last) cards.push({ kind: 'exercise', ...last })
  const taken = new Set(cards.map(pageOf))
  const page = recent.find((each) => !taken.has(each))
  if (page) cards.push({ kind: 'page', page })
  if (cards.length > 0) return cards.slice(0, UP_NEXT_MOST)
  return [
    ...(firstExercise ? [{ kind: 'firstExercise' as const, id: firstExercise }] : []),
    { kind: 'firstPage', page: 'chords' },
  ]
}
