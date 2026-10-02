import { isCompound, type Meter } from '@/shared/lib/music'
import { ticksOf, type Duration } from '@/shared/lib/notation'

/** The values the editor writes, longest first: whole to sixteenth. */
export const NOTE_VALUES = [1, 2, 4, 8, 16] as const

/**
 * The value chosen for the next note or rest: plain, dotted, or a triplet's (x/4 only), never both,
 * and always whole ticks in the meter, so what it writes reads back.
 */
export interface ChosenValue extends Duration {
  readonly value: (typeof NOTE_VALUES)[number]
}

/** Whether the value dotted is whole ticks in the meter (a dotted sixteenth in x/4 is not). */
export const takesDot = (value: ChosenValue['value'], meter: Meter): boolean =>
  Number.isInteger(ticksOf({ value, dots: 1, triplet: false }, meter))

/** Another value chosen: its dot kept where the meter writes it dotted. */
export const withValue = (
  chosen: ChosenValue,
  value: ChosenValue['value'],
  meter: Meter,
): ChosenValue => ({ ...chosen, value, dots: chosen.dots === 1 && takesDot(value, meter) ? 1 : 0 })

/** The dot put on (in a triplet's place) or taken off; the value as it was where it takes none. */
export function toggledDot(chosen: ChosenValue, meter: Meter): ChosenValue {
  if (chosen.dots === 1) return { ...chosen, dots: 0 }
  return takesDot(chosen.value, meter) ? { ...chosen, dots: 1, triplet: false } : chosen
}

/** The triplet put on (in a dot's place) or taken off; none in a compound meter. */
export function toggledTriplet(chosen: ChosenValue, meter: Meter): ChosenValue {
  if (chosen.triplet) return { ...chosen, triplet: false }
  return isCompound(meter) ? chosen : { ...chosen, triplet: true, dots: 0 }
}
