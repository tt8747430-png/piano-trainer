import { TEMPO_RANGE } from '@/shared/lib/schedule'

/** The tempo popover's speeds: shares of the piece's tempo. */
export const SPEEDS = [0.5, 0.75, 1] as const

/** A share of the piece's tempo, rounded, within the tempos a learner can choose. */
export const speedTempo = (ownTempo: number, share: number): number =>
  Math.min(TEMPO_RANGE.max, Math.max(TEMPO_RANGE.min, Math.round(ownTempo * share)))

/** A tempo as a share of the piece's, in whole percent: the tempo button's label. */
export const percentOf = (tempo: number, ownTempo: number): number =>
  Math.round((tempo / ownTempo) * 100)
