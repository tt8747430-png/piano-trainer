import type { Performance } from '@/shared/lib/arrangement'
import type { TimeSignature } from '@/shared/lib/music'
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
 * measures it holds: what the Player lays out down the screen or on pages.
 */
export function scoreLines(score: Score, performance: Performance): ScoreLine[] {
  const lines: ScoreLine[] = []
  let start = 0
  score.measures.forEach((_, index) => {
    const bar = performance.bars[index]
    const next = performance.bars[index + 1]
    const ends = !next || next.section !== bar?.section || next.line !== bar.line
    if (!ends) return
    lines.push({
      first: start,
      score: { ...score, measures: score.measures.slice(start, index + 1) },
      timeBefore: score.measures[start - 1]?.time,
    })
    start = index + 1
  })
  return lines
}
