import type { Level } from '@/entities/path'
import type { PatternId } from '@/entities/pattern'
import type { PieceId } from '@/entities/piece'
import type { LocalText } from '@/shared/i18n'
import type {
  ChordQuality,
  Key,
  NumeralSize,
  ReferenceInterval,
  ScaleKind,
  SpelledNote,
  TensionChord,
} from '@/shared/lib/music'
import type { StaffId } from '@/shared/lib/notation'
import type { NoteLineMeter } from '@/shared/lib/schedule'

/** What a lesson teaches, as Learn filters lessons (roadmap §3.4, §10.7). */
export const LESSON_CATEGORIES = [
  'chords',
  'scales',
  'theory',
  'reading',
  'rhythm',
  'accompaniment',
  'jazz',
  'gospel',
] as const
export type LessonCategory = (typeof LESSON_CATEGORIES)[number]

/** Learn's groups of lessons, in the order they are listed (TJPS's shape, roadmap §10.7). */
export const LESSON_MODULES = ['fundamentals', 'accompaniment', 'gospel'] as const
export type LessonModule = (typeof LESSON_MODULES)[number]

/** A progression a lesson plays or opens in the tool: numerals in a key, triads when it names no size. */
export interface LessonProgression {
  /** As `parseNumerals` reads them: `ii V I`. */
  readonly numerals: string
  readonly key: Key
  readonly size?: NumeralSize
}

/** What a lesson's quiz asks to be played: a chord's notes, or notes, in any octave. */
export type QuizAnswer = { readonly chord: string } | { readonly notes: readonly string[] }

/** Where a lesson's link leads, by what it names; the lesson view makes it a route and its search. */
export type LessonLink =
  | { readonly place: 'chords'; readonly chord: string }
  | {
      readonly place: 'scales'
      readonly root: SpelledNote
      readonly scale: ScaleKind
      readonly show?: 'scale' | 'chords'
    }
  | { readonly place: 'keys'; readonly key: Key }
  | { readonly place: 'intervals'; readonly root?: SpelledNote }
  | { readonly place: 'tensions'; readonly chord: TensionChord; readonly root?: SpelledNote }
  | { readonly place: 'lesson'; readonly lesson: string }
  | ({ readonly place: 'progressions' } & LessonProgression)
  | {
      readonly place: 'passing-chords'
      readonly key: Key
      /** Chord symbols, as the tool's fields take them. */
      readonly from: string
      readonly to: string
    }
  | { readonly place: 'reharmonise'; readonly key: Key; readonly note: SpelledNote }
  /** A piece in the Player, with a pattern or its own. */
  | { readonly place: 'piece'; readonly piece: PieceId; readonly pattern?: PatternId }

/**
 * One part of a lesson's section: prose, numbered steps, a note to read; or an example that plays in
 * place (chords, one chord on all twelve roots, a scale, an interval, a line of notes on a staff, a
 * pattern over a piece, a progression in a key); a quiz answered on the keys; a link into a reference,
 * a tool or the Player.
 */
export type LessonBlock =
  | { readonly kind: 'text'; readonly lead?: LocalText; readonly text: LocalText }
  | { readonly kind: 'steps'; readonly steps: readonly LocalText[] }
  | { readonly kind: 'note'; readonly text: LocalText }
  | { readonly kind: 'chords'; readonly symbols: readonly string[] }
  | { readonly kind: 'grid'; readonly quality: ChordQuality }
  | { readonly kind: 'scale'; readonly root: SpelledNote; readonly scale: ScaleKind }
  | { readonly kind: 'interval'; readonly root: SpelledNote; readonly interval: ReferenceInterval }
  | {
      readonly kind: 'notes'
      readonly clef: StaffId
      /** `E4 G4/2 B4/8.`: `noteLine`'s format. */
      readonly notes: string
      readonly meter?: NoteLineMeter
      /** The key its signature writes; C major (none) when left out. */
      readonly key?: Key
    }
  /** A pattern heard over the piece its source teaches it on: a pattern is only heard on chords. */
  | { readonly kind: 'pattern'; readonly pattern: PatternId; readonly piece: PieceId }
  | ({ readonly kind: 'progression' } & LessonProgression)
  | { readonly kind: 'quiz'; readonly ask: LocalText; readonly answer: QuizAnswer }
  | { readonly kind: 'link'; readonly title: LocalText; readonly target: LessonLink }

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
  readonly module: LessonModule
  readonly sections: readonly LessonSection[]
}
