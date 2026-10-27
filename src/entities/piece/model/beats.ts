import { TICKS_PER_BEAT, type Tick } from '@/shared/lib/music'

/** Whole ticks in these beats, or null when they fall between ticks (`.3` of a beat). */
export function ticksIn(beats: number): Tick | null {
  const ticks = beats * TICKS_PER_BEAT
  const whole = Math.round(ticks)
  return Math.abs(ticks - whole) < 1e-9 ? whole : null
}

/**
 * The most beats a chord or a note lasts: a bar of 12/2 (ADR 0114), six bars of 4/4, so a song from
 * a link can never ask for a bar of millions of beats.
 */
export const MAX_BEATS = 24

/** `2:3`: a fraction of beats, for what a decimal cannot write exactly (a triplet's third). */
const FRACTION = /^(\d+):(\d+)$/

/** A written count of beats above 0 and at most `MAX_BEATS` (`2`, `1.5`, `.5`, `1:3`), or null. */
export function readBeats(text: string): number | null {
  const fraction = FRACTION.exec(text.trim())
  const beats = fraction ? Number(fraction[1]) / Number(fraction[2]) : Number(text)
  return text.trim() !== '' && beats > 0 && beats <= MAX_BEATS ? beats : null
}
