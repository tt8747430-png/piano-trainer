import type { NoteParam } from '@/shared/lib/music'
import type { IntervalWay } from '@/shared/lib/schedule'
import type { RowInterval } from './interval-rows'

/** How a row plays its interval, in Play as's order: Ascending, Descending, Harmonic. */
export const INTERVAL_PLAY_WAYS = [
  'up',
  'down',
  'together',
] as const satisfies readonly IntervalWay[]

/** What the Intervals explorer shows: the interval chosen over a root, and how it plays. */
export interface IntervalView {
  readonly root: NoteParam
  readonly way: IntervalWay
  readonly iv: RowInterval
}
