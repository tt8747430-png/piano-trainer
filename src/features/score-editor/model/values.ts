import type { Meter } from '@/shared/lib/music'
import { ticksOf, tupletOf, type Duration, type TupletCount } from '@/shared/lib/notation'

/** The values the editor writes, longest first: whole to 64th, keys 1 to 7 as Flat's. */
export const NOTE_VALUES = [1, 2, 4, 8, 16, 32, 64] as const

/** A value's dots: one or two. */
export type Dots = 1 | 2

/**
 * The value chosen for the next note or rest: plain, dotted, double dotted, or a tuplet's (ADR
 * 0097), never both, and always whole ticks in the meter, so what it writes reads back.
 */
export interface ChosenValue extends Duration {
  readonly value: (typeof NOTE_VALUES)[number]
}

/** Whether the value dotted (or double dotted) is whole ticks in the meter (a dotted 64th in x/4 is not). */
export const takesDot = (value: ChosenValue['value'], meter: Meter, dots: Dots = 1): boolean =>
  Number.isInteger(ticksOf({ value, dots }, meter))

/** Whether the value is whole ticks in a tuplet of `num` in the meter, and the meter writes such a tuplet. */
export const takesTuplet = (
  value: ChosenValue['value'],
  num: TupletCount,
  meter: Meter,
): boolean => {
  const tuplet = tupletOf(num, meter)
  return tuplet !== null && Number.isInteger(ticksOf({ value, dots: 0, tuplet }, meter))
}

/** A value without its tuplet. */
const plain = ({ value, dots }: ChosenValue): ChosenValue => ({ value, dots })

/** Another value chosen: its dots, or its tuplet, kept where the meter writes it so. */
export function withValue(
  chosen: ChosenValue,
  value: ChosenValue['value'],
  meter: Meter,
): ChosenValue {
  const { tuplet } = chosen
  if (tuplet) {
    const num = tuplet.num as TupletCount
    return takesTuplet(value, num, meter) ? { value, dots: 0, tuplet } : { value, dots: 0 }
  }
  return {
    value,
    dots: chosen.dots !== 0 && takesDot(value, meter, chosen.dots) ? chosen.dots : 0,
  }
}

/** One dot or two put on (in a tuplet's place) or taken off; the value as it was where it takes none. */
export function toggledDot(chosen: ChosenValue, meter: Meter, dots: Dots = 1): ChosenValue {
  if (chosen.dots === dots) return { ...plain(chosen), dots: 0 }
  return takesDot(chosen.value, meter, dots) ? { value: chosen.value, dots } : chosen
}

/**
 * A tuplet of `num` put on (in a dot's place, or another tuplet's) or the same one taken off; as
 * it was where the meter writes no such tuplet (a triplet in 6/8, a duplet in 4/4).
 */
export function toggledTuplet(chosen: ChosenValue, num: TupletCount, meter: Meter): ChosenValue {
  if (chosen.tuplet?.num === num) return { value: chosen.value, dots: 0 }
  const tuplet = tupletOf(num, meter)
  return tuplet && takesTuplet(chosen.value, num, meter)
    ? { value: chosen.value, dots: 0, tuplet }
    : chosen
}

/** The value a length is written as in the meter (plain, dotted, double dotted or a tuplet's), or none. */
export function valueOf(ticks: number, meter: Meter): ChosenValue | null {
  const tuplets = ([3, 5, 6, 7, 9, 2, 4, 8] as const).flatMap((num) => {
    const tuplet = tupletOf(num, meter)
    return tuplet ? [tuplet] : []
  })
  for (const value of NOTE_VALUES) {
    for (const dots of [0, 1, 2] as const) {
      const chosen = { value, dots }
      if (ticksOf(chosen, meter) === ticks) return chosen
    }
    for (const tuplet of tuplets) {
      const chosen = { value, dots: 0 as const, tuplet }
      if (ticksOf(chosen, meter) === ticks) return chosen
    }
  }
  return null
}
