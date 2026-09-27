import { TICKS_PER_BEAT, type Tick } from '@/shared/lib/music'

const HALF = TICKS_PER_BEAT / 2
/** A swung 8th is two thirds of the beat. */
const LONG = (TICKS_PER_BEAT * 2) / 3

/**
 * Where a tick sounds swung: in each beat the off-beat 8th moves to two thirds of the beat, and what
 * lies between moves in proportion, so a 16th grid swings with it. The beats stay.
 */
export function swingTick(tick: Tick): number {
  const beat = Math.floor(tick / TICKS_PER_BEAT) * TICKS_PER_BEAT
  const into = tick - beat
  return (
    beat +
    (into <= HALF ? (into * LONG) / HALF : LONG + ((into - HALF) * (TICKS_PER_BEAT - LONG)) / HALF)
  )
}
