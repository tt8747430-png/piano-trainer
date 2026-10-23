import type { Performance } from '@/shared/lib/arrangement'
import type { Tick } from '@/shared/lib/music'

/**
 * The beat group a note chosen on the sheet is in (ADR 0088): the last to start at or before its
 * tick. A note tied over a beat is written twice and starts no group of its own: its second half is
 * still its group's. None before the first.
 */
export function groupOfTick(performance: Performance, tick: Tick): number | null {
  const index = performance.beatGroups.findLastIndex((group) => group.tick <= tick)
  return index < 0 ? null : index
}
