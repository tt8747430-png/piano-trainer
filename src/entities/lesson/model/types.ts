import type { ArpeggioQuality, ExerciseId } from '@/entities/exercise'
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

/** A progression a lesson plays or opens on Progressions: numerals in a key, triads when it names no size. */
export interface LessonProgression {
  /** As `parseNumerals` reads them: `ii V I`. */
  readonly numerals: string
  readonly key: Key
  readonly size?: ChordSize
}

/**
 * What a lesson's question asks to be played: a chord's notes, or notes, in any octave; notes `rising`
 * are played in their order, each the first of its name above the last (an interval up, a run), and
 * notes `falling` each the first below the last (a line stepping down).
 */
export type LessonAnswer =
  | { readonly chord: string }
  | { readonly notes: readonly string[]; readonly rising?: true; readonly falling?: never }
  | { readonly notes: readonly string[]; readonly falling: true; readonly rising?: never }

/** Where a lesson's link leads, by what it names; the lesson view makes it a route and its search. */
export type LessonLink =
  | { readonly opens: 'chords'; readonly chord: string }
  | {
      readonly opens: 'scales'
      readonly root: SpelledNote
      readonly scale: ScaleKind
      readonly show?: 'scale' | 'chords'
    }
  | { readonly opens: 'key'; readonly key: Key }
  | { readonly opens: 'intervals'; readonly root?: SpelledNote }
  | { readonly opens: 'tensions'; readonly chord: TensionChord; readonly root?: SpelledNote }
  | { readonly opens: 'lesson'; readonly lesson: string }
  | ({ readonly opens: 'progressions' } & LessonProgression)
  /** Progressions' Between on two chords of a key: the passing chords from one to the other. */
  | {
      readonly opens: 'between'
      readonly key: Key
      /** Chord symbols, as a typed line takes them. */
      readonly from: string
      readonly to: string
    }
  /** The Key view harmonising a melody note in its key. */
  | { readonly opens: 'harmonise'; readonly key: Key; readonly note: SpelledNote }
  /** A song's chords on Progressions, read in their key: as typed, spaces between them. */
  | { readonly opens: 'song-chords'; readonly chords: string }
  /** A piece in the Player, with a pattern or its own. */
  | { readonly opens: 'piece'; readonly piece: PieceId; readonly pattern?: PatternId }
  /** An exercise in the Player, on a root, a chord and a scale where it takes them. */
  | {
      readonly opens: 'exercise'
      readonly exercise: ExerciseId
      readonly root?: SpelledNote
      readonly quality?: ArpeggioQuality
      /** The scale a scale exercise runs, where it takes one: a minor scale's form. */
      readonly kind?: ScaleKind
    }
  /** A Quiz trainer, by its id (the catalog's test holds it to one there is), to practise what was read. */
  | { readonly opens: 'quiz'; readonly trainer: string }
  /** A progression in the Player, ready to practise: walked through the keys, in an inversion. */
  | ({ readonly opens: 'player' } & LessonProgression & {
        readonly walk?: KeyWalk
        readonly inversion?: Inversion
      })

/**
 * One part of a lesson's section: prose, numbered steps, a note to read; or an example that plays in
 * place (chords, one chord on all twelve roots, a scale, an interval, a line of notes on a staff,
 * voicings as written, a pattern over a piece, a progression in a key); a question answered on the keys; a link into an explorer,
 * a tool or the Player.
 */
export type LessonBlock =
  | { readonly kind: 'text'; readonly lead?: LocalText; readonly text: LocalText }
  | { readonly kind: 'steps'; readonly steps: readonly LocalText[] }
  /** A note on sand; or, given its `rule`, a rule's card: the rule's name over what it says. */
  | { readonly kind: 'note'; readonly text: LocalText; readonly rule?: LocalText }
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
      /**
       * The left hand's line under it, played together: the two on one grand staff, as a piece
       * prints its hands (the `notes` then the right hand's, on the treble).
       */
      readonly bass?: string
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
      /** Four voices a chord, named S A T B beside the first chord and on the keys. */
      readonly satb?: true
    }
  /** A pattern heard over the piece its source teaches it on: a pattern is only heard on chords. */
  | { readonly kind: 'pattern'; readonly pattern: PatternId; readonly piece: PieceId }
  /**
   * A progression's row in a key, its chips each numeral over its function; or, `show: 'motion'`,
   * over how its root moved there, with the moves' legend and Play the chain.
   */
  | ({ readonly kind: 'progression'; readonly show?: 'motion' } & LessonProgression)
  /**
   * One example in versions, a chip each (a switch for two): choosing one redraws the example, its
   * chips and its caption in place.
   */
  | { readonly kind: 'variants'; readonly variants: readonly LessonVariant[] }
  | { readonly kind: 'question'; readonly ask: LocalText; readonly answer: LessonAnswer }
  | { readonly kind: 'link'; readonly title: LocalText; readonly target: LessonLink }

/** An example a variant draws: a progression's row, voicings as written, or chords. */
export type VariantExample = Extract<LessonBlock, { kind: 'progression' | 'voicings' | 'chords' }>

/**
 * A version of a variants block's example: its name on its chip, a caption naming its shape (`Falling
 * fifths · each copy a step lower`), a line saying more where it needs one, and the example.
 */
export interface LessonVariant {
  readonly label: LocalText
  readonly caption: LocalText
  readonly text?: LocalText
  readonly example: VariantExample
}

export interface LessonSection {
  readonly heading: LocalText
  readonly blocks: readonly LessonBlock[]
  /** The section in one sentence, on its card at the section's end. */
  readonly takeaway?: LocalText
}

/**
 * A Learn page that teaches music, in both languages, with examples that play (content as code, ADR
 * 0002): a journey's (its chapter places it) or a course's own (ADR 0053); it names neither.
 */
export interface Lesson {
  readonly id: string
  readonly title: LocalText
  readonly summary: LocalText
  readonly sections: readonly LessonSection[]
  /**
   * The lessons to read before it, by id: a journey's lessons for a journey's, its own course's for a
   * course's. Said in its contents and over the lesson ("After …").
   */
  readonly after?: readonly string[]
}
