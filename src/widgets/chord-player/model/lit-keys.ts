import {
  midi,
  pitchClassOf,
  printedNote,
  spellChord,
  type Chord,
  type KeyRange,
  type Midi,
  type SpelledNote,
} from '@/shared/lib/music'
import { NO_KEYS, type KeyMark, type ShownKeys } from '@/shared/ui'

/** The left hand's octave, G2 to F♯3: the root, or the bass a slash names. */
const LEFT_FROM = 43

/**
 * The Chord player's keys, F2 to A4: two and a half octaves (owner, carried: "about two and a half
 * octaves"), holding both hands for every chord, so the keyboard never moves while the sheet plays.
 */
export const CHORD_PLAYER_KEYS: KeyRange = { from: midi(41), to: midi(69) }

const inOctave = (note: SpelledNote, from: number): Midi =>
  midi(from + ((((pitchClassOf(note) - from) % 12) + 12) % 12))

/**
 * The chord sounding, on the keys (the Chord player's brief: "the keys show the chord"): its root or
 * slash bass in the left hand, its tones in the right in the octave just above, each key named, so a
 * chord spans an octave and stays in one view on a phone; nothing while nothing sounds.
 */
export function litKeys(chord: Chord | undefined): ShownKeys {
  if (!chord) return NO_KEYS
  const bass = chord.bass ?? chord.root
  const low = inOctave(bass, LEFT_FROM)
  const marks = new Map<Midi, KeyMark>([[low, { tone: 'lh', label: printedNote(bass) }]])
  for (const { note } of spellChord(chord.root, chord.quality))
    marks.set(inOctave(note, low + 1), { tone: 'rh', label: printedNote(note) })
  return { keys: [...marks.keys()].sort((x, y) => x - y), marks }
}
