import type { Performance } from '@/shared/lib/arrangement'
import type { PracticePlayer } from '@/widgets/practice-player'

/** What a Player page's hook gives its page: the music as chosen, its Performance, the Player, and the Setup's change. */
export interface PlayerOf<Choice, Change> {
  readonly choice: Choice
  readonly performance: Performance
  readonly player: PracticePlayer
  changeSetup(change: Change): void
}
