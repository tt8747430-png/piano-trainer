import { TEMPO_RANGE } from '@/shared/lib/schedule'

/** The tempo popover's speeds: shares of the piece's tempo. */
export const SPEEDS = [0.5, 0.75, 1] as const

/**
 * The learner's speed (ADR 0105, Chordify's), in percent of the piece's tempo: from half of it to
 * twice it, in steps of 5.
 */
export const SPEED_RANGE = { min: 50, max: 200, step: 5 } as const

/** A share of the piece's tempo, rounded, within the tempos a learner can choose. */
export const speedTempo = (ownTempo: number, share: number): number =>
  Math.min(TEMPO_RANGE.max, Math.max(TEMPO_RANGE.min, Math.round(ownTempo * share)))

/**
 * A tempo as a share of the piece's, in whole percent: the tempo button's label. A tempo a 5% step
 * plays at reads as that step, though it rounds to another share (55% of 72 is played at 40, 56%).
 */
export function percentOf(tempo: number, ownTempo: number): number {
  const share = (tempo / ownTempo) * 100
  const step = Math.round(share / SPEED_RANGE.step) * SPEED_RANGE.step
  return speedTempo(ownTempo, step / 100) === tempo ? step : Math.round(share)
}

/** The speed slider's step nearest a tempo, within the range. */
export const speedStep = (tempo: number, ownTempo: number): number =>
  Math.min(
    SPEED_RANGE.max,
    Math.max(
      SPEED_RANGE.min,
      Math.round((tempo / ownTempo) * (100 / SPEED_RANGE.step)) * SPEED_RANGE.step,
    ),
  )

/**
 * The tempo a step up (1) or down (-1): the next 5% of the piece's tempo that plays at another
 * tempo, from half the piece's tempo to twice it. A tempo already past that end stays; one outside
 * the range comes into it, never the wrong way.
 */
export function stepTempo(tempo: number, ownTempo: number, by: -1 | 1): number {
  const { min, max, step } = SPEED_RANGE
  const end = by > 0 ? max : min
  const share = (tempo / ownTempo) * 100
  let mark = by > 0 ? Math.floor(share / step) + 1 : Math.ceil(share / step) - 1
  for (;;) {
    const percent = Math.min(max, Math.max(min, mark * step))
    const next = speedTempo(ownTempo, percent / 100)
    if (Math.sign(next - tempo) === by) return next
    if (percent === end) return tempo
    mark += by
  }
}
