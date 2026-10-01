import type { Tick } from '@/shared/lib/music'
import type { ScoreLayout } from './engrave'

/**
 * The x of a tick among a bar's points in tick order (its onsets, then its end): a point's own, or in
 * proportion between the two around it; past the last, the last's.
 */
export function xAmong(points: readonly { tick: Tick; x: number }[], tick: Tick): number {
  const next = points.findIndex((point) => point.tick >= tick)
  const after = points[next]
  const before = points[next - 1]
  if (!after) return points.at(-1)?.x ?? 0
  if (!before || after.tick === tick) return after.x
  return before.x + ((after.x - before.x) * (tick - before.tick)) / (after.tick - before.tick)
}

/**
 * The x of any tick: an onset's own, or in proportion between the onsets around it, its bar's start
 * where nothing is written there (where its notes begin) and its bar's end.
 */
export function xAtTick(layout: ScoreLayout, tick: Tick): number {
  const measure =
    layout.measures.find((m) => tick < m.startTick + m.ticks) ?? layout.measures.at(-1)
  if (!measure) return 0
  const end = measure.startTick + measure.ticks
  const onsets = layout.onsets.filter(
    (onset) => onset.tick >= measure.startTick && onset.tick < end,
  )
  const opening = onsets.some((onset) => onset.tick === measure.startTick)
    ? []
    : [{ tick: measure.startTick, x: measure.notes }]
  return xAmong([...opening, ...onsets, { tick: end, x: measure.x + measure.width }], tick)
}
