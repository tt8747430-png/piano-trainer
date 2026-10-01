import type { Meter, Tick } from '@/shared/lib/music'
import { ticksOf } from '@/shared/lib/notation'

/** The values the editor writes, longest first: whole to sixteenth. */
export const NOTE_VALUES = [1, 2, 4, 8, 16] as const

/** The value chosen for the next note or rest: plain, dotted, or a triplet's (x/4 only). */
export interface NoteValue {
  readonly value: (typeof NOTE_VALUES)[number]
  readonly dots: 0 | 1
  readonly triplet: boolean
}

/** A value's length in the meter's ticks. */
export const valueTicks = (value: NoteValue, meter: Meter): Tick => ticksOf(value, meter)
