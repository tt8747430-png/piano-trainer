import { memo, useMemo } from 'react'
import type { Performance } from '@/shared/lib/arrangement'
import { cn } from '@/shared/lib'
import { usePositionName } from '@/shared/ui'
import { xAtTick, type ScoreLayout } from '@/shared/ui/score'
import { chordPositions } from '../model/chord-positions'

/** A bar's number sits this far right of its barline, clear of the line. */
const NUMBER_INSET_PX = 4

/**
 * Over the staff: each bar's number, a section's name at its first bar and a tempo mark where it
 * changes (cut short to the bar), and each chord symbol at its
 * onset (spec §2.6), with Chord positions how the right hand plays it. The bars' buttons carry the
 * same words for a screen reader.
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
  return (
    <div aria-hidden className={cn('absolute inset-x-0 bottom-full', chordNames ? 'h-11' : 'h-5')}>
      {layout.measures.map((measure, index) => {
        const bar = firstBar + index
        const section = performance.bars[bar]?.section
        const starts = section !== undefined && section !== performance.bars[bar - 1]?.section
        return (
          <span
            key={index}
            className="absolute top-0 truncate text-xs text-muted-foreground tabular-nums"
            // Kept to its own bar, clear of the next bar's number: a long section name is cut short.
            style={{
              left: measure.x + NUMBER_INSET_PX,
              maxWidth: Math.max(0, measure.width - 2 * NUMBER_INSET_PX),
            }}
          >
            {bar + 1}
            {starts && headings[section] ? ` · ${headings[section]}` : null}
            {tempos[bar] === undefined ? null : (
              <>
                {' · '}
                <span className="font-music">{'\u{1D15F}'}</span>= {tempos[bar]}
              </>
            )}
          </span>
        )
      })}
      {performance.chords.map((chord, index) =>
        !chordNames || !inLine(chord.startTick) ? null : (
          <span
            key={index}
            className="absolute bottom-0.5 font-display text-lg font-semibold whitespace-nowrap"
            style={{ left: xAtTick(layout, chord.startTick) }}
          >
            {chord.symbol}
            {placed[index] ? (
              <span className="ml-1 font-sans text-xs font-normal text-muted-foreground">
                {positionName(placed[index])}
              </span>
            ) : null}
          </span>
        ),
      )}
    </div>
  )
})
