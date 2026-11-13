import type { ChordRange } from '@/shared/lib'
import { midi, WHITE_KEYS, type Midi } from '@/shared/lib/music'
import { chordPerformance, type ChordView } from './chord-view'

/** The white keys two or four octaves take, C to B (the canvas's 14 and 28). */
export const RANGE_WHITES: Record<Exclude<ChordRange, 'chord'>, number> = { two: 14, four: 28 }

/**
 * The keys a chord's piano frames, as the Piano sheet's Range says: the chord's own lowest to
 * highest; or two or four octaves of white keys from `from` (where the learner dragged the strip),
 * else from the C under the chord (an octave lower for four), moved in from the piano's ends.
 */
export function chordRange(
  midis: readonly Midi[],
  range: ChordRange,
  from: Midi | null = null,
): { readonly low: Midi; readonly high: Midi } {
  const low = Math.min(...midis)
  const high = Math.max(...midis)
  if (range === 'chord') return { low: midi(low), high: midi(high) }
  const whites = RANGE_WHITES[range]
  const start = from ?? Math.floor(low / 12) * 12 - (range === 'four' ? 12 : 0)
  const found = WHITE_KEYS.findIndex((key) => key >= start)
  const at = Math.max(
    0,
    Math.min(WHITE_KEYS.length - whites, found < 0 ? WHITE_KEYS.length : found),
  )
  return { low: WHITE_KEYS[at] ?? midi(21), high: WHITE_KEYS[at + whites - 1] ?? midi(108) }
}

/** The keys a chord's piano frames, from the chord as its page shows it. */
export const framedChord = (chord: ChordView, range: ChordRange, from: Midi | null) =>
  chordRange(
    chordPerformance(chord).map((note) => note.midi),
    range,
    from,
  )
