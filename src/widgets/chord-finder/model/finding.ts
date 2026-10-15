import {
  nameChords,
  note,
  noteName,
  pitchClass,
  spanInterval,
  spellInKey,
  type FoundChord,
  type Key,
  type Midi,
  type ReferenceInterval,
  type SpelledNote,
  type Tone,
} from '@/shared/lib/music'
import type { KeyMark } from '@/shared/ui'

/**
 * What the keys make (ADR 0054): nothing yet, one note, two notes as an interval (a 5th also as its
 * power chord), a chord by every name it reads as, best first, or no chord.
 */
export type Finding =
  | { readonly kind: 'empty' }
  | { readonly kind: 'note'; readonly note: SpelledNote }
  | {
      readonly kind: 'interval'
      readonly interval: ReferenceInterval
      /** A perfect 5th over its lower note is a power chord: `C5`. */
      readonly power?: string
    }
  | { readonly kind: 'chord'; readonly readings: readonly [FoundChord, ...FoundChord[]] }
  | { readonly kind: 'none' }

/** The compound intervals a chord symbol names (♭9 … 13), by their span in semitones. */
const COMPOUND: ReadonlyMap<number, ReferenceInterval> = new Map([
  [13, 'm9'],
  [14, 'M9'],
  [15, 'A9'],
  [17, 'P11'],
  [18, 'A11'],
  [20, 'm13'],
  [21, 'M13'],
])

/**
 * The keys named, spelled as `key` writes them: one note (in octaves too) its note; two notes their
 * interval from the lowest up, compound past the octave where a chord symbol names one, a perfect 5th
 * also its power chord; three or more every chord they read as, best first, else no chord.
 */
export function findChord(keys: readonly Midi[], key: Key): Finding {
  const lowest = keys.length === 0 ? null : Math.min(...keys)
  if (lowest === null) return { kind: 'empty' }
  const classes = new Set(keys.map((each) => pitchClass(each)))
  if (classes.size === 1) return { kind: 'note', note: spellInKey(pitchClass(lowest), key) }
  if (classes.size === 2) {
    const upper = Math.min(...keys.filter((each) => pitchClass(each) !== pitchClass(lowest)))
    const span = upper - lowest
    const interval = COMPOUND.get(span) ?? spanInterval(span)
    return interval === 'P5'
      ? { kind: 'interval', interval, power: `${noteName(spellInKey(pitchClass(lowest), key))}5` }
      : { kind: 'interval', interval }
  }
  const [best, ...others] = nameChords(keys, key)
  return best ? { kind: 'chord', readings: [best, ...others] } : { kind: 'none' }
}

/** Whether the keys name a chord: three notes or more that read as one, or a power chord. */
export function namesChord(keys: readonly Midi[]): boolean {
  const kind = findChord(keys, C_MAJOR)
  return kind.kind === 'chord' || (kind.kind === 'interval' && kind.power !== undefined)
}

/** Any key: whether keys name a chord is not a matter of how they are spelled. */
const C_MAJOR: Key = { tonic: note('C'), minor: false }

/** The tone of a reading a key plays. */
export const toneOfKey = (found: FoundChord, key: Midi): Tone | undefined =>
  found.chord.tones.find((tone) => tone.pitchClass === pitchClass(key))

/** Each key of a reading, marked by its role and degree in it. */
export function readingMarks(found: FoundChord, keys: readonly Midi[]): Map<Midi, KeyMark> {
  const marks = new Map<Midi, KeyMark>()
  for (const key of keys) {
    const tone = toneOfKey(found, key)
    if (tone) marks.set(key, { tone: tone.role, label: tone.degree })
  }
  return marks
}

/** The reading chosen, by its place among a chord's names; the best where it has no such place. */
export const readingAt = (
  readings: readonly [FoundChord, ...FoundChord[]],
  at: number,
): FoundChord => readings[at] ?? readings[0]
