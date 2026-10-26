import { beatAt, type CellBar } from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'
import type { Tick } from '@/shared/lib/music'
import { rubberBand } from './swipe'

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

/** Each beat's place along the strip as drawn, and the frame's width. */
export interface StripLayout {
  readonly room: number
  readonly lefts: readonly number[]
  readonly widths: readonly number[]
}

/** How far a flick carries the strip on, slowing: the glide's time constant, in milliseconds. */
export const GLIDE_MS = 325

/**
 * How much further a flick at `velocity` (px a millisecond) carries the strip as it slows to rest:
 * an exponential decay with `GLIDE_MS`'s time constant, as a scroll view's momentum, so the glide
 * starts at the finger's speed (ADR 0108).
 */
export function glide(velocity: number): number {
  return velocity * GLIDE_MS
}

/** The strip's shifts with its first beat at the mark and with its last: how far it is dragged. */
export function stripEnds({ room, lefts, widths }: StripLayout): {
  readonly first: number
  readonly last: number
} {
  const end = Math.max(0, lefts.length - 1)
  return {
    first: stripShift({ room, lefts, widths, cell: 0, through: 0 }),
    last: stripShift({ room, lefts, widths, cell: end, through: 0 }),
  }
}

/** The strip as drawn under a finger at `shift`: one to one between its ends, a rubber band past. */
export function stripDrawn(
  shift: number,
  { first, last }: { readonly first: number; readonly last: number },
  room: number,
): number {
  if (shift > first) return first + rubberBand(shift - first, room)
  if (shift < last) return last + rubberBand(shift - last, room)
  return shift
}

/** The beat at the strip's mark at a shift: the one whose middle is nearest it. */
export function beatAtMark({
  room,
  lefts,
  widths,
  shift,
}: StripLayout & { shift: number }): number {
  const mark = room * STANDS - shift
  let nearest = 0
  let distance = Infinity
  lefts.forEach((left, cell) => {
    const off = Math.abs(left + (widths[cell] ?? 0) / 2 - mark)
    if (off < distance) {
      distance = off
      nearest = cell
    }
  })
  return nearest
}

/**
 * The beat the strip settles on as the finger lets go at `shift` (ADR 0108): where a flick's glide
 * would bring it to rest, the beat then at the mark; under reduced motion (`still`) it glides
 * nowhere, settling on the beat at the mark as it is let go.
 */
export function stripRelease({
  shift,
  velocity,
  still,
  ...layout
}: StripLayout & { shift: number; velocity: number; still: boolean }): number {
  return beatAtMark({ ...layout, shift: shift + (still ? 0 : glide(velocity)) })
}
