import type { ChordQuality } from './chord'
import { buildChord, partsOf, type BuiltChord, type ChordParts } from './chord-parts'
import { INTERVALS, spellBelow, type IntervalName, type LabelledInterval } from './interval'
import type { Key } from './key'
import { plainRoot, type SpelledNote } from './note'
import { tonesInKey } from './scale'
import { availableTensions } from './tensions'

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
  readonly as: readonly LabelledInterval[]
}

const table = (quality: ChordQuality, as: readonly IntervalName[]): Holding => ({
  parts: partsOf(quality),
  as: as.map((name) => INTERVALS[name]),
})
/** A 13th over a major or minor 7th: the builder's, since the table names only the dominant 13th. */
const thirteenth = (triad: 'maj' | 'min'): ChordParts => ({
  triad,
  size: 13,
  seventh: triad === 'maj' ? 'major' : 'minor',
  added: 'none',
  alterations: [],
})

type HoldingSeventh = 'maj7' | 'm7' | 'd7'

/** The chord that shows each tension a 7th chord takes: a 9th, 11th or 13th chord. */
const SHOWN_BY: Readonly<Record<HoldingSeventh, Readonly<Record<string, ChordParts>>>> = {
  maj7: {
    [INTERVALS.M9.degree]: partsOf('maj9'),
    [INTERVALS.A11.degree]: partsOf('M7s11'),
    [INTERVALS.M13.degree]: thirteenth('maj'),
  },
  m7: {
    [INTERVALS.M9.degree]: partsOf('m9'),
    [INTERVALS.P11.degree]: partsOf('m11'),
    [INTERVALS.M13.degree]: thirteenth('min'),
  },
  d7: {
    [INTERVALS.m9.degree]: partsOf('b9'),
    [INTERVALS.M9.degree]: partsOf('n9'),
    [INTERVALS.A9.degree]: partsOf('s9'),
    [INTERVALS.A11.degree]: partsOf('s11'),
    [INTERVALS.m13.degree]: partsOf('b13'),
    [INTERVALS.M13.degree]: partsOf('n13'),
  },
}

/** A 7th chord holding the note as its 3rd or 7th, then each tension it takes (`tensions.ts`'s). */
function seventhHolding(seventh: HoldingSeventh, tones: readonly IntervalName[]): Holding[] {
  return [
    table(seventh, tones),
    ...availableTensions(seventh).map((tension) => {
      const parts = SHOWN_BY[seventh][tension.degree]
      if (!parts) throw new RangeError(`No chord shows ${seventh}'s ${tension.degree}`)
      return { parts, as: [tension] }
    }),
  ]
}

/**
 * The owner's table as roles: a major chord holds the note as its 3, 7 or any tension a Maj7 takes;
 * a minor one as its ♭3, ♭7 or a m7's tensions; a dominant 7th as its 3, ♭7 or a 7's tensions; and a
 * triad as its root, 3rd or 5th.
 */
const HOLDING: Readonly<Record<HoldingGroup, readonly Holding[]>> = {
  triads: [table('maj', ['r', 'M3', 'P5']), table('min', ['r', 'm3', 'P5'])],
  major: seventhHolding('maj7', ['M3', 'M7']),
  minor: seventhHolding('m7', ['m3', 'm7']),
  dominant: seventhHolding('d7', ['M3', 'm7']),
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
      as.map((interval) => {
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
