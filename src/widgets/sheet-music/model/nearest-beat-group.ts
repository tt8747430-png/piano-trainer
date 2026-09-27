import type { Performance } from '@/shared/lib/arrangement'
import type { Tick } from '@/shared/lib/music'

/** The beat group of a bar nearest an x on the sheet: where a tap on the bar lands. */
export function nearestBeatGroup(
  performance: Performance,
  bar: number,
  xOf: (tick: Tick) => number,
  x: number,
): number | null {
  let nearest: number | null = null
  let distance = Infinity
  performance.beatGroups.forEach((group, index) => {
    if (group.bar !== bar) return
    const away = Math.abs(xOf(group.tick) - x)
    if (away < distance) {
      nearest = index
      distance = away
    }
  })
  return nearest
}
