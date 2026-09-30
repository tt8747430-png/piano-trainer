import type { LeftFigureId, PatternId, RightFigureId } from '@/entities/pattern'
import type { ChordSize } from '@/shared/lib/music'
import type { NoteParam } from '@/shared/lib/music'

/** The piece's own choices as the Player's URL holds them: an absent one is the piece's own. */
export interface SetupParams {
  readonly key?: NoteParam
  readonly pattern?: PatternId | 'chart'
  readonly rh?: RightFigureId
  readonly lh?: LeftFigureId
  readonly chordSize?: ChordSize
}

/** What one control in the sheet changes; a field set to `undefined` goes back to the piece's own. */
export type SetupChange = Partial<SetupParams>

/** A Player's pattern and hands' figures: the choices every source offers. */
export interface FigureChoice {
  readonly pattern: PatternId | 'chart'
  readonly rh: RightFigureId | null
  readonly lh: LeftFigureId | null
}

/** What a figure row changes; a hand's `undefined` goes back to the pattern's own. */
export type FigureChange = Pick<SetupChange, 'pattern' | 'rh' | 'lh'>
