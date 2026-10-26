import { beatAt, type CellBar } from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'
import type { Tick } from '@/shared/lib/music'

/** Where the beat sounding stands along the strip: a third of the way in. */
const STANDS = 1 / 3

/** Each bar's first beat, counted along the strip from 0. */
export function firstBeats(bars: readonly CellBar[]): number[] {
  const firsts: number[] = []
  let counted = 0
  for (const { cells } of bars) {
    firsts.push(counted)
    counted += cells.length
  }
  return firsts
}

/**
 * The beat along the strip a tick is in (as played, the repeats taken) and how far through it, from
 * 0 at its start to 1 at its end: where the strip stands, frame by frame (ADR 0108).
 */
export function beatThrough(
  performance: Performance,
  bars: readonly CellBar[],
  tick: Tick,
): { readonly cell: number; readonly through: number } {
  const { bar, beat, startTick } = beatAt(performance, tick)
  const cell = bars[bar]?.cells[beat]
  const length = cell ? cell.to - cell.from : 0
  const through = length > 0 ? Math.min(1, Math.max(0, (tick - startTick) / length)) : 0
  return { cell: (firstBeats(bars)[bar] ?? 0) + beat, through }
}

/**
 * How far the strip is moved under its frame (ADR 0101, 0108): the beat sounding's middle a third of
 * the way in as it starts, sliding on through it to the next beat's place as it ends. `lefts` and
 * `widths` are each beat's along the strip, as drawn; `room` the frame's width.
 */
export function stripShift({
  room,
  lefts,
  widths,
  cell,
  through,
}: {
  room: number
  lefts: readonly number[]
  widths: readonly number[]
  cell: number
  through: number
}): number {
  const left = lefts[cell] ?? 0
  const width = widths[cell] ?? 0
  const next = lefts[cell + 1] ?? left + width
  return room * STANDS - width / 2 - (left + through * (next - left))
}
