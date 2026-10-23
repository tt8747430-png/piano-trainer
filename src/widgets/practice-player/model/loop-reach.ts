import type { BarRange } from '@/features/practice'

/** How far Shift with an arrow (or Home and End) takes the loop's moving end: a bar, or to an end. */
export type LoopReach = 'bar' | 'end'

/**
 * The loop once Shift with an arrow moves its far end (ADR 0086), as the editor's Shift extends what
 * is chosen: from where the choice began (`anchor`, else the loop's start, else the cursor's bar) its
 * other end goes a bar back or on, or to the first or last bar, shrinking as it comes back; with no
 * loop, it begins at the cursor's bar. Its anchor is kept for the next move.
 */
export function reachLoop(
  loop: BarRange | null,
  anchor: number | null,
  cursorBar: number,
  by: LoopReach,
  direction: -1 | 1,
  bars: number,
): { readonly loop: BarRange; readonly anchor: number } {
  const from =
    loop && anchor !== null && (anchor === loop.first || anchor === loop.last)
      ? anchor
      : (loop?.first ?? cursorBar)
  const head = loop ? (from === loop.first ? loop.last : loop.first) : cursorBar
  const to =
    by === 'end'
      ? direction < 0
        ? 0
        : bars - 1
      : Math.max(0, Math.min(bars - 1, head + direction))
  return { loop: { first: Math.min(from, to), last: Math.max(from, to) }, anchor: from }
}
