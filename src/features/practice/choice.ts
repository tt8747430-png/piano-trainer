import type { AccompanimentChoice } from '@/entities/pattern'
import type { ChordSize, KeyWalk, SpelledNote } from '@/shared/lib/music'

/** What the learner chose to practise a piece with: the Player's URL, read. */
export interface PracticeChoice extends AccompanimentChoice {
  readonly tonic: SpelledNote
  /** Null plays the piece's own chord size. */
  readonly chordSize: ChordSize | null
  /** The melody switch: the tune an octave up too. */
  readonly melody: boolean
  /** A progression through the keys from `tonic` and home; `null` plays it in `tonic` alone. */
  readonly walk: KeyWalk | null
}
