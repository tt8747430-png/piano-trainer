import { memo, useMemo } from 'react'
import type { Performance } from '@/shared/lib/arrangement'
import { usePositionName } from '@/shared/ui'
import { barLabels, LabelRow, labelRow, labelScale, type ScoreLayout } from '@/shared/ui/score'
import { chordPositions } from '../model/chord-positions'

/**
 * Over the staff, the labels' row the editor's sheet prints too (ADR 0087, 0095): the line's first
 * bar's number, as LilyPond and a printed system number a line's start (each bar is still a button to
 * tap, which says its number to a screen reader), a section's name at its first bar and a tempo mark
 * where it changes; each chord symbol at its onset (spec §2.6), with Chord positions how the right
 * hand plays it.
 */
export const SheetLabels = memo(function SheetLabels({
  layout,
  performance,
  headings,
  positions,
  chordNames = true,
  tempos = [],
  firstBar = 0,
  size = 1,
}: {
  /** The line's size: its labels drawn with it, never under `labelScale`'s least. */
  size?: number
  /** Each bar of the piece's tempo mark, said after its number. */
  tempos?: readonly (number | undefined)[]
  layout: ScoreLayout
  performance: Performance
  headings: readonly string[]
  positions: boolean
  /** The chord symbols over the staff: off, only the bars' labels. */
  chordNames?: boolean
  /** The piece's bar the layout's first measure is: a line of a score laid out in lines. */
  firstBar?: number
}) {
  const positionName = usePositionName()
  const placed = useMemo(
    () => (positions ? chordPositions(performance) : []),
    [positions, performance],
  )
  const labels = useMemo(
    () =>
      barLabels(
        performance.bars.map((bar, index) => ({ section: bar.section, tempo: tempos[index] })),
        firstBar,
        firstBar + layout.measures.length,
      ),
    [performance, tempos, firstBar, layout],
  )
  const chords = chordNames
    ? performance.chords.map((chord, index) => {
        const position = placed[index]
        return {
          startTick: chord.startTick,
          symbol: chord.symbol,
          ...(position ? { detail: positionName(position) } : {}),
        }
      })
    : []
  return (
    <LabelRow
      layout={layout}
      labels={labels}
      headings={headings}
      chords={chords}
      meter={performance.meter}
      row={labelRow(chordNames, size)}
      size={labelScale(size)}
    />
  )
})
