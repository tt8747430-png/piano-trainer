import {
  modeVamp,
  placeChord,
  scaleChordAt,
  spellChord,
  type ScaleKind,
  type SpelledNote,
} from '@/shared/lib/music'
import { chordSounds, type NoteSound } from '@/shared/lib/schedule'

/** Seconds each chord of a vamp is held before the next. */
const HELD = 1.2
/** Times round a vamp plays: enough to hear the mode settle. */
const ROUNDS = 2

/**
 * A mode's vamp as it sounds (A43): its chords in turn, twice round, each its triad over its root in
 * the left hand, ending on the tonic's. None for a scale with no vamp.
 */
export function vampSounds(root: SpelledNote, kind: ScaleKind): NoteSound[] {
  const degrees = modeVamp(kind)
  if (degrees.length === 0) return []
  const line = [...Array.from({ length: ROUNDS }, () => degrees).flat(), 0]
  return line.flatMap((degree, at) => {
    const chord = scaleChordAt(root, kind, degree, 3)
    const placed = placeChord(spellChord(chord.root, chord.quality), {
      inversion: 0,
      bothHands: true,
    })
    const keys = [...placed.lh, ...placed.rh].map((key) => key.midi)
    return chordSounds(keys, { arpeggio: false }).map((sound) => ({
      ...sound,
      at: sound.at + at * HELD,
    }))
  })
}
