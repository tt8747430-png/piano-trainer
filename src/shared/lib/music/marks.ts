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

/** A grace note: struck just before its note, taking none of its time. */
export interface GraceNote {
  readonly midi: Midi
  readonly spelled: SpelledNote
}

/** What is written on a note besides its pitch and time (ADR 0063); its pitch is the one it sounds. */
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
  readonly grace?: readonly GraceNote[]
}

/** Semitones a note is written from where it sounds under its octave line. */
export const writtenShift = (marks: NoteMarks | undefined): number =>
  marks?.octave === '8va' ? -12 : marks?.octave === '8vb' ? 12 : 0

/** Whether a note carries no mark at all. */
export const hasMarks = (marks: NoteMarks | undefined): marks is NoteMarks =>
  marks !== undefined && Object.keys(marks).length > 0
