import type { Performance } from '@/shared/lib/arrangement'

// The bar as written (the chart's, counted from 0), as the Player and the editor share it (ADR 0090):
// the Player plays the repeats taken, so a bar it plays may be one written earlier.

/** The written bar a beat group is in: the bar it plays, as the chart writes it. */
export function writtenBarAt(performance: Performance, beatGroup: number): number {
  const played = performance.beatGroups[beatGroup]?.bar ?? 0
  return performance.bars[played]?.written ?? played
}

/**
 * The first beat group from a written bar on, the first time it is played: where the Player's cursor
 * opens on that bar. None for a bar the music does not have.
 */
export function beatGroupInBar(performance: Performance, written: number): number | null {
  const played = performance.bars.findIndex((bar, i) => (bar.written ?? i) === written)
  if (played < 0) return null
  const group = performance.beatGroups.findIndex((each) => each.bar >= played)
  return group < 0 ? null : group
}
