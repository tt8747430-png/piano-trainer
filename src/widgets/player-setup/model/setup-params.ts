import type { LeftFigureId, PatternChoice, RightFigureId } from '@/entities/pattern'
import type { ChordSize, Inversion, KeyWalk } from '@/shared/lib/music'

/** The clefs a single staff may be read in besides its own (Display's Clef). */
export const PLAYED_CLEFS = ['treble', 'bass'] as const
export type PlayedClef = (typeof PLAYED_CLEFS)[number]

/** The piece's own choices as the Player's URL holds them: an absent one is the piece's own. */
export interface SetupParams {
  /**
   * How far the music is moved, in semitones from the key it is written in (−5 to +6, R29 T): an
   * offset, so a song the editor rewrites in another key is still moved by the learner's choice.
   */
  readonly transpose?: number
  /** `false`: Transpose key signature off, the signature as written (R29 T); absent, it moves. */
  readonly tkey?: boolean
  /** `false`: Transpose chord symbols off, the symbols as written (R29 T); absent, they move. */
  readonly tchords?: boolean
  /** A single-staff song's staff in this clef (R29 B7, Display's Clef); absent, as written. */
  readonly clef?: PlayedClef
  readonly pattern?: PatternChoice
  readonly rh?: RightFigureId
  readonly lh?: LeftFigureId
  readonly chordSize?: ChordSize
  /** The right hand's first chord in this inversion; absent, in root position. */
  readonly inversion?: Inversion
  /** `false`: every chord in the first one's inversion; absent or `true`, each after it nearest the last. */
  readonly nearest?: boolean
  /** A progression through the keys and home; absent, in its key alone. */
  readonly walk?: KeyWalk
}

/** What one control in the sheet changes; a field set to `undefined` goes back to the piece's own. */
export type SetupChange = Partial<SetupParams>

/** What a figure row changes; a hand's `undefined` goes back to the pattern's own, an inversion's to root position. */
export type FigureChange = Pick<SetupChange, 'pattern' | 'rh' | 'lh' | 'inversion' | 'nearest'>
