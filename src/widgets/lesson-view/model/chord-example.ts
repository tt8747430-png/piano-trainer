import type { ShownKeys } from '@/features/play-example'
import {
  midi,
  MIDDLE_C,
  parseChordSymbol,
  pitchClassOf,
  placeChord,
  spellChord,
  type Midi,
  type PitchClass,
} from '@/shared/lib/music'
import type { KeyMark } from '@/shared/ui'

/** A pitch class's key nearest middle C: from the F♯ below to the F above. */
const nearMiddleC = (pc: PitchClass): Midi => midi(MIDDLE_C + (pc > 5 ? pc - 12 : pc))

/**
 * A chord symbol from a lesson on the keys, each chord tone marked by role and degree. A chord is
 * placed as the Chords reference places it (root position from middle C); over a bass that is one of
 * its tones, in that inversion, stacked from the bass nearest middle C, as the lessons teach it (C/E
 * is E G C; from C E G the nearest F/C is C F A); over any other bass, in root position with the
 * bass in the octave below.
 */
export function placeExample(symbol: string): ShownKeys {
  const chord = parseChordSymbol(symbol)
  const tones = spellChord(chord.root, chord.quality)
  const bass = chord.bass
  const inversion = bass ? tones.findIndex((tone) => tone.pitchClass === pitchClassOf(bass)) : -1
  const placed = placeChord(tones, { inversion: Math.max(inversion, 0), bothHands: false }).rh
  const lowest = placed[0]
  const shift = bass && inversion >= 0 && lowest ? nearMiddleC(pitchClassOf(bass)) - lowest.midi : 0
  const rh = placed.map((key) => ({ tone: key.tone, midi: midi(key.midi + shift) }))
  const marks = new Map<Midi, KeyMark>(
    rh.map((key) => [key.midi, { tone: key.tone.role, label: key.tone.degree }]),
  )
  const keys = rh.map((key) => key.midi)
  if (!bass || inversion >= 0) return { keys, marks }
  return { keys: [midi(MIDDLE_C - 12 + pitchClassOf(bass)), ...keys], marks }
}
