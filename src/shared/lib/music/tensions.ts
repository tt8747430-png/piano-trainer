import { qualityIntervals, type ChordQuality } from './chord'
import { INTERVALS, type IntervalName, type LabelledInterval } from './interval'
import type { SpelledNote } from './note'
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
export function tensionTones(root: SpelledNote, quality: TensionChord): TensionTone[] {
  const own = qualityIntervals(quality).map((interval): TensionTone => ({
    ...toneAbove(root, interval),
    group: chordToneGroup(interval),
  }))
  const tensions = AVAILABLE[quality].map((name): TensionTone => ({
    ...toneAbove(root, INTERVALS[name]),
    group: 'tension',
  }))
  const taken = new Set([...own, ...tensions].map((tone) => tone.pitchClass))
  const avoid = OTHER.map((name) => toneAbove(root, INTERVALS[name]))
    .filter((tone) => !taken.has(tone.pitchClass))
    .map((tone): TensionTone => ({ ...tone, group: 'avoid' }))
  return [...own, ...tensions, ...avoid].sort((a, b) => (a.semitones % 12) - (b.semitones % 12))
}
