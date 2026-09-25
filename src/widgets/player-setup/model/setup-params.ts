import type { LeftFigureId, PatternId, RightFigureId } from '@/entities/pattern'
import type { Voicing } from '@/entities/piece'
import type { NoteParam } from '@/shared/lib/music'
import type { Hands } from '@/shared/lib/schedule'

/** The Setup sheet's choices as the Player's URL holds them: an absent one is the piece's own. */
export interface SetupParams {
  readonly key?: NoteParam
  readonly tempo?: number
  readonly hands: Hands
  readonly pattern?: PatternId | 'chart'
  readonly rh?: RightFigureId
  readonly lh?: LeftFigureId
  readonly voicing?: Voicing
}

/** What one control in the sheet changes; a field set to `undefined` goes back to the piece's own. */
export type SetupChange = Partial<SetupParams>
