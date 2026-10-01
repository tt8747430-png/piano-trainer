import type { Accompaniment, PatternFit, PatternId } from '@/entities/pattern'
import { isOneOf } from '@/shared/lib'
import { CHORD_QUALITIES, type ChordQuality, type SpelledNote } from '@/shared/lib/music'

// What a chromatic walk is, as its URL holds it: its chords, root and direction, and the walk's own
// choices. Apart from its chart, so the router's validators carry no arrangement into the first paint.

export const CHROMATIC_DIRECTIONS = ['up', 'down', 'both'] as const
export type ChromaticDirection = (typeof CHROMATIC_DIRECTIONS)[number]

/** At least one chord quality: a chromatic walk always walks a chord. */
export type ChromaticChords = readonly [ChordQuality, ...ChordQuality[]]

/**
 * The walk's own chords, direction, tempo and pattern: what the Player plays when its URL chooses
 * none; and what it has for a pattern: no key, no tune, no methods of its own.
 */
export const CHROMATIC = {
  chords: ['maj'],
  direction: 'up',
  tempo: 72,
  pattern: 'block',
  fit: { methodCodes: false, melody: false, key: false, simpleTime: true },
} as const satisfies {
  readonly chords: ChromaticChords
  readonly direction: ChromaticDirection
  readonly tempo: number
  readonly pattern: PatternId
  readonly fit: PatternFit
}

/** What the learner walks: the Player's URL, read. */
export interface ChromaticChoice extends Accompaniment {
  readonly root: SpelledNote
  readonly chords: ChromaticChords
  readonly direction: ChromaticDirection
}

const isQuality = isOneOf(CHORD_QUALITIES)

/** The chosen qualities in the table's order, each once. */
export const inTableOrder = (chords: readonly ChordQuality[]): ChordQuality[] =>
  CHORD_QUALITIES.filter((quality) => chords.includes(quality))

/** The URL's chords (`m9.maj9.n9`) read: known qualities, each once, in the table's order; none is the walk's own. */
export function readChords(value: unknown): ChromaticChords {
  const [first, ...rest] =
    typeof value === 'string' ? inTableOrder(value.split('.').filter(isQuality)) : []
  return first ? [first, ...rest] : CHROMATIC.chords
}

/** Chords as the URL writes them: the table's order, joined by `.`. */
export const chordsParam = (chords: readonly ChordQuality[]): string =>
  inTableOrder(chords).join('.')
