import { TICKS_PER_BEAT, type Tick } from '@/shared/lib/music'

// An exercise is written in 4/4: its note values and its bar, in ticks.

export const EIGHTH: Tick = TICKS_PER_BEAT / 2
export const QUARTER: Tick = TICKS_PER_BEAT
export const HALF: Tick = 2 * TICKS_PER_BEAT
export const BAR_BEATS = 4
export const BAR: Tick = BAR_BEATS * TICKS_PER_BEAT
