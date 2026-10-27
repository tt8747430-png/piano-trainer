import { TICKS_PER_BEAT, type Tick } from '@/shared/lib/music'

/**
 * How much the 8ths swing (ADR 0115), in the order offered: straight, even 8ths; light, long-short
 * 3:2; medium, as triplets 2:1, the jazz and blues swing; hard, a dotted 8th and a 16th, 3:1.
 */
export const SWING_FEELS = ['straight', 'light', 'medium', 'hard'] as const
export type SwingFeel = (typeof SWING_FEELS)[number]

/** How much of the beat each feel's first 8th takes. */
export const SWING_SHARE: Readonly<Record<SwingFeel, number>> = {
  straight: 1 / 2,
  light: 3 / 5,
  medium: 2 / 3,
  hard: 3 / 4,
}

/** Whether a feel swings at all. */
export const isSwung = (feel: SwingFeel): boolean => feel !== 'straight'

const HALF = TICKS_PER_BEAT / 2
const TRIPLET = TICKS_PER_BEAT / 3
const SIXTEENTH = TICKS_PER_BEAT / 4

/**
 * Where a tick sounds swung by `feel`: in each beat the off-beat 8th moves to the feel's share of the
 * beat, and what lies between moves in proportion, so a 16th grid swings with it. The beats stay, and
 * so does a note written on the triplet grid (a shuffle): it is long-short already.
 */
export function swingTick(tick: Tick, feel: SwingFeel): number {
  const beat = Math.floor(tick / TICKS_PER_BEAT) * TICKS_PER_BEAT
  const into = tick - beat
  if (!isSwung(feel) || (into % TRIPLET === 0 && into % SIXTEENTH !== 0)) return tick
  const long = TICKS_PER_BEAT * SWING_SHARE[feel]
  return (
    beat +
    (into <= HALF ? (into * long) / HALF : long + ((into - HALF) * (TICKS_PER_BEAT - long)) / HALF)
  )
}
