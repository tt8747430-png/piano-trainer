import type { BarRange } from '@/features/practice'
import { LoopGrip } from '@/shared/ui'
import { barsBand, loopEnds, ScoreMark, type ScoreLayout } from '@/shared/ui/score'
import { barUnderPoint } from '../model/line-under'

/**
 * The loop, the Player's bars chosen (ADR 0096): one light honey band over every
 * staff in sight for its bars, its notes coloured as the editor's chosen notes are, and a grip at
 * each end on its barline, clear of an accidental after the first.
 */
export function LoopBand({
  layout,
  loop,
  onChange,
  firstBar = 0,
  lastPieceBar,
  pickup,
}: {
  layout: ScoreLayout
  loop: BarRange
  onChange: (loop: BarRange) => void
  /** The piece's bar the layout's first measure is: a line of a score laid out in lines. */
  firstBar?: number
  /** The piece's last bar: a grip is dragged across lines up to it. */
  lastPieceBar: number
  /** Whether the piece opens on a pickup: its bars numbered from the first full one. */
  pickup: boolean
}) {
  const lastBar = firstBar + layout.measures.length - 1
  // On a line, the part of the loop it holds, a grip where the loop ends there.
  if (loop.last < firstBar || loop.first > lastBar) return null
  const from = Math.max(loop.first, firstBar)
  const to = Math.min(loop.last, lastBar)
  const box = barsBand(layout, from - firstBar, to - firstBar, {
    top: layout.staffTop,
    bottom: layout.staffBottom,
  })
  // Each grip on its barline, down the band's edge.
  const ends = loopEnds(layout, from - firstBar, to - firstBar)
  return (
    <>
      <ScoreMark slot="loop" kind="loop" box={box} />
      {from === loop.first ? (
        <LoopGrip
          end="start"
          bar={loop.first}
          pickup={pickup}
          min={0}
          max={loop.last}
          barAt={barUnderPoint}
          style={{ left: ends.start, top: box.top, height: box.height }}
          onMove={(bar) => onChange({ first: bar, last: loop.last })}
        />
      ) : null}
      {to === loop.last ? (
        <LoopGrip
          end="end"
          bar={loop.last}
          pickup={pickup}
          min={loop.first}
          max={lastPieceBar}
          barAt={barUnderPoint}
          style={{ left: ends.end, top: box.top, height: box.height }}
          onMove={(bar) => onChange({ first: loop.first, last: bar })}
        />
      ) : null}
    </>
  )
}
