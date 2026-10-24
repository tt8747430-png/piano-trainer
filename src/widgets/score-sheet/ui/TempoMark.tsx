import { useTranslation } from 'react-i18next'
import { tempoNote, type Meter } from '@/shared/lib/music'
import type { EditPrinted } from '../model/printed'

/**
 * A tempo mark (♩ = 90) over its bar, in the labels' row beside the line's first number (ADR 0074): a
 * button where it is printed, opening what sets the tempo (ADR 0094).
 */
export function TempoMark({
  tempo,
  meter,
  left,
  row,
  size,
  edit,
}: {
  tempo: number
  meter: Meter
  /** Where it starts, in the line's px. */
  left: number
  /** The labels' row over the staff, in CSS px: the mark stands at its top. */
  row: number
  /** The labels' size: 1 at full size. */
  size: number
  edit: EditPrinted
}) {
  const { t } = useTranslation(['editor', 'music'])
  const name = t('editor:printed.tempoMark', { bpm: t('music:bpm', { tempo }) })
  return edit(
    { kind: 'tempo' },
    <button
      type="button"
      tabIndex={-1}
      data-slot="tempo"
      aria-label={name}
      title={name}
      className="absolute z-30 flex cursor-pointer items-baseline gap-0.5 rounded-md whitespace-nowrap tabular-nums transition-colors duration-200 ease-out hover:bg-foreground/5"
      style={{ left, top: -row, fontSize: `${0.875 * size}rem` }}
    >
      <span className="font-music leading-none">{tempoNote(meter)}</span>= {tempo}
    </button>,
  )
}
