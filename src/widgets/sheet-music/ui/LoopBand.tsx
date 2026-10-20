import { useTranslation } from 'react-i18next'
import type { BarRange } from '@/features/practice'
import type { ScoreLayout } from '@/shared/ui/score'
import { LoopGrip } from './LoopGrip'

/** The loop: a muted band behind its bars, and a grip at each end (spec §2.6). */
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
  const first = layout.measures[from - firstBar]
  const last = layout.measures[to - firstBar]
  if (!first || !last) return null
  const left = first.x
  const right = last.x + last.width
  // The grips move bars of this line: their measures, offset to the piece's bars.
  const along = (bar: number) => bar - firstBar
  return (
    <>
      <div
        aria-hidden
        className="absolute inset-y-0 z-0 bg-muted"
        style={{ left, width: right - left }}
      />
      {from === loop.first ? (
        <LoopGrip
          label={t('sheet.loopStart')}
          x={left}
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
