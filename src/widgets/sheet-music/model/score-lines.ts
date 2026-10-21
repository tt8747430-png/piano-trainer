import type { Performance } from '@/shared/lib/arrangement'
import type { TimeSignature } from '@/shared/lib/music'
import { breakLine } from '@/shared/lib'
import type { Score } from '@/shared/lib/notation'

/** A line of a score laid out in lines: the piece's bars it holds, and its own score. */
export interface ScoreLine {
  /** The piece's index of its first bar. */
  readonly first: number
  readonly score: Score
  /** The time signature in force before it: printed again only where it changes. */
  readonly timeBefore: TimeSignature | undefined
}

/**
 * A score cut into the chart's lines (each section's, as it is written), each its own score of the
 * measures it holds: what the Player lays out down the screen or on pages. A chart line wider than
 * `fit.room` is cut into as few lines as hold it, as even as they come by its measures' `widths`
 * (ADR 0074).
 */
export function scoreLines(
  score: Score,
  performance: Performance,
  fit?: { readonly room: number; readonly widths: readonly number[] },
): ScoreLine[] {
  const lines: ScoreLine[] = []
  const add = (from: number, to: number) =>
    lines.push({
      first: from,
      score: { ...score, measures: score.measures.slice(from, to) },
      timeBefore: score.measures[from - 1]?.time,
    })
  let start = 0
  score.measures.forEach((_, index) => {
    const bar = performance.bars[index]
    const next = performance.bars[index + 1]
    const ends = !next || next.section !== bar?.section || next.line !== bar.line
    if (!ends) return
    const sizes = fit
      ? breakLine(fit.widths.slice(start, index + 1), fit.room)
      : [index + 1 - start]
    for (const size of sizes) {
      add(start, start + size)
      start += size
    }
  })
  return lines
}
