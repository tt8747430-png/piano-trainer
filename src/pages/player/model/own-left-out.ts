import type { PatternId } from '@/entities/pattern'
import type { ChordSize } from '@/shared/lib/music'
import type { SetupChange } from '@/widgets/player-setup'

/** What a source plays when its URL chooses nothing: its own pattern, and its chord size where it has one. */
interface Own {
  readonly pattern: PatternId | 'chart'
  readonly chordSize?: ChordSize
}

/** A Setup change as a source's URL writes it: a pattern or chord size equal to the source's own is left out. */
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
