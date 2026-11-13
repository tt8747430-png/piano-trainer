import type { ChordLabels } from '@/shared/lib'
import {
  INTERVALS,
  printedNote,
  type ChordFingers,
  type Midi,
  type PlacedChord,
  type PlacedTone,
} from '@/shared/lib/music'

const LETTERS = 'CDEFGAB'

/** The interval up from one placed note to the next, by its name (M3, P4, m7, M9). */
function intervalUp(from: PlacedTone, to: PlacedTone): string {
  const steps =
    (((LETTERS.indexOf(to.tone.note.letter) - LETTERS.indexOf(from.tone.note.letter)) % 7) + 7) % 7
  const semitones = to.midi - from.midi
  const named = Object.entries(INTERVALS).find(
    ([name, interval]) =>
      name !== 'r' && interval.steps === steps && interval.semitones === semitones,
  )
  return named?.[0] ?? ''
}

/**
 * What each key of a placed chord carries, as the Piano sheet's Labels says (canvas 89, 151): its
 * note's name; its degree in the chord (R for the root, ♭3, 7); the interval up from the note below
 * it in its hand, the lowest its name; its finger; or nothing. A key both hands hold takes the right
 * hand's.
 */
export function chordKeyLabels(
  placed: PlacedChord,
  fingers: ChordFingers,
  labels: ChordLabels,
): ReadonlyMap<Midi, string> {
  const out = new Map<Midi, string>()
  if (labels === 'none') return out
  for (const hand of ['lh', 'rh'] as const) {
    placed[hand].forEach((key, at) => {
      const below = placed[hand][at - 1]
      const label =
        labels === 'names'
          ? printedNote(key.tone.note)
          : labels === 'degrees'
            ? key.tone.degree === '1'
              ? 'R'
              : key.tone.degree
            : labels === 'intervals'
              ? below
                ? intervalUp(below, key)
                : printedNote(key.tone.note)
              : String(fingers[hand][at] ?? '')
      out.set(key.midi, label)
    })
  }
  return out
}
