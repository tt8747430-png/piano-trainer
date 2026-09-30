import {
  nameChords,
  pitchClass,
  plainSpelling,
  spanInterval,
  type FoundChord,
  type Midi,
  type ReferenceInterval,
  type SpelledNote,
  type Tone,
} from '@/shared/lib/music'
import type { KeyMark } from '@/shared/ui'

/** What the keys make: nothing yet, one note, two as an interval, a chord by its names, or no chord. */
export type Finding =
  | { readonly kind: 'empty' }
  | { readonly kind: 'note'; readonly note: SpelledNote }
  | { readonly kind: 'interval'; readonly interval: ReferenceInterval }
  | { readonly kind: 'chord'; readonly best: FoundChord; readonly others: readonly FoundChord[] }
  | { readonly kind: 'none' }

/** The keys, lowest first, named: a chord when the table names one, else a note or an interval. */
export function findChord(keys: readonly Midi[]): Finding {
  const [lowest] = keys
  if (lowest === undefined) return { kind: 'empty' }
  const other = keys.find((key) => pitchClass(key) !== pitchClass(lowest))
  if (other === undefined) return { kind: 'note', note: plainSpelling(pitchClass(lowest), false) }
  const [best, ...others] = nameChords(keys)
  if (best) return { kind: 'chord', best, others }
  return new Set(keys.map((key) => pitchClass(key))).size === 2
    ? { kind: 'interval', interval: spanInterval(other - lowest) }
    : { kind: 'none' }
}

/** The tone of a found chord a key plays. */
export const toneOfKey = (found: FoundChord, key: Midi): Tone | undefined =>
  found.chord.tones.find((tone) => tone.pitchClass === pitchClass(key))

/** Each key of a chord found, marked by its role and degree in it; nothing else is marked. */
export function findingMarks(finding: Finding, keys: readonly Midi[]): Map<Midi, KeyMark> {
  const marks = new Map<Midi, KeyMark>()
  if (finding.kind !== 'chord') return marks
  for (const key of keys) {
    const tone = toneOfKey(finding.best, key)
    if (tone) marks.set(key, { tone: tone.role, label: tone.degree })
  }
  return marks
}
