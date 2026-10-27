import {
  firstPlayedBar,
  writtenBarOf,
  type BarRange,
  type CellBar,
  type PlayedBeat,
} from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'
import type { Span } from './lyric-lines'

/** No bar in the loop. */
const NONE: ReadonlySet<number> = new Set()

/**
 * The bars as written a loop goes round (its bars are the bars played, ADR 0115): where the views
 * that write each bar once mark it, a repeat's bar once.
 */
export function loopedBars(performance: Performance, loop: BarRange | null): ReadonlySet<number> {
  if (!loop) return NONE
  const bars = new Set<number>()
  for (let played = loop.first; played <= loop.last; played++)
    bars.add(writtenBarOf(performance, played))
  return bars
}

/**
 * The beat sounding as ticks (ADR 0108): where it is played, and where the chord views write it, its
 * bar's first pass (a repeat's second time is written once). `played` is every bar as played, in
 * beats (`playedBeatCells`).
 */
export function beatSpan(
  performance: Performance,
  played: readonly CellBar[],
  beat: PlayedBeat,
): { readonly played: Span; readonly written: Span } {
  const bar = played[beat.bar]
  const cell = bar?.cells[beat.beat]
  const start = performance.bars[beat.bar]?.startTick ?? 0
  const first = bar ? (firstPlayedBar(performance, bar.written) ?? beat.bar) : beat.bar
  const writtenStart = performance.bars[first]?.startTick ?? start
  const from = cell?.from ?? 0
  const to = cell?.to ?? from
  return {
    played: { from: start + from, to: start + to },
    written: { from: writtenStart + from, to: writtenStart + to },
  }
}
