import type { Performance } from '@/shared/lib/arrangement'

// The bar as written (the chart's, counted from 0), as the Player, the editor and the chord views
// share it (ADR 0115, 0108): the Player plays the repeats taken, so a bar it plays may be one
// written earlier, and its loop and numbers are the bars played.

/** The written bar a bar played is: its own index, unless the repeats are played (`unfold`). */
export const writtenBarOf = (performance: Performance, played: number): number =>
  performance.bars[played]?.written ?? played

/** The written bar a beat group is in: the bar it plays, as the chart writes it. */
export function writtenBarAt(performance: Performance, beatGroup: number): number {
  return writtenBarOf(performance, performance.beatGroups[beatGroup]?.bar ?? 0)
}

/** Where a written bar is played the first time, among the bars played; none for a bar the music does not have. */
export function firstPlayedBar(performance: Performance, written: number): number | null {
  const played = performance.bars.findIndex((_, i) => writtenBarOf(performance, i) === written)
  return played < 0 ? null : played
}

/**
 * The first beat group from a written bar on, the first time it is played: where the Player's cursor
 * opens on that bar. None for a bar the music does not have.
 */
export function beatGroupInBar(performance: Performance, written: number): number | null {
  const played = firstPlayedBar(performance, written)
  if (played === null) return null
  const group = performance.beatGroups.findIndex((each) => each.bar >= played)
  return group < 0 ? null : group
}
