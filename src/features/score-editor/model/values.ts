import { isCompound, type Meter } from '@/shared/lib/music'
import { ticksOf, type Duration } from '@/shared/lib/notation'

/** The values the editor writes, longest first: whole to 32nd. */
export const NOTE_VALUES = [1, 2, 4, 8, 16, 32] as const

/** A value's dots: one or two. */
export type Dots = 1 | 2

/**
 * The value chosen for the next note or rest: plain, dotted, double dotted, or a triplet's (x/4 only), never both,
 * and always whole ticks in the meter, so what it writes reads back.
 */
export interface ChosenValue extends Duration {
  readonly value: (typeof NOTE_VALUES)[number]
}

/** Whether the value dotted (or double dotted) is whole ticks in the meter (a dotted 32nd in x/4 is not). */
export const takesDot = (value: ChosenValue['value'], meter: Meter, dots: Dots = 1): boolean =>
  Number.isInteger(ticksOf({ value, dots, triplet: false }, meter))

/** Another value chosen: its dots kept where the meter writes it so. */
export const withValue = (
  chosen: ChosenValue,
  value: ChosenValue['value'],
  meter: Meter,
): ChosenValue => ({
  ...chosen,
  value,
  dots: chosen.dots !== 0 && takesDot(value, meter, chosen.dots) ? chosen.dots : 0,
})

/** One dot or two put on (in a triplet's place) or taken off; the value as it was where it takes none. */
export function toggledDot(chosen: ChosenValue, meter: Meter, dots: Dots = 1): ChosenValue {
  if (chosen.dots === dots) return { ...chosen, dots: 0 }
  return takesDot(chosen.value, meter, dots) ? { ...chosen, dots, triplet: false } : chosen
}

/** The triplet put on (in a dot's place) or taken off; none in a compound meter. */
export function toggledTriplet(chosen: ChosenValue, meter: Meter): ChosenValue {
  if (chosen.triplet) return { ...chosen, triplet: false }
  return isCompound(meter) ? chosen : { ...chosen, triplet: true, dots: 0 }
}

/** The value a length is written as in the meter (plain, dotted, double dotted or a triplet's), or none. */
export function valueOf(ticks: number, meter: Meter): ChosenValue | null {
  for (const value of NOTE_VALUES)
    for (const triplet of [false, true])
      for (const dots of [0, 1, 2] as const) {
        if (triplet && dots > 0) continue
        const chosen = { value, dots, triplet }
        if (ticksOf(chosen, meter) === ticks) return chosen
      }
  return null
}
