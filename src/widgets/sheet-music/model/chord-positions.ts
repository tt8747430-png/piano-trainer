import type { Performance } from '@/shared/lib/arrangement'
import { handPosition, type HandPosition } from '@/shared/lib/music'

/**
 * How the right hand plays each chord of a Performance: the position of its chord as voiced, where
 * its figure plays that chord (null under a tune, a written hand, a pattern's own shapes, an exercise).
 */
export const chordPositions = (performance: Performance): (HandPosition | null)[] =>
  performance.chords.map((chord) => (chord.hand ? handPosition(chord, chord.hand) : null))
