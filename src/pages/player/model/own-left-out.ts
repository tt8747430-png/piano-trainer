import type { PatternChoice } from '@/entities/pattern'
import type { ChordSize } from '@/shared/lib/music'
import type { SetupChange } from '@/widgets/player-setup'

/** What the music plays when its URL chooses nothing: its own pattern, and its chord size where it has one. */
interface Own {
  readonly pattern: PatternChoice
  readonly chordSize?: ChordSize
}

/** A Setup change as the Player's URL writes it: a pattern or chord size equal to the music's own is left out. */
export function ownLeftOut<C extends SetupChange>(change: C, own: Own): C {
  return {
    ...change,
    ...('pattern' in change
      ? { pattern: change.pattern === own.pattern ? undefined : change.pattern }
      : {}),
    ...('chordSize' in change
      ? { chordSize: change.chordSize === own.chordSize ? undefined : change.chordSize }
      : {}),
  }
}
