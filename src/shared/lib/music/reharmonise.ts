import type { ChordQuality } from './chord'
import { buildChord, partsOf, type BuiltChord, type ChordParts } from './chord-parts'
import { INTERVALS, spellBelow, type IntervalName } from './interval'
import type { Key } from './key'
import { plainRoot, type SpelledNote } from './note'
import { tonesInKey } from './scale'

/** The owner's table's groups (roadmap §10.3), with the triads a hymn's melody note takes first. */
export const HOLDING_GROUPS = ['triads', 'major', 'minor', 'dominant'] as const
export type HoldingGroup = (typeof HOLDING_GROUPS)[number]

/** A chord that holds a melody note: the degree the note is in it, and whether the key has all its notes. */
export interface HoldingChord {
  readonly chord: BuiltChord
  readonly parts: ChordParts
  readonly degree: string
  readonly inKey: boolean
}

/** A chord of a group and the degrees a melody note may be in it. */
interface Holding {
  readonly parts: ChordParts
  readonly as: readonly IntervalName[]
}

const table = (quality: ChordQuality, as: readonly IntervalName[]): Holding => ({
  parts: partsOf(quality),
  as,
})
/** A 13th over a major or minor 7th: the builder's, since the table names only the dominant 13th. */
const thirteenth = (triad: 'maj' | 'min', as: readonly IntervalName[]): Holding => ({
  parts: {
    triad,
    size: 13,
    seventh: triad === 'maj' ? 'major' : 'minor',
    added: 'none',
    alterations: [],
  },
  as,
})

/**
 * The owner's table as roles: a major chord holds the note as its 3, 7, 9, #11 or 13; a minor one as
 * its ♭3, ♭7, 9, 11 or 13; a dominant 7th as its 3, ♭7, ♭9, 9, #9, #11, ♭13 or 13; and a triad as
 * its root, 3rd or 5th.
 */
const HOLDING: Readonly<Record<HoldingGroup, readonly Holding[]>> = {
  triads: [table('maj', ['r', 'M3', 'P5']), table('min', ['r', 'm3', 'P5'])],
  major: [
    table('maj7', ['M3', 'M7']),
    table('maj9', ['M9']),
    table('M7s11', ['A11']),
    thirteenth('maj', ['M13']),
  ],
  minor: [
    table('m7', ['m3', 'm7']),
    table('m9', ['M9']),
    table('m11', ['P11']),
    thirteenth('min', ['M13']),
  ],
  dominant: [
    table('d7', ['M3', 'm7']),
    table('b9', ['m9']),
    table('n9', ['M9']),
    table('s9', ['A9']),
    table('s11', ['A11']),
    table('b13', ['m13']),
    table('n13', ['M13']),
  ],
}

/**
 * The chords that hold a melody note, by group: each root spelled by letters down from the note, then
 * named plainly (A♭ as the 3rd of E, not F♭), each marked in the key when every tone is the key's.
 */
export function chordsHolding(
  melody: SpelledNote,
  key: Key,
): Readonly<Record<HoldingGroup, readonly HoldingChord[]>> {
  const holding = (group: HoldingGroup): HoldingChord[] =>
    HOLDING[group].flatMap(({ parts, as }) =>
      as.map((name) => {
        const interval = INTERVALS[name]
        const chord = buildChord(plainRoot(spellBelow(melody, interval)), parts)
        return {
          chord,
          parts,
          degree: interval.degree,
          inKey: tonesInKey(chord.tones, key),
        }
      }),
    )
  return {
    triads: holding('triads'),
    major: holding('major'),
    minor: holding('minor'),
    dominant: holding('dominant'),
  }
}
