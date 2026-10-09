import { TEMPO_RANGE } from '@/shared/lib/schedule'

/** The tempo popover's speeds: shares of the piece's tempo. */
export const SPEEDS = [0.5, 0.75, 1] as const

/** A share of the piece's tempo, rounded, within the tempos a learner can choose. */
export const speedTempo = (ownTempo: number, share: number): number =>
  Math.min(TEMPO_RANGE.max, Math.max(TEMPO_RANGE.min, Math.round(ownTempo * share)))

/** A tempo as a share of the piece's, in whole percent: the tempo button's label. */
export const percentOf = (tempo: number, ownTempo: number): number =>
  Math.round((tempo / ownTempo) * 100)

/** A shortcut's tempo step, in percent of the piece's tempo. */
const STEP = 5

/** The tempo a step up (1) or down (-1): the next 5% of the piece's tempo, within the range. */
export function stepTempo(tempo: number, ownTempo: number, by: -1 | 1): number {
  const percent = percentOf(tempo, ownTempo)
  const next = by > 0 ? Math.floor(percent / STEP) + 1 : Math.ceil(percent / STEP) - 1
  return speedTempo(ownTempo, (next * STEP) / 100)
}
