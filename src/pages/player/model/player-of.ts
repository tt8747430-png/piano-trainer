import type { PatternFit } from '@/entities/pattern'
import type { Performance } from '@/shared/lib/arrangement'
import type { PracticePlayer } from '@/widgets/practice-player'

/** What a Player page's hook gives its page: the music as chosen, its Performance, the Player, and the Setup's change. */
export interface PlayerOf<Choice, Change> {
  readonly choice: Choice
  readonly performance: Performance
  readonly player: PracticePlayer
  changeSetup(change: Change): void
}

/** A Player that may walk its music through the keys: what its patterns can play, and its sections' names. */
export interface WalkingPlayerOf<Choice, Change> extends PlayerOf<Choice, Change> {
  readonly fit: PatternFit
  /** By section; while it walks, each key's name. */
  readonly headings: readonly string[]
}
