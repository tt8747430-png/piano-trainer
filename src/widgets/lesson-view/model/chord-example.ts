import {
  chordSymbol,
  midi,
  MIDDLE_C,
  parseChordSymbol,
  pitchClassOf,
  placeChord,
  type Midi,
} from '@/shared/lib/music'
import type { KeyMark } from '@/shared/ui'

/** A lesson's chord example as the keys show it. */
export interface ChordExample {
  readonly name: string
  readonly keys: readonly Midi[]
  readonly marks: ReadonlyMap<Midi, KeyMark>
}

/**
 * A chord symbol from a lesson, placed as the Chords reference places it (root position from middle
 * C), its bass after a slash in the octave below; each chord tone marked by role and degree, a bass
 * that is a chord tone as that tone.
 */
export function placeExample(symbol: string): ChordExample {
  const chord = parseChordSymbol(symbol)
  const { rh } = placeChord(chord.root, chord.quality, { inversion: 0, bothHands: false })
  const marks = new Map<Midi, KeyMark>(
    rh.map((placed) => [placed.midi, { tone: placed.tone.role, label: placed.tone.degree }]),
  )
  const keys = rh.map((placed) => placed.midi)
  const bass = chord.bass
  if (!bass) return { name: chordSymbol(chord), keys, marks }
  const bassKey = midi(MIDDLE_C - 12 + pitchClassOf(bass))
  const asTone = rh.find((placed) => pitchClassOf(placed.tone.note) === pitchClassOf(bass))
  if (asTone) marks.set(bassKey, { tone: asTone.tone.role, label: asTone.tone.degree })
  return { name: chordSymbol(chord), keys: [bassKey, ...keys], marks }
}
