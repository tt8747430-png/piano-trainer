import {
  rangeOf,
  type Finger,
  type KeyRange,
  type PlacedScaleChord,
  type PlacedTone,
} from '@/shared/lib/music'
import type { ShownKeys } from '@/shared/ui'

/** A chord's keys as a page shows them: each by its role, labelled with its degree. */
export const chordShown = (placed: readonly PlacedTone[]): ShownKeys => ({
  keys: placed.map((key) => key.midi),
  marks: new Map(placed.map((key) => [key.midi, { tone: key.tone.role, label: key.tone.degree }])),
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
            tone: key.tone.role === 'root' ? 'tonic' : 'scale',
            label: key.tone.degree,
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
