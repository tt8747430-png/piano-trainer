import type { ScoreLayout } from '@/shared/ui/score'
import type { PrintedChord } from '../model/field-place'
import { NUMBER_INSET_PX } from '../model/label-row'

/**
 * Over a line's staff: the number of its first bar at its head, as a printed system numbers it, and
 * each chord symbol printed over it (`chords`, none where chord names are hidden); the row as tall as
 * what it holds (`row`), drawn at the line's size. A tempo mark stands in this row too (ADR 0074), a
 * button of its own (`TempoMark`).
 */
export function LineLabels({
  layout,
  chords,
  firstBar,
  row,
  size,
}: {
  layout: ScoreLayout
  chords: readonly PrintedChord[]
  /** The number of the line's first bar. */
  firstBar: number
  /** The row's height in CSS px. */
  row: number
  /** The labels' size: 1 at full size. */
  size: number
}) {
  const [first] = layout.measures
  return (
    <div
      aria-hidden
      data-slot="line-labels"
      className="absolute inset-x-0 bottom-full"
      style={{ height: row }}
    >
      {first ? (
        <span
          className="absolute top-0 text-xs text-muted-foreground tabular-nums"
          style={{ left: first.x + NUMBER_INSET_PX, fontSize: `${0.75 * size}rem` }}
        >
          {firstBar}
        </span>
      ) : null}
      {chords.map((chord) => (
        <span
          key={chord.tick}
          className="absolute bottom-0.5 font-display leading-none font-semibold whitespace-nowrap"
          style={{ left: chord.x, fontSize: chord.size }}
        >
          {chord.symbol}
        </span>
      ))}
    </div>
  )
}
