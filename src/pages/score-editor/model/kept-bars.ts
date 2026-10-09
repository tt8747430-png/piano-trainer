import { takeBarCount, type Take } from '@/entities/take'

/** The bars of a take kept, from 0. */
export interface KeptBars {
  readonly first: number
  readonly last: number
}

/** Every bar of a take kept. */
export const wholeTake = (take: Take): KeptBars => ({ first: 0, last: takeBarCount(take) - 1 })
