import {
  nameChords,
  pitchClass,
  spanInterval,
  spellInKey,
  type FoundChord,
  type Key,
  type Midi,
  type ReferenceInterval,
  type SpelledNote,
} from '@/shared/lib/music'

/** What the live score names over a chord played. */
export type LiveName =
  | { readonly kind: 'note'; readonly note: SpelledNote }
  | { readonly kind: 'interval'; readonly interval: ReferenceInterval }
  | { readonly kind: 'chord'; readonly found: FoundChord }
  | { readonly kind: 'none' }

const NONE: LiveName = { kind: 'none' }

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
 * What a chord played is (spec 2026-10-09 §5.1): one note (in octaves too) its note in `key`; two
 * notes their interval from the lowest key up, compound past the octave where a chord symbol names
 * one (m9 … M13), else simple; three or more the chord finder's first name, else nothing.
 */
export function liveName(keys: readonly Midi[], key: Key): LiveName {
  const lowest = keys.length === 0 ? null : Math.min(...keys)
  if (lowest === null) return NONE
  const classes = new Set(keys.map((each) => pitchClass(each)))
  if (classes.size === 1) return { kind: 'note', note: spellInKey(pitchClass(lowest), key) }
  if (classes.size === 2) {
    const upper = Math.min(...keys.filter((each) => pitchClass(each) !== pitchClass(lowest)))
    const span = upper - lowest
    return { kind: 'interval', interval: COMPOUND.get(span) ?? spanInterval(span) }
  }
  const [found] = nameChords(keys)
  return found ? { kind: 'chord', found } : NONE
}
