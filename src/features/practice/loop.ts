import type { Performance } from '@/shared/lib/arrangement'
import { beatsToTicks, type Tick } from '@/shared/lib/music'

/** The bars a loop goes round, first to last, counted from 0. */
export interface BarRange {
  readonly first: number
  readonly last: number
}

/** The beat groups a loop goes round, first to last: what the practice machine keeps inside. */
export interface BeatGroupRange {
  readonly first: number
  readonly last: number
}

/** A loop in the URL: its bars as printed, `3-6`. */
export type LoopParam = `${number}-${number}`

const WRITTEN = /^([1-9]\d*)-([1-9]\d*)$/

export function isLoopParam(value: unknown): value is LoopParam {
  const match = typeof value === 'string' ? WRITTEN.exec(value) : null
  return match !== null && Number(match[1]) <= Number(match[2])
}

export const loopParam = ({ first, last }: BarRange): LoopParam => `${first + 1}-${last + 1}`

/** The bars a loop param names, or none: a param past the piece's last bar is another arrangement's. */
export function readLoop(param: LoopParam | undefined, bars: number): BarRange | null {
  const match = param === undefined ? null : WRITTEN.exec(param)
  if (!match) return null
  const first = Number(match[1]) - 1
  const last = Number(match[2]) - 1
  return first <= last && last < bars ? { first, last } : null
}

/** The loop's first and last beat groups; none when no note starts in its bars. */
export function loopBeatGroups(performance: Performance, bars: BarRange): BeatGroupRange | null {
  const inside = (bar: number) => bar >= bars.first && bar <= bars.last
  const first = performance.beatGroups.findIndex((group) => inside(group.bar))
  const last = performance.beatGroups.findLastIndex((group) => inside(group.bar))
  return first < 0 ? null : { first, last }
}

/** The ticks a loop spans, from its first bar's start to its last bar's end. */
export function loopTicks(performance: Performance, bars: BarRange): { from: Tick; to: Tick } {
  const first = performance.bars[bars.first]
  const last = performance.bars[bars.last]
  return {
    from: first?.startTick ?? 0,
    to: last ? last.startTick + beatsToTicks(last.beats) : performance.totalTicks,
  }
}
