import type { ChordRange } from '@/shared/lib'
import { midi, type Midi } from '@/shared/lib/music'
import { chordPerformance, type ChordView } from './chord-view'

/** The piano's ends, A0 and C8. */
const LOWEST = 21
const HIGHEST = 108
const SPAN: Record<Exclude<ChordRange, 'chord'>, number> = { two: 24, four: 48 }

/**
 * The keys a chord's piano frames, as the Piano sheet's Range says: the chord's own lowest to
 * highest, or two or four octaves from a C round its middle, moved in from the piano's ends.
 */
export function chordRange(
  midis: readonly Midi[],
  range: ChordRange,
): { readonly low: Midi; readonly high: Midi } {
  const low = Math.min(...midis)
  const high = Math.max(...midis)
  if (range === 'chord') return { low: midi(low), high: midi(high) }
  const span = Math.max(SPAN[range], high - low)
  // From the C nearest an even spread round the chord, as a keyboard's octaves are counted.
  const from = Math.round((low + high - span) / 2 / 12) * 12
  const start = Math.min(Math.max(LOWEST, from), HIGHEST - span)
  return { low: midi(start), high: midi(start + span) }
}

/** The keys a chord's piano frames, from the chord as its page shows it. */
export const framedChord = (chord: ChordView, range: ChordRange) =>
  chordRange(
    chordPerformance(chord).map((note) => note.midi),
    range,
  )
