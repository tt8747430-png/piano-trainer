import { METHOD_BOOK_IDS } from '@/entities/book'
import { isOneOf } from '@/shared/lib'
import type { ArpeggioQuality, ExerciseId } from '@/entities/exercise'
import type { Level } from '@/entities/path'
import type { PatternId } from '@/entities/pattern'
import type { PieceId } from '@/entities/piece'
import type { LocalText } from '@/shared/i18n'
import type {
  ChordQuality,
  Inversion,
  Key,
  KeyWalk,
  ChordSize,
  ReferenceInterval,
  ScaleKind,
  SpelledNote,
  TensionChord,
} from '@/shared/lib/music'
import type { StaffId } from '@/shared/lib/notation'
import type { NoteLineMeter, WrittenVoicing } from '@/shared/lib/schedule'

/** The modules that teach by subject: one track, read in turn (ADR 0042). */
export const SUBJECT_MODULES = ['fundamentals', 'accompaniment', 'gospel'] as const

/**
 * The courses: each a module that follows one teacher's material in its order, a track of its own:
 * each method book's (ADR 0042, 0043).
 */
export const COURSE_MODULES = METHOD_BOOK_IDS

/**
 * Learn's groups of lessons, in the order they are listed (TJPS's shape, roadmap §10.7): what is taught
 * by subject, then each course's own lessons.
 */
export const LESSON_MODULES = [...SUBJECT_MODULES, ...COURSE_MODULES] as const
export type LessonModule = (typeof LESSON_MODULES)[number]
export const isLessonModule = isOneOf(LESSON_MODULES)
export const isCourse = isOneOf(COURSE_MODULES)

/** Learn's two tabs: the subjects' modules, and the courses' (ADR 0042). */
export const LEARN_TABS = ['subjects', 'courses'] as const
export type LearnTab = (typeof LEARN_TABS)[number]
export const isLearnTab = isOneOf(LEARN_TABS)
export const TAB_MODULES: Readonly<Record<LearnTab, readonly LessonModule[]>> = {
  subjects: SUBJECT_MODULES,
  courses: COURSE_MODULES,
}
export const tabOf = (module: LessonModule): LearnTab => (isCourse(module) ? 'courses' : 'subjects')

/** A progression a lesson plays or opens on Progressions: numerals in a key, triads when it names no size. */
export interface LessonProgression {
  /** As `parseNumerals` reads them: `ii V I`. */
  readonly numerals: string
  readonly key: Key
  readonly size?: ChordSize
}

/**
 * What a lesson's quiz asks to be played: a chord's notes, or notes, in any octave; notes `rising`
 * are played in their order, each the first of its name above the last (an interval up, a run).
 */
export type LessonAnswer =
  { readonly chord: string } | { readonly notes: readonly string[]; readonly rising?: true }

/** Where a lesson's link leads, by what it names; the lesson view makes it a route and its search. */
export type LessonLink =
  | { readonly opens: 'chords'; readonly chord: string }
  | {
      readonly opens: 'scales'
      readonly root: SpelledNote
      readonly scale: ScaleKind
      readonly show?: 'scale' | 'chords'
    }
  | { readonly opens: 'keys'; readonly key: Key }
  | { readonly opens: 'intervals'; readonly root?: SpelledNote }
  | { readonly opens: 'tensions'; readonly chord: TensionChord; readonly root?: SpelledNote }
  | { readonly opens: 'lesson'; readonly lesson: string }
  | ({ readonly opens: 'progressions' } & LessonProgression)
  | {
      readonly opens: 'passing-chords'
      readonly key: Key
      /** Chord symbols, as the tool's fields take them. */
      readonly from: string
      readonly to: string
    }
  | { readonly opens: 'reharmonise'; readonly key: Key; readonly note: SpelledNote }
  /** A piece in the Player, with a pattern or its own. */
  | { readonly opens: 'piece'; readonly piece: PieceId; readonly pattern?: PatternId }
  /** An exercise in the Player, on a root and a chord where it takes them. */
  | {
      readonly opens: 'exercise'
      readonly exercise: ExerciseId
      readonly root?: SpelledNote
      readonly quality?: ArpeggioQuality
    }
  /** A progression in the Player, ready to practise: walked through the keys, in an inversion. */
  | ({ readonly opens: 'player' } & LessonProgression & {
        readonly walk?: KeyWalk
        readonly inversion?: Inversion
      })

/**
 * One part of a lesson's section: prose, numbered steps, a note to read; or an example that plays in
 * place (chords, one chord on all twelve roots, a scale, an interval, a line of notes on a staff,
 * voicings as written, a pattern over a piece, a progression in a key); a quiz answered on the keys; a link into an explorer,
 * a tool or the Player.
 */
export type LessonBlock =
  | { readonly kind: 'text'; readonly lead?: LocalText; readonly text: LocalText }
  | { readonly kind: 'steps'; readonly steps: readonly LocalText[] }
  | { readonly kind: 'note'; readonly text: LocalText }
  | {
      readonly kind: 'chords'
      readonly symbols: readonly string[]
      /**
       * Each chord on its own, in root position (a key's chords, to learn each shape); otherwise a
       * row of chords on two or more roots is played as a progression is, voice-led.
       */
      readonly apart?: true
      /** A melody note each chord holds, voiced close under it with the note on top (E over C Am Em). */
      readonly melody?: SpelledNote
    }
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
  /**
   * Voicings exactly as a sheet writes them, each hand's keys given (`D3 A♭3 | C4 F4`), on the grand
   * staff in a key (C major, every accidental written, when left out).
   */
  | {
      readonly kind: 'voicings'
      readonly voicings: readonly WrittenVoicing[]
      readonly key?: Key
    }
  /** A pattern heard over the piece its source teaches it on: a pattern is only heard on chords. */
  | { readonly kind: 'pattern'; readonly pattern: PatternId; readonly piece: PieceId }
  | ({ readonly kind: 'progression' } & LessonProgression)
  | { readonly kind: 'quiz'; readonly ask: LocalText; readonly answer: LessonAnswer }
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
  readonly module: LessonModule
  readonly sections: readonly LessonSection[]
}
