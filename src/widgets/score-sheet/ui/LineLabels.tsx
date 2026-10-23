import { chordLabelSizes } from '@/shared/lib'
import { printedSymbol, tempoNote } from '@/shared/lib/music'
import type { TimedMusic } from '@/shared/lib/notation'
import { xAtTick, type ScoreLayout } from '@/shared/ui/score'

/** A bar's number sits this far right of its barline, clear of the line. */
const NUMBER_INSET_PX = 4
/** A tempo at the line's head stands this far right of its bar's number. */
const AFTER_NUMBER_PX = 24
/** A chord name's size at full size where it has the room: smaller where many share a bar. */
const CHORD_PX = 16

/**
 * Over a line's staff: the number of its first bar at its head, as a printed system numbers it (the
 * Player's sheet, read as it plays, numbers every bar), a tempo at the head of its bar (ADR 0074: in
 * this row, not a row of its own over the staff), and with chord names each chord symbol at its
 * onset; the row as tall as
 * what it holds (`row`), drawn at the line's size.
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
  const sizes = chordLabelSizes(chords, last ? last.x + last.width : layout.width, CHORD_PX * size)
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
      {music.bars.map((bar, index) => {
        const at = layout.measures[index]
        if (bar.tempo === undefined || !at) return null
        return (
          <span
            key={`tempo ${index}`}
            data-slot="tempo"
            className="absolute top-0 flex items-baseline gap-0.5 whitespace-nowrap tabular-nums"
            style={{
              left: at.x + NUMBER_INSET_PX + (index === 0 ? AFTER_NUMBER_PX * size : 0),
              fontSize: `${0.875 * size}rem`,
            }}
          >
            <span className="font-music leading-none">{tempoNote(music.meter)}</span>= {bar.tempo}
          </span>
        )
      })}
      {chords.map((chord, index) => (
        <span
          key={index}
          className="absolute bottom-0.5 font-display leading-none font-semibold whitespace-nowrap"
          style={{ left: chord.x, fontSize: sizes[index] }}
        >
          {chord.symbol}
        </span>
      ))}
    </div>
  )
}
