import type { NoteParam } from '@/shared/lib/music'
import type { IntervalWay } from '@/shared/lib/schedule'

/** How a row plays its interval, in the switch's order: both notes at once, up, or down. */
export const INTERVAL_PLAY_WAYS = [
  'together',
  'up',
  'down',
] as const satisfies readonly IntervalWay[]

/** What the Intervals explorer shows: every interval over a root, and how a row plays it. */
export interface IntervalView {
  readonly root: NoteParam
  readonly way: IntervalWay
}
