/**
 * Timing calibration (R34, ADR 0028): a piano is heard a little after its key goes down (its MIDI
 * and the cable, Bluetooth most), so a take judged as heard runs late. The learner taps a key with a
 * click; the median of how late each tap came is the piano's own lateness, taken off every take.
 */

/** The clicks the learner taps with, and their tempo: a beat slow enough to catch every one. */
export const CALIBRATION_CLICKS = 16
export const CALIBRATION_BPM = 80
/** The clicks counted in before the taps are heard. */
export const CALIBRATION_COUNT_IN = 4
/** Fewer taps than this measure nothing. */
export const CALIBRATION_FEWEST = 8
/** The most lateness kept, in milliseconds: more is a missed click, not a piano. */
export const LATENCY_MAX_MS = 300
/** Lateness is kept to this step, in milliseconds. */
export const LATENCY_STEP_MS = 5

/** A saved lateness stands where it is whole steps within the range. */
export const isLatency = (value: unknown): value is number =>
  typeof value === 'number' &&
  Number.isInteger(value) &&
  value >= 0 &&
  value <= LATENCY_MAX_MS &&
  value % LATENCY_STEP_MS === 0

/** The middle of some values, or the mean of the middle two; 0 of none. */
function median(values: readonly number[]): number {
  const sorted = [...values].sort((a, b) => a - b)
  const middle = sorted.slice(Math.ceil(sorted.length / 2) - 1, Math.floor(sorted.length / 2) + 1)
  return middle.reduce((sum, value) => sum + value, 0) / Math.max(1, middle.length)
}

/**
 * How late the piano is heard, in milliseconds, from the clicks and the taps (both in seconds on
 * one clock): each tap against its nearest click within half a beat, the median of those, to the
 * step and within the range. Null where too few taps found a click.
 */
export function calibratedLatency(
  clicks: readonly number[],
  taps: readonly number[],
  bpm: number = CALIBRATION_BPM,
): number | null {
  const half = 30 / bpm
  const offsets = taps.flatMap((tap) => {
    const nearest = clicks.reduce<number | null>(
      (best, click) =>
        best === null || Math.abs(tap - click) < Math.abs(tap - best) ? click : best,
      null,
    )
    return nearest !== null && Math.abs(tap - nearest) < half ? [tap - nearest] : []
  })
  if (offsets.length < CALIBRATION_FEWEST) return null
  const late = Math.round((median(offsets) * 1000) / LATENCY_STEP_MS) * LATENCY_STEP_MS
  return Math.min(LATENCY_MAX_MS, Math.max(0, late))
}
