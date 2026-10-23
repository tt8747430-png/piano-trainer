import { memo, useMemo } from 'react'
import type { Performance } from '@/shared/lib/arrangement'
import { chordLabels, cn } from '@/shared/lib'
import { printedSymbol, tempoNote } from '@/shared/lib/music'
import { usePositionName } from '@/shared/ui'
import { xAtTick, type ScoreLayout } from '@/shared/ui/score'
import { chordPositions } from '../model/chord-positions'

/** A bar's number sits this far right of its barline, clear of the line. */
const NUMBER_INSET_PX = 4
/** A chord name's size where it has the room: smaller where many share a bar. */
const CHORD_PX = 16

/**
 * Over the staff: the line's first bar's number, as LilyPond and a printed system number a line's
 * start (each bar is still a button to tap, which says its number to a screen reader), a section's
 * name at its first bar and a tempo mark where it changes (cut short to the bar), and each chord
 * symbol at its onset (spec §2.6), with Chord positions how the right hand plays it.
 */
export const SheetLabels = memo(function SheetLabels({
  layout,
  performance,
  headings,
  positions,
  chordNames = true,
  tempos = [],
  firstBar = 0,
}: {
  /** Each bar of the piece's tempo mark, said after its number. */
  tempos?: readonly (number | undefined)[]
  layout: ScoreLayout
  performance: Performance
  headings: readonly string[]
  positions: boolean
  /** The chord symbols over the staff: off, only the bars' numbers. */
  chordNames?: boolean
  /** The piece's bar the layout's first measure is: a line of a score laid out in lines. */
  firstBar?: number
}) {
  const positionName = usePositionName()
  const placed = useMemo(
    () => (positions ? chordPositions(performance) : []),
    [positions, performance],
  )
  const [opening] = layout.measures
  const closing = layout.measures.at(-1)
  const inLine = (tick: number) =>
    opening !== undefined &&
    closing !== undefined &&
    tick >= opening.startTick &&
    tick < closing.startTick + closing.ticks
  const shown = chordNames
    ? performance.chords.flatMap((chord, index) =>
        inLine(chord.startTick)
          ? [
              {
                index,
                symbol: printedSymbol(chord.symbol),
                x: xAtTick(layout, chord.startTick),
              },
            ]
          : [],
      )
    : []
  const labels = chordLabels(
    shown.map(({ index, symbol, x }) => {
      const position = placed[index]
      return { x, symbol: position ? `${symbol} ${positionName(position)}` : symbol }
    }),
    closing ? closing.x + closing.width : layout.width,
    CHORD_PX,
  )
  return (
    <div aria-hidden className={cn('absolute inset-x-0 bottom-full', chordNames ? 'h-11' : 'h-5')}>
      {layout.measures.map((measure, index) => {
        const bar = firstBar + index
        const section = performance.bars[bar]?.section
        const starts = section !== undefined && section !== performance.bars[bar - 1]?.section
        // The line's first bar is numbered, as a printed system is; a later bar says only a section or tempo.
        const parts = [
          ...(index === 0 ? [String(bar + 1)] : []),
          ...(starts && headings[section] ? [headings[section]] : []),
          ...(tempos[bar] === undefined
            ? []
            : [
                <span key="tempo">
                  <span className="font-music">{tempoNote(performance.meter)}</span>= {tempos[bar]}
                </span>,
              ]),
        ]
        if (parts.length === 0) return null
        return (
          <span
            key={index}
            className="absolute top-0 truncate text-xs text-muted-foreground tabular-nums"
            // Kept to its own bar, clear of the next bar's label: a long section name is cut short.
            style={{
              left: measure.x + NUMBER_INSET_PX,
              maxWidth: Math.max(0, measure.width - 2 * NUMBER_INSET_PX),
            }}
          >
            {parts.flatMap((part, at) => (at === 0 ? [part] : [' · ', part]))}
          </span>
        )
      })}
      {shown.map(({ index, symbol, x }, at) => (
        <span
          key={index}
          className="absolute bottom-0.5 font-display leading-none font-semibold whitespace-nowrap"
          style={{ left: labels[at]?.x ?? x, fontSize: labels[at]?.size }}
        >
          {symbol}
          {placed[index] ? (
            <span className="ml-1 font-sans text-[0.7em] font-normal text-muted-foreground">
              {positionName(placed[index])}
            </span>
          ) : null}
        </span>
      ))}
    </div>
  )
})
