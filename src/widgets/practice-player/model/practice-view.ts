import type { LoopParam, PracticeMode } from '@/features/practice'
import type { Hands, SwingFeel } from '@/shared/lib/schedule'

/** What sounds between a loop's repeats (its board's Between repeats): nothing, a bar counted, a bar's rest. */
export const BETWEENS = ['none', 'countIn', 'rest'] as const
export type Between = (typeof BETWEENS)[number]

/** How the Player goes, as its URL holds it: an absent tempo is the piece's own. */
export interface PracticeView {
  readonly mode: PracticeMode
  readonly tempo?: number
  readonly speedTraining: boolean
  /** The tempo speed training climbs to, where not the piece's own (an exercise's Target tempo, A41). */
  readonly target?: number
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
  /** Beats of rest, each a click, before each repeat of a loop (ticks between loops); none without. */
  readonly rest?: number
  /** The rest silent, a bar to breathe in, where it would click (Between repeats: Rest). */
  readonly restSilent?: boolean
  /** How many times a loop plays before it stops; endless without. */
  readonly repeats?: number
}
