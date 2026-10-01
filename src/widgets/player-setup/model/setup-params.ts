import type { LeftFigureId, PatternChoice, RightFigureId } from '@/entities/pattern'
import type { ChordSize, Inversion, KeyWalk, NoteParam } from '@/shared/lib/music'

/** The piece's own choices as the Player's URL holds them: an absent one is the piece's own. */
export interface SetupParams {
  readonly key?: NoteParam
  readonly pattern?: PatternChoice
  readonly rh?: RightFigureId
  readonly lh?: LeftFigureId
  readonly chordSize?: ChordSize
  /** The right hand's chord in this inversion every time; absent, each nearest the last. */
  readonly inversion?: Inversion
  /** A progression through the keys and home; absent, in its key alone. */
  readonly walk?: KeyWalk
}

/** What one control in the sheet changes; a field set to `undefined` goes back to the piece's own. */
export type SetupChange = Partial<SetupParams>

/** What a figure row changes; a hand's `undefined` goes back to the pattern's own, an inversion's to Nearest. */
export type FigureChange = Pick<SetupChange, 'pattern' | 'rh' | 'lh' | 'inversion'>
