import type { Performance } from '@/shared/lib/arrangement'
import type { BarRange } from './loop'

// The bar as written (the chart's, counted from 0), as the Player, the editor, the chord chart and
// the song's form share it (ADR 0090, 0098): the Player plays the repeats taken, so a bar it plays
// may be one written earlier, and its loop and numbers are the bars played.

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
 * Written bars (a section's) as the bars played, what the Player loops and numbers: from the first
 * time the first is played, on while the bars played are among them, so a repeat inside them is
 * every pass of it; none where the music does not have the first.
 */
export function playedBars(performance: Performance, written: BarRange): BarRange | null {
  const first = firstPlayedBar(performance, written.first)
  if (first === null) return null
  let last = first
  while (last + 1 < performance.bars.length) {
    const next = writtenBarOf(performance, last + 1)
    if (next < written.first || next > written.last) break
    last++
  }
  return { first, last }
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
