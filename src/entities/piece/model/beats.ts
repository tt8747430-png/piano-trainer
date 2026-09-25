import { TICKS_PER_BEAT, type Tick } from '@/shared/lib/arrangement'

/** Whole ticks in these beats, or null when they fall between ticks (`.3` of a beat). */
export function ticksIn(beats: number): Tick | null {
  const ticks = beats * TICKS_PER_BEAT
  const whole = Math.round(ticks)
  return Math.abs(ticks - whole) < 1e-9 ? whole : null
}

/** A written count of beats above 0 (`2`, `1.5`, `.5`), or null. */
export function readBeats(text: string): number | null {
  const beats = Number(text)
  return text.trim() !== '' && beats > 0 ? beats : null
}
