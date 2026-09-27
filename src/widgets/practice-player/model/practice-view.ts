import type { LoopParam, PracticeMode } from '@/features/practice'
import type { Hands } from '@/shared/lib/schedule'

/** How the Player goes, as its URL holds it (spec §2.10): an absent tempo is the piece's own. */
export interface PracticeView {
  readonly mode: PracticeMode
  readonly tempo?: number
  readonly speedTraining: boolean
  readonly hands: Hands
  readonly swing: boolean
  readonly loop?: LoopParam
}
