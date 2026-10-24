import { chordLabels } from '@/shared/lib'
import { printedSymbol } from '@/shared/lib/music'
import type { TimedMusic } from '@/shared/lib/notation'
import { xAtTick, type ScoreLayout } from '@/shared/ui/score'
import { NUMBER_INSET_PX } from '../model/label-row'

/** A chord name's size at full size where it has the room: smaller where many share a bar. */
const CHORD_PX = 16

/**
 * Over a line's staff: the number of its first bar at its head, as a printed system numbers it, and
 * with chord names each chord symbol at its onset; the row as tall as what it holds (`row`), drawn at
 * the line's size. A tempo mark stands in this row too (ADR 0074), a button of its own (`TempoMark`).
 */
export function LineLabels({
  layout,
  music,
  firstBar,
  chordNames,
  row,
  size,
}: {
  layout: ScoreLayout
  music: TimedMusic
  /** The number of the line's first bar. */
  firstBar: number
  /** Whether the chord symbols are shown. */
  chordNames: boolean
  /** The row's height in CSS px. */
  row: number
  /** The labels' size: 1 at full size. */
  size: number
}) {
  const [first] = layout.measures
  const last = layout.measures.at(-1)
  const chords = (chordNames ? music.chords : []).map((chord) => ({
    symbol: printedSymbol(chord.symbol),
    x: xAtTick(layout, chord.startTick),
  }))
  const labels = chordLabels(chords, last ? last.x + last.width : layout.width, CHORD_PX * size)
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
      {chords.map((chord, index) => (
        <span
          key={index}
          className="absolute bottom-0.5 font-display leading-none font-semibold whitespace-nowrap"
          style={{ left: labels[index]?.x ?? chord.x, fontSize: labels[index]?.size }}
        >
          {chord.symbol}
        </span>
      ))}
    </div>
  )
}
