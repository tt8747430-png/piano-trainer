import { takeGrids, type QuantisedNote } from '@/entities/take'
import {
  barTicks,
  isCompound,
  pitchClass,
  spellInKey,
  TICKS_PER_BEAT,
  type Key,
  type Meter,
  type Midi,
} from '@/shared/lib/music'
import type { Duration, TimedMusic } from '@/shared/lib/notation'

const TRIPLET = { num: 3, numbase: 2 } as const

/**
 * What Review your recording snaps a take to (A40, Flat's Quantize): in a simple meter 1/4, 1/8,
 * 1/16, 1/4 triplets and 1/8 triplets; in a compound one its beat, 1/8 and 1/16.
 */
export const reviewGrids = (meter: Meter): readonly Duration[] =>
  isCompound(meter)
    ? takeGrids(meter)
    : [
        { value: 4, dots: 0 },
        { value: 8, dots: 0 },
        { value: 16, dots: 0 },
        { value: 4, dots: 0, tuplet: TRIPLET },
        { value: 8, dots: 0, tuplet: TRIPLET },
      ]

/** A grid as a choice's value and name: `8`, `4.`, `4t` a triplet's. */
export const gridKey = ({ value, dots, tuplet }: Duration): string =>
  `${value}${dots === 1 ? '.' : ''}${tuplet ? 't' : ''}`

/**
 * A take snapped, as the score it would be written as (A40, the engraved result over the roll): its
 * notes split between the piano's staves at `split` (it and up the upper), in the score's key, over
 * as many whole bars of `meter` as they reach.
 */
export function reviewMusic(
  notes: readonly QuantisedNote[],
  { key, meter, split }: { readonly key: Key; readonly meter: Meter; readonly split: Midi },
): TimedMusic {
  const bar = barTicks(meter)
  const end = notes.reduce((latest, n) => Math.max(latest, n.startTick + n.durationTicks), 0)
  const count = Math.max(1, Math.ceil(end / bar))
  return {
    key,
    meter,
    bars: Array.from({ length: count }, (_, i) => ({
      startTick: i * bar,
      beats: bar / TICKS_PER_BEAT,
    })),
    notes: notes.map((n) => ({
      midi: n.midi,
      spelled: spellInKey(pitchClass(n.midi), key),
      hand: n.midi >= split ? 'rh' : 'lh',
      startTick: n.startTick,
      durationTicks: n.durationTicks,
    })),
    chords: [],
  }
}
