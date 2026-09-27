import type { Tick } from '@/shared/lib/music'
import type { ScoreLayout } from './engrave'

/** The x of any tick: an onset's own, or in proportion between the onsets around it and its bar's end. */
export function xAtTick(layout: ScoreLayout, tick: Tick): number {
  const measure =
    layout.measures.find((m) => tick < m.startTick + m.ticks) ?? layout.measures.at(-1)
  if (!measure) return 0
  const end = measure.startTick + measure.ticks
  const points = [
    ...layout.onsets.filter((onset) => onset.tick >= measure.startTick && onset.tick < end),
    { tick: end, x: measure.x + measure.width },
  ]
  const next = points.findIndex((point) => point.tick >= tick)
  const after = points[next]
  const before = points[next - 1]
  if (!after) return measure.x + measure.width
  if (!before || after.tick === tick) return after.x
  return before.x + ((after.x - before.x) * (tick - before.tick)) / (after.tick - before.tick)
}
