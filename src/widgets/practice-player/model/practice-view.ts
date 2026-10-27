import type { LoopParam, PracticeMode } from '@/features/practice'
import type { Hands, SwingFeel } from '@/shared/lib/schedule'

/** How the Player goes, as its URL holds it (spec §2.10): an absent tempo is the piece's own. */
export interface PracticeView {
  readonly mode: PracticeMode
  readonly tempo?: number
  readonly speedTraining: boolean
  readonly hands: Hands
  /** How much its 8ths swing (ADR 0115). */
  readonly swing: SwingFeel
  readonly loop?: LoopParam
  /**
   * The click for this visit, over the learner's saved one, which it leaves as it is: a song's
   * change in time opens with it on (ADR 0111). Never remembered.
   */
  readonly click?: boolean
  /**
   * The keys for this visit, over the View's: a pattern lesson opens them, each note lit as it
   * sounds whatever the view (ADR 0111). Never remembered.
   */
  readonly keys?: boolean
}
