import {
  noteName,
  pitchClass,
  rangeOf,
  spellChord,
  type Chord,
  type KeyRange,
  type Midi,
  type PlacedScaleChord,
  type PlacedTone,
  type RowPosition,
  voiceLead,
} from '@/shared/lib/music'
import type { RowChord } from './chord-row'
import { nameMark, NO_KEYS, toneMark, type KeyMark, type ShownKeys } from '@/shared/ui'

/** A chord's keys as a page shows them: each by its role, labelled with its degree and its note. */
export const chordShown = (placed: readonly PlacedTone[]): ShownKeys => ({
  keys: placed.map((key) => key.midi),
  marks: new Map(placed.map((key) => [key.midi, toneMark(key.tone)])),
})

/**
 * A scale's keys, as the Scales board draws them: the tonic in its own colour, every note named, no
 * degree and no finger on the keys (R34): the staff carries the fingers.
 */
export const scaleShown = (placed: readonly PlacedTone[]): ShownKeys => ({
  keys: placed.map((key) => key.midi),
  marks: new Map(
    placed.map((key) => [
      key.midi,
      { tone: key.tone.role === 'root' ? 'tonic' : 'scale', label: noteName(key.tone.note) },
    ]),
  ),
})

/** Every key the chords play, from the tonic up: the keyboard fills its width with them. */
export const chordsRange = (chords: readonly PlacedScaleChord[]): KeyRange | undefined =>
  rangeOf(chords.flatMap((placed) => placed.tones.map((tone) => tone.midi)))

/**
 * A chord's keys as a row voices them, each painted by its role in the chord and named (the bass
 * too), as the boards label keys; a bass a slash chord writes that is no tone of the chord named by itself.
 */
export function voicedShown(chord: Chord, keys: readonly Midi[]): ShownKeys {
  const tones = spellChord(chord.root, chord.quality)
  const marks = new Map<Midi, KeyMark>()
  for (const key of keys) {
    const tone = tones.find((each) => each.pitchClass === pitchClass(key))
    if (tone) marks.set(key, nameMark(tone))
    else if (chord.bass) marks.set(key, { tone: 'scale', label: noteName(chord.bass) })
  }
  return { keys, marks }
}

/** A row's first chord as the row voices it: what a page whose row chooses a chord shows at rest. */
export function firstChordShown(chords: readonly RowChord[], position?: RowPosition): ShownKeys {
  const first = chords[0]
  if (!first) return NO_KEYS
  return voicedShown(
    first.chord,
    voiceLead(
      chords.map(({ chord }) => chord),
      position,
    )[0] ?? [],
  )
}
