import { qualityIntervals, type ChordQuality } from './chord'
import { INTERVALS, type IntervalName, type LabelledInterval } from './interval'
import type { Key } from './key'
import { pitchClassOf, type SpelledNote } from './note'
import { pitchClass } from './pitch'
import { spellScale } from './scale'
import { toneAbove, type Tone } from './tone'

/**
 * The 7th chords the Available tensions explorer shows: the owner's table's (Maj7, m7, 7, m7♭5,
 * 7#5, m(maj7), 7sus4) and the two other 7th chords a scale stacks (+Maj7, °7).
 */
export const TENSION_CHORDS = [
  'maj7',
  'm7',
  'd7',
  'hd',
  's5',
  'mM7',
  'M7s5',
  'sus7',
  'o7',
] as const satisfies readonly ChordQuality[]
export type TensionChord = (typeof TENSION_CHORDS)[number]

/** The owner's table's four columns: weak, strong and jazz harmony, and the unacceptable notes. */
export const TENSION_GROUPS = ['weak', 'strong', 'tension', 'avoid'] as const
export type TensionGroup = (typeof TENSION_GROUPS)[number]

/** One note above a chord's root, in its group. */
export interface TensionTone extends Tone {
  readonly group: TensionGroup
}

/**
 * The notes each chord takes as colour, from chord-scale theory: the owner's table for Maj7, m7 and
 * 7; a whole step over each chord tone for °7.
 */
const AVAILABLE: Readonly<Record<TensionChord, readonly IntervalName[]>> = {
  maj7: ['M9', 'A11', 'M13'],
  m7: ['M9', 'P11', 'M13'],
  d7: ['m9', 'M9', 'A9', 'A11', 'm13', 'M13'],
  hd: ['M9', 'P11', 'm13'],
  s5: ['m9', 'M9', 'A9', 'A11'],
  mM7: ['M9', 'P11', 'M13'],
  M7s5: ['M9', 'A11'],
  sus7: ['m9', 'M9', 'M13'],
  o7: ['M9', 'P11', 'm13', 'M7'],
}

/** Every other note, as the degree its semitones make over the root: the 1st is ♭9, the 4th the 3rd. */
const OTHER: readonly IntervalName[] = [
  'r',
  'm9',
  'M9',
  'A9',
  'M3',
  'P11',
  'A11',
  'P5',
  'm13',
  'M13',
  'm7',
  'M7',
]

const isTensionChord = (quality: ChordQuality): quality is TensionChord =>
  TENSION_CHORDS.some((chord) => chord === quality)

/** The tensions a chord takes; none for a chord the explorer does not show (a triad, a 9th). */
export const availableTensions = (quality: ChordQuality): readonly LabelledInterval[] =>
  isTensionChord(quality) ? AVAILABLE[quality].map((name) => INTERVALS[name]) : []

/** A chord tone's group: the root and a perfect 5th weak, an altered 5th a tension, the rest strong. */
function chordToneGroup({ steps, semitones }: LabelledInterval): TensionGroup {
  if (semitones === 0) return 'weak'
  if (steps === 4) return semitones === 7 ? 'weak' : 'tension'
  return 'strong'
}

/**
 * All twelve notes above a chord's root, lowest first within the octave, each in its group: the
 * chord's own tones spelled as the chord spells them, its available tensions, and every other note
 * spelled as the degree its semitones make, to avoid.
 */
export function tensionTones(root: SpelledNote, quality: TensionChord, key?: Key): TensionTone[] {
  const own = qualityIntervals(quality).map((interval): TensionTone => ({
    ...toneAbove(root, interval),
    group: chordToneGroup(interval),
  }))
  const tensions = (key ? inKey(root, quality, key) : null) ?? {
    taken: AVAILABLE[quality].map((name) => INTERVALS[name]),
    avoided: [],
  }
  const coloured = [
    ...tensions.taken.map((interval): TensionTone => ({
      ...toneAbove(root, interval),
      group: 'tension',
    })),
    ...tensions.avoided.map((interval): TensionTone => ({
      ...toneAbove(root, interval),
      group: 'avoid',
    })),
  ]
  const taken = new Set([...own, ...coloured].map((tone) => tone.pitchClass))
  const avoid = OTHER.map((name) => toneAbove(root, INTERVALS[name]))
    .filter((tone) => !taken.has(tone.pitchClass))
    .map((tone): TensionTone => ({ ...tone, group: 'avoid' }))
  return [...own, ...coloured, ...avoid].sort((a, b) => (a.semitones % 12) - (b.semitones % 12))
}

/** The 9th, 11th and 13th a chord may take, each in its spellings. */
const UPPER: readonly (readonly IntervalName[])[] = [
  ['m9', 'M9', 'A9'],
  ['P11', 'A11'],
  ['m13', 'M13'],
]

/**
 * A chord's tensions as its degree in `key` makes them (A33, chord-scale theory): the key's own 9th,
 * 11th and 13th over its root, each avoided where it sits a half step over a chord tone (♭9 over
 * the root, 11 over a major 3rd, ♭13 over the 5th) or, over a minor 7th chord, where its 13th makes
 * a tritone with the 3rd. A dominant keeps its altered tensions in any key; a chord whose root is
 * not in the key has none of the key's (null).
 */
function inKey(
  root: SpelledNote,
  quality: TensionChord,
  key: Key,
): { taken: LabelledInterval[]; avoided: LabelledInterval[] } | null {
  if (quality === 'd7') return null
  const scale = new Set(
    spellScale(key.tonic, key.minor ? 'natural' : 'major').map((tone) => tone.pitchClass),
  )
  const base = pitchClassOf(root)
  if (!scale.has(base)) return null
  const chord = qualityIntervals(quality)
  const third = chord.find((interval) => interval.steps === 2)?.semitones
  const upper = UPPER.flatMap((names) =>
    names
      .map((name) => INTERVALS[name])
      .filter((interval) => scale.has(pitchClass(base + interval.semitones)))
      .slice(0, 1),
  )
  const avoided = (interval: LabelledInterval) =>
    chord.some((tone) => (interval.semitones - tone.semitones + 24) % 12 === 1) ||
    (quality === 'm7' &&
      interval.semitones >= 20 &&
      third !== undefined &&
      (interval.semitones - third) % 12 === 6)
  return {
    taken: upper.filter((interval) => !avoided(interval)),
    avoided: upper.filter(avoided),
  }
}
