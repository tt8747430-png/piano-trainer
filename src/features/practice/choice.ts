import type { AccompanimentChoice } from '@/entities/pattern'
import type { ChordSize, SpelledNote } from '@/shared/lib/music'

/** What the learner chose to practise a piece with: the Player's URL, read. */
export interface PracticeChoice extends AccompanimentChoice {
  readonly tonic: SpelledNote
  /** Null plays the piece's own chord size. */
  readonly chordSize: ChordSize | null
  /** The Tune switch: the tune, the top single staff, heard along with the hands (ADR 0097). */
  readonly tune: boolean
}
