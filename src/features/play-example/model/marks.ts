import {
  noteName,
  pitchClass,
  rangeOf,
  spellChord,
  type Chord,
  type Finger,
  type KeyRange,
  type Midi,
  type PlacedScaleChord,
  type PlacedTone,
} from '@/shared/lib/music'
import { toneMark, type KeyMark, type ShownKeys } from '@/shared/ui'

/** A chord's keys as a page shows them: each by its role, labelled with its degree and its note. */
export const chordShown = (placed: readonly PlacedTone[]): ShownKeys => ({
  keys: placed.map((key) => key.midi),
  marks: new Map(placed.map((key) => [key.midi, toneMark(key.tone)])),
})

/** A scale's keys: the tonic in its own colour, every note with its degree and, given one, a hand's finger. */
export function scaleShown(
  placed: readonly PlacedTone[],
  fingering?: readonly Finger[],
): ShownKeys {
  return {
    keys: placed.map((key) => key.midi),
    marks: new Map(
      placed.map((key, i) => {
        const finger = fingering?.[i]
        return [
          key.midi,
          {
            ...toneMark(key.tone, key.tone.role === 'root' ? 'tonic' : 'scale'),
            ...(finger === undefined ? {} : { finger }),
          },
        ]
      }),
    ),
  }
}

/** Every key the chords play, from the tonic up: the keyboard fills its width with them. */
export const chordsRange = (chords: readonly PlacedScaleChord[]): KeyRange | undefined =>
  rangeOf(chords.flatMap((placed) => placed.tones.map((tone) => tone.midi)))

/**
 * A chord's keys as a row voices them, each marked by its role in the chord (the bass too); a bass a
 * slash chord writes that is no tone of the chord named by itself.
 */
export function voicedShown(chord: Chord, keys: readonly Midi[]): ShownKeys {
  const tones = spellChord(chord.root, chord.quality)
  const marks = new Map<Midi, KeyMark>()
  for (const key of keys) {
    const tone = tones.find((each) => each.pitchClass === pitchClass(key))
    if (tone) marks.set(key, toneMark(tone))
    else if (chord.bass) marks.set(key, { tone: 'scale', label: noteName(chord.bass) })
  }
  return { keys, marks }
}
