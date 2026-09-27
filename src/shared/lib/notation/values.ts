import { isCompound, TICKS_PER_BEAT, type Meter, type Tick } from '@/shared/lib/music'
import type { Duration, NoteValue } from './types'

const NOTE_VALUES: readonly NoteValue[] = [1, 2, 4, 8, 16, 32]

/** Ticks in an eighth: 6 when a quarter is the beat, 4 when a dotted quarter is (x/8). */
const eighthTicks = (meter: Meter): Tick =>
  isCompound(meter) ? TICKS_PER_BEAT / 3 : TICKS_PER_BEAT / 2

/**
 * A value's length in the meter's ticks: eighths in it, times a dot's 3/2 and a triplet's 2/3,
 * worked out in whole numbers and divided once, so a value that falls between ticks is never
 * rounded into one.
 */
export const ticksOf = (duration: Duration, meter: Meter): number =>
  (8 * eighthTicks(meter) * (duration.dots === 1 ? 3 : 2) * (duration.triplet ? 2 : 3)) /
  (duration.value * 6)

/**
 * Every value the meter writes in whole ticks, longest first: plain and dotted; or, in a triplet
 * beat, the triplets (x/4 only).
 */
export function valuesOf(meter: Meter, triplet: boolean): Duration[] {
  if (triplet && isCompound(meter)) return []
  const durations: Duration[] = NOTE_VALUES.flatMap((value): Duration[] =>
    triplet
      ? [{ value, dots: 0, triplet: true }]
      : [
          { value, dots: 1, triplet: false },
          { value, dots: 0, triplet: false },
        ],
  )
  return durations
    .filter((duration) => Number.isInteger(ticksOf(duration, meter)))
    .sort((a, b) => ticksOf(b, meter) - ticksOf(a, meter))
}
