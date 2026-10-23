import { useTranslation } from 'react-i18next'
import type { BarRange } from '@/features/practice'
import { rangeBox, ScoreMark, type ScoreLayout } from '@/shared/ui/score'
import { LoopGrip } from './LoopGrip'

/**
 * The loop: its bars marked as the one selection marks the bars chosen (ADR 0082), the editor's
 * alike, and a grip at each end (spec §2.6).
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
  const { t } = useTranslation('music')
  const lastBar = firstBar + layout.measures.length - 1
  // On a line, the part of the loop it holds, a grip where the loop ends there.
  if (loop.last < firstBar || loop.first > lastBar) return null
  const from = Math.max(loop.first, firstBar)
  const to = Math.min(loop.last, lastBar)
  const box = rangeBox(layout, from - firstBar, to - firstBar, {
    top: layout.staffTop,
    bottom: layout.staffBottom,
  })
  const left = box.left
  const right = box.left + box.width
  // The grips move bars of this line: their measures, offset to the piece's bars.
  const along = (bar: number) => bar - firstBar
  return (
    <>
      <ScoreMark slot="loop" kind="range" box={box} />
      {from === loop.first ? (
        <LoopGrip
          label={t('sheet.loopStart')}
          x={left}
          top={box.top}
          height={box.height}
          bar={along(loop.first)}
          min={0}
          max={Math.min(loop.last, lastBar) - firstBar}
          measures={layout.measures}
          onMove={(bar) => onChange({ first: bar + firstBar, last: loop.last })}
        />
      ) : null}
      {to === loop.last ? (
        <LoopGrip
          label={t('sheet.loopEnd')}
          x={right}
          top={box.top}
          height={box.height}
          bar={along(loop.last)}
          min={Math.max(loop.first, firstBar) - firstBar}
          max={layout.measures.length - 1}
          measures={layout.measures}
          onMove={(bar) => onChange({ first: loop.first, last: bar + firstBar })}
        />
      ) : null}
    </>
  )
}
