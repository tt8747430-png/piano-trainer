import type { SpelledNote } from './note'
import type { Midi } from './pitch'

/** What is played on a note: shortened, stressed, held. Several may join (an accent over a staccato). */
export const ARTICULATIONS = [
  'staccato',
  'staccatissimo',
  'accent',
  'tenuto',
  'marcato',
  'fermata',
] as const
export type Articulation = (typeof ARTICULATIONS)[number]

/** What decorates a note: a trill, mordents, a turn, a tremolo. One at a time. */
export const ORNAMENTS = ['trill', 'mordent', 'lower-mordent', 'turn', 'tremolo'] as const
export type Ornament = (typeof ORNAMENTS)[number]

/** How loud, softest first: each holds from its note until the next. */
export const DYNAMICS = ['pp', 'p', 'mp', 'mf', 'f', 'ff'] as const
export type Dynamic = (typeof DYNAMICS)[number]

/** An octave line: `8va` writes notes an octave below where they sound, `8vb` an octave above. */
export const OCTAVE_LINES = ['8va', '8vb'] as const
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

/** The sustain pedal at a note: pressed, let up, or let up and pressed again. */
export const PEDALS = ['down', 'up', 'change'] as const
export type Pedal = (typeof PEDALS)[number]

/** A grace note: struck just before its note, taking none of its time. */
export interface GraceNote {
  readonly midi: Midi
  readonly spelled: SpelledNote
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
  readonly dynamic?: Dynamic
  readonly hairpin?: Hairpin
  readonly expression?: Expression
  readonly pedal?: Pedal
  readonly grace?: readonly GraceNote[]
}

/** Semitones a note is written from where it sounds under its octave line. */
export const writtenShift = (marks: NoteMarks | undefined): number =>
  marks?.octave === '8va' ? -12 : marks?.octave === '8vb' ? 12 : 0

/** Whether a note carries no mark at all. */
export const hasMarks = (marks: NoteMarks | undefined): marks is NoteMarks =>
  marks !== undefined && Object.keys(marks).length > 0
