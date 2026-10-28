import type { SpelledNote } from './note'
import type { Midi } from './pitch'

/**
 * What is played on a note: shortened, stressed, held, detached (portato); a breath mark or a caesura
 * after it, a short silence before the next. Several may join (an accent over a staccato).
 */
export const ARTICULATIONS = [
  'staccato',
  'staccatissimo',
  'accent',
  'tenuto',
  'portato',
  'marcato',
  'fermata',
  'breath',
  'caesura',
] as const
export type Articulation = (typeof ARTICULATIONS)[number]

/**
 * What decorates a note: a trill, mordents, a turn and an inverted one, a tremolo of one to three
 * strokes (the note repeated in 8ths, 16ths or 32nds). One at a time.
 */
export const ORNAMENTS = [
  'trill',
  'mordent',
  'lower-mordent',
  'turn',
  'inverted-turn',
  'tremolo-1',
  'tremolo-2',
  'tremolo-3',
] as const
export type Ornament = (typeof ORNAMENTS)[number]
/** A tremolo's strokes: one to three, its 8ths', 16ths' or 32nds' beams. */
export const TREMOLO_STROKES = [1, 2, 3] as const
export type TremoloStrokes = (typeof TREMOLO_STROKES)[number]

/** A tremolo's strokes: each halves the notes it repeats, an 8th's to a 32nd's. */
export const tremoloStrokes = (ornament: Ornament | undefined): TremoloStrokes | null =>
  ornament === 'tremolo-1' ? 1 : ornament === 'tremolo-2' ? 2 : ornament === 'tremolo-3' ? 3 : null

/** How loud, softest first: each holds from its note until the next (Flat's ppp to fff). */
export const LEVELS = ['ppp', 'pp', 'p', 'mp', 'mf', 'f', 'ff', 'fff'] as const
/**
 * A note struck harder than the level around it (sforzando, forzando, rinforzando), or struck at one
 * level and held at another (forte-piano, sforzando-piano, piano-forte).
 */
export const ACCENTS = ['sf', 'sfz', 'sffz', 'fz', 'rf', 'rfz', 'fp', 'sfp', 'sfpp', 'pf'] as const
/** Every dynamic, as Flat's Dynamics offer them: the levels, then the accents. */
export const DYNAMICS = [...LEVELS, ...ACCENTS] as const
export type Dynamic = (typeof DYNAMICS)[number]

/**
 * An octave line: `8va` writes notes an octave below where they sound, `8vb` an octave above, `15ma`
 * and `15mb` two octaves.
 */
export const OCTAVE_LINES = ['8va', '8vb', '15ma', '15mb'] as const
export type OctaveLine = (typeof OCTAVE_LINES)[number]

/** A hairpin from its note: getting louder or softer to its end, or its end. */
export const HAIRPINS = ['cresc', 'dim', 'end'] as const
export type Hairpin = (typeof HAIRPINS)[number]

/**
 * Words written over a note: how it is played (dolce, cantabile, espressivo, legato, leggiero), and
 * the tempo from it, held back (rit., rall.), pressed on (accel.) or back to its own (a tempo).
 */
export const EXPRESSIONS = [
  'dolce',
  'cantabile',
  'espressivo',
  'legato',
  'leggiero',
  'rit',
  'rall',
  'accel',
  'a-tempo',
] as const
export type Expression = (typeof EXPRESSIONS)[number]
/** Each expression as a score prints it, in italics. */
export const EXPRESSION_TEXT: Readonly<Record<Expression, string>> = {
  dolce: 'dolce',
  cantabile: 'cantabile',
  espressivo: 'espress.',
  legato: 'legato',
  leggiero: 'leggiero',
  rit: 'rit.',
  rall: 'rall.',
  accel: 'accel.',
  'a-tempo': 'a tempo',
}

/** A swing mark: the 8ths or the 16ths swung from its note on, or straight again. */
export const SWING_MARKS = ['eighths', 'sixteenths', 'straight'] as const
export type SwingMark = (typeof SWING_MARKS)[number]
/** Each swing mark as a score prints it: the word, and the notes it swings. */
export const SWING_TEXT: Readonly<Record<SwingMark, string>> = {
  eighths: 'Swing \u{1D160}\u{1D160}',
  sixteenths: 'Swing \u{1D161}\u{1D161}',
  straight: 'Straight',
}

/** The sustain pedal at a note: pressed, let up, or let up and pressed again. */
export const PEDALS = ['down', 'up', 'change'] as const
export type Pedal = (typeof PEDALS)[number]

/**
 * A grace note: struck just before its note, taking none of its time. An acciaccatura, its stem
 * slashed, as written by default; an appoggiatura (`appoggiatura`) unslashed, leaning on its note.
 */
export interface GraceNote {
  readonly midi: Midi
  readonly spelled: SpelledNote
  readonly appoggiatura?: true
}

/** What is written on a note besides its pitch and time (ADR 0097); its pitch is the one it sounds. */
export interface NoteMarks {
  readonly articulations?: readonly Articulation[]
  readonly ornament?: Ornament
  /** Its chord rolled, low to high. */
  readonly arpeggio?: true
  readonly slurStart?: true
  readonly slurEnd?: true
  readonly octave?: OctaveLine
  /** A glissando from it to the next note on its staff. */
  readonly glissando?: true
  /**
   * A two-note tremolo of one to three strokes: it alternates with the next note on its staff until
   * that note's end, the pair written each as long as both (ADR 0097).
   */
  readonly twoNoteTremolo?: TremoloStrokes
  readonly dynamic?: Dynamic
  readonly hairpin?: Hairpin
  readonly expression?: Expression
  readonly pedal?: Pedal
  readonly grace?: readonly GraceNote[]
  /** A tempo mark from it on (ADR 0097): the song's beats a minute, printed in its tempo's unit. */
  readonly tempo?: number
  /** Swing from it on: its 8ths or 16ths played long-short, or straight again (Flat's swing marks). */
  readonly swing?: SwingMark
  /** Roman numeral text under the bass staff, as the numerals kernel writes it (`V7`, `ii6`). */
  readonly numeral?: string
  /** Free text over the staff, as the learner typed it. */
  readonly text?: string
}

/** Semitones a note is written from where it sounds under each octave line. */
const OCTAVE_SHIFT: Readonly<Record<OctaveLine, number>> = {
  '8va': -12,
  '8vb': 12,
  '15ma': -24,
  '15mb': 24,
}

/** Semitones a note is written from where it sounds under its octave line. */
export const writtenShift = (marks: NoteMarks | undefined): number =>
  marks?.octave ? OCTAVE_SHIFT[marks.octave] : 0

/** Whether a note carries no mark at all. */
export const hasMarks = (marks: NoteMarks | undefined): marks is NoteMarks =>
  marks !== undefined && Object.keys(marks).length > 0
