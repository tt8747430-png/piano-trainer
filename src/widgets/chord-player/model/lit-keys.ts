import {
  midi,
  pitchClassOf,
  printedChord,
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

/** From 600 wide (a tablet, a phone on its side, a laptop), C2 to C7 as the board draws them (the runs' and the Check's laptop keys), the chord lit where it falls. */
export const CHORD_PLAYER_LAPTOP_KEYS: KeyRange = { from: midi(36), to: midi(96) }

/**
 * Wider than a phone: the chart's four bars a row and the keys' C2 to C7, so a tablet's keys keep a
 * phone's width and show more of the range rather than stretch two and a half octaves across it.
 */
export const WIDER_THAN_PHONE = '(min-width: 37.5rem)'

const inOctave = (note: SpelledNote, from: number): Midi =>
  midi(from + ((((pitchClassOf(note) - from) % 12) + 12) % 12))

/**
 * The chord sounding, on the keys (the Chord player's brief: "the keys show the chord"): its root or
 * slash bass in the left hand, its tones in the right in the octave just above, each key named, so a
 * chord spans an octave and stays in one view on a phone; nothing for no chord. While stopped the keys
 * show the chord picked as these marks' wash, waiting; while it sounds, in full.
 */
export function litKeys(chord: Chord | undefined): ShownKeys {
  if (!chord) return NO_KEYS
  // One object per chord, so the keys, drawn again on every beat, redraw only as the chord changes.
  const name = printedChord(chord)
  const known = SHOWN.get(name)
  if (known) return known
  const shown = keysOf(chord)
  SHOWN.set(name, shown)
  return shown
}

/** The keys each chord named so far lights: a sheet's chords are few, a key's at most a few dozen. */
const SHOWN = new Map<string, ShownKeys>()

function keysOf(chord: Chord): ShownKeys {
  const bass = chord.bass ?? chord.root
  const low = inOctave(bass, LEFT_FROM)
  const marks = new Map<Midi, KeyMark>([[low, { tone: 'lh', label: printedNote(bass) }]])
  for (const { note } of spellChord(chord.root, chord.quality))
    marks.set(inOctave(note, low + 1), { tone: 'rh', label: printedNote(note) })
  return { keys: [...marks.keys()].sort((x, y) => x - y), marks }
}
