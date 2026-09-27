import type { Level } from '@/entities/path'
import type { LocalText } from '@/shared/i18n'

/** What a lesson teaches, as Learn will filter lessons (roadmap §3.4). */
export const LESSON_CATEGORIES = [
  'chords',
  'scales',
  'theory',
  'accompaniment',
  'jazz',
  'gospel',
] as const
export type LessonCategory = (typeof LESSON_CATEGORIES)[number]

/** One part of a lesson's section: prose, numbered steps, a note to read, or chords that play. */
export type LessonBlock =
  | { readonly kind: 'text'; readonly lead?: LocalText; readonly text: LocalText }
  | { readonly kind: 'steps'; readonly steps: readonly LocalText[] }
  | { readonly kind: 'note'; readonly text: LocalText }
  | { readonly kind: 'chords'; readonly symbols: readonly string[] }

export interface LessonSection {
  readonly heading: LocalText
  readonly blocks: readonly LessonBlock[]
}

/** A Learn page that teaches music, in both languages, with examples that play (content as code, ADR 0002). */
export interface Lesson {
  readonly id: string
  readonly title: LocalText
  readonly summary: LocalText
  /** On the Path's scale, so a lesson and a step say "Beginner" alike. */
  readonly level: Level
  readonly category: LessonCategory
  readonly sections: readonly LessonSection[]
}
