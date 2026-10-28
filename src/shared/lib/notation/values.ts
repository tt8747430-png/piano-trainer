import { isCompound, TICKS_PER_BEAT, type Meter, type Tick } from '@/shared/lib/music'
import type { Duration, NoteValue, Tuplet } from './types'

/** Every value written, longest first: a whole to a 64th. */
export const NOTE_VALUES: readonly NoteValue[] = [1, 2, 4, 8, 16, 32, 64]

/** The tuplets a score writes (ADR 0097): two to nine notes in the time of others, as Flat's ⇧2–⇧9. */
export const TUPLET_COUNTS = [2, 3, 4, 5, 6, 7, 8, 9] as const
export type TupletCount = (typeof TUPLET_COUNTS)[number]

/** Ticks in an eighth: half a beat when a quarter is the beat, a third when a dotted quarter is (x/8). */
const eighthTicks = (meter: Meter): Tick =>
  isCompound(meter) ? TICKS_PER_BEAT / 3 : TICKS_PER_BEAT / 2

/** A value's length in quarters of it, with its dots: plain, dotted, double dotted. */
const DOTTED = [4, 6, 7] as const

/**
 * A value's length in the meter's ticks: eighths in it, times its dots' 3/2 or 7/4 and a tuplet's
 * numbase/num, worked out in whole numbers and divided once, so a value that falls between ticks is
 * never rounded into one.
 */
export const ticksOf = (duration: Duration, meter: Meter): number =>
  (8 * eighthTicks(meter) * DOTTED[duration.dots] * (duration.tuplet?.numbase ?? 1)) /
  (duration.value * 4 * (duration.tuplet?.num ?? 1))

const isPowerOfTwo = (n: number) => Number.isInteger(Math.log2(n))

/**
 * The tuplet of `num` notes in a meter (ADR 0097, as Gould and MuseScore write them): in the time of
 * the value next under them a beat holds, 3:2, 5:4, 6:4, 7:4 and 9:8 in simple time, 2:3, 4:3, 5:3,
 * 7:6, 8:6 and 9:6 in compound. None where the meter's own values write them (two, four or eight to
 * a simple beat, three or six to a compound one).
 */
export function tupletOf(num: number, meter: Meter): Tuplet | null {
  for (const value of NOTE_VALUES) {
    const numbase = TICKS_PER_BEAT / ticksOf({ value, dots: 0 }, meter)
    if (!Number.isInteger(numbase) || numbase * 2 < num) continue
    return isPowerOfTwo(num / numbase) ? null : { num, numbase }
  }
  return null
}

/**
 * Every value the meter writes in whole ticks, longest first: plain, dotted and double dotted; or,
 * in a tuplet, its values plain and dotted.
 */
export function valuesOf(meter: Meter, tuplet?: Tuplet): Duration[] {
  const durations: Duration[] = NOTE_VALUES.flatMap((value): Duration[] =>
    tuplet
      ? [
          { value, dots: 1, tuplet },
          { value, dots: 0, tuplet },
        ]
      : [
          { value, dots: 2 },
          { value, dots: 1 },
          { value, dots: 0 },
        ],
  )
  return durations
    .filter((duration) => Number.isInteger(ticksOf(duration, meter)))
    .sort((a, b) => ticksOf(b, meter) - ticksOf(a, meter))
}

/** The shortest value the meter writes outside a tuplet: a 64th, its boundaries' grid. */
export const sixtyFourth = (meter: Meter): Tick => ticksOf({ value: 64, dots: 0 }, meter)
