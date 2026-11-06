import type { BarRange } from '@/features/practice'
import { LoopGrip } from '@/shared/ui'
import { barsBand, loopEnds, ScoreMark, type ScoreLayout } from '@/shared/ui/score'
import { barAt } from '../model/bar-at'

/**
 * The loop, the Player's bars chosen (ADR 0096): one light band of the selection colour over every
 * staff in sight for its bars, its notes coloured as the editor's chosen notes are, and a grip at
 * each end on its barline, clear of an accidental after the first.
 */
export function LoopBand({
  layout,
  loop,
  onChange,
  firstBar = 0,
}: {
  layout: ScoreLayout
  loop: BarRange
  onChange: (loop: BarRange) => void
  /** The piece's bar the layout's first measure is: a line of a score laid out in lines. */
  firstBar?: number
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
  // The bar of this line under a point on the screen, in the layout's px however the sheet is
  // zoomed (a page canvas's zoom): its measures, offset to the piece's bars.
  const onLine = (x: number, grip: HTMLElement) => {
    const sheet = grip.parentElement
    const frame = sheet?.getBoundingClientRect()
    if (!sheet || !frame) return null
    const zoom = sheet.offsetWidth > 0 && frame.width > 0 ? frame.width / sheet.offsetWidth : 1
    return barAt(layout.measures, (x - frame.left) / zoom) + firstBar
  }
  return (
    <>
      <ScoreMark slot="loop" kind="band" box={box} />
      {from === loop.first ? (
        <LoopGrip
          end="start"
          bar={loop.first}
          min={firstBar}
          max={Math.min(loop.last, lastBar)}
          barAt={(x, _, grip) => onLine(x, grip)}
          style={{ left: ends.start, top: box.top, height: box.height }}
          onMove={(bar) => onChange({ first: bar, last: loop.last })}
        />
      ) : null}
      {to === loop.last ? (
        <LoopGrip
          end="end"
          bar={loop.last}
          min={Math.max(loop.first, firstBar)}
          max={lastBar}
          barAt={(x, _, grip) => onLine(x, grip)}
          style={{ left: ends.end, top: box.top, height: box.height }}
          onMove={(bar) => onChange({ first: loop.first, last: bar })}
        />
      ) : null}
    </>
  )
}
