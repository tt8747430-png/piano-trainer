import type { Accompaniment, PatternFit, PatternId } from '@/entities/pattern'
import type { ChordSize, Key, Numeral } from '@/shared/lib/music'

// What a progression in the Player is, apart from its chart, so the router's validators carry no
// arrangement into the first paint.

/**
 * A progression's own numerals, tempo, pattern and chord size: what the Player plays when its URL
 * chooses none; and what it has for a pattern: a key, no tune, no methods of its own.
 */
export const PROGRESSION = {
  numerals: 'I-V-vi-IV',
  tempo: 80,
  pattern: 'block',
  chordSize: 'triads',
  fit: { methodCodes: false, melody: false, key: true, simpleTime: true },
} as const satisfies {
  readonly numerals: string
  readonly tempo: number
  readonly pattern: PatternId
  readonly chordSize: ChordSize
  readonly fit: PatternFit
}

/** What the learner plays a progression with: the Player's URL, read. */
export interface ProgressionChoice extends Accompaniment {
  readonly numerals: readonly Numeral[]
  readonly key: Key
  readonly chordSize: ChordSize
}
