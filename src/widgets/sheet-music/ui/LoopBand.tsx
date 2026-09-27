import { useTranslation } from 'react-i18next'
import type { BarRange } from '@/features/practice'
import type { ScoreLayout } from '@/shared/ui/score'
import { LoopGrip } from './LoopGrip'

/** The loop: a muted band behind its bars, and a grip at each end (spec §2.6). */
export function LoopBand({
  layout,
  loop,
  onChange,
}: {
  layout: ScoreLayout
  loop: BarRange
  onChange: (loop: BarRange) => void
}) {
  const { t } = useTranslation('music')
  const first = layout.measures[loop.first]
  const last = layout.measures[loop.last]
  if (!first || !last) return null
  const left = first.x
  const right = last.x + last.width
  return (
    <>
      <div
        aria-hidden
        className="absolute inset-y-0 z-0 bg-muted"
        style={{ left, width: right - left }}
      />
      <LoopGrip
        label={t('sheet.loopStart')}
        x={left}
        bar={loop.first}
        min={0}
        max={loop.last}
        measures={layout.measures}
        onMove={(bar) => onChange({ first: bar, last: loop.last })}
      />
      <LoopGrip
        label={t('sheet.loopEnd')}
        x={right}
        bar={loop.last}
        min={loop.first}
        max={layout.measures.length - 1}
        measures={layout.measures}
        onMove={(bar) => onChange({ first: loop.first, last: bar })}
      />
    </>
  )
}
