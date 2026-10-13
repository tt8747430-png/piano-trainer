import type { Performance } from '@/shared/lib/arrangement'
import { handPosition, type HandPosition } from '@/shared/lib/music'

/**
 * How the right hand plays each chord of a Performance: the position of the keys it strikes while
 * the chord sounds, by their lowest (null where it strikes none).
 */
export function chordPositions(performance: Performance): (HandPosition | null)[] {
  const hands = performance.chords.map((): number[] => [])
  for (const note of performance.notes) if (note.hand === 'rh') hands[note.chord]?.push(note.midi)
  return performance.chords.map((chord, index) => handPosition(chord, hands[index] ?? []))
}
