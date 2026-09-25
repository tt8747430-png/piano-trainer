import type { LeftFigureId, PatternId, RightFigureId } from '@/entities/pattern'
import type { Voicing } from '@/entities/piece'
import type { SpelledNote } from '@/shared/lib/music'

/** What the learner chose to practise a piece with: the Player's URL, read. */
export interface PracticeChoice {
  readonly tonic: SpelledNote
  /** A pattern for every chord, or the chart's own method codes. */
  readonly pattern: PatternId | 'chart'
  readonly rh: RightFigureId | null
  readonly lh: LeftFigureId | null
  /** Null plays the piece's own voicing. */
  readonly voicing: Voicing | null
  /** The melody switch: the tune an octave up too. */
  readonly melody: boolean
}
