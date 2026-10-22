import type { Performance } from '@/shared/lib/arrangement'
import type { Tick } from '@/shared/lib/music'

/**
 * The beat group a tap on a bar lands on: the written note nearest the tap's x (of the bar's
 * `onsets`), then the beat group sounding as it does, the last to start at or before it. A note tied
 * over a beat is written twice and starts no group of its own: its second half is still its group's.
 */
export function beatGroupAt(
  performance: Performance,
  bar: number,
  onsets: readonly { readonly tick: Tick; readonly x: number }[],
  x: number,
): number | null {
  const groups = performance.beatGroups.flatMap((group, index) =>
    group.bar === bar ? [{ tick: group.tick, index }] : [],
  )
  const first = groups[0]
  if (!first) return null
  let tapped: Tick = first.tick
  let distance = Infinity
  for (const onset of onsets) {
    const away = Math.abs(onset.x - x)
    if (away < distance) {
      tapped = onset.tick
      distance = away
    }
  }
  return groups.findLast((group) => group.tick <= tapped)?.index ?? first.index
}
