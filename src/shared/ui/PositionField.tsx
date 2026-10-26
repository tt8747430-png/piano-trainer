import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { fitInversion, type Inversion, type RowPosition } from '@/shared/lib/music'
import { InversionChoice } from './InversionChoice'
import { Labelled } from './Labelled'
import { SwitchRow } from './SwitchRow'

/**
 * Where a row's hand stands: the first chord's inversion, each drawn as its stack of `notes` notes,
 * and Nearest: on, each chord after the first moves to the nearest hand; off, every one stays in the
 * first one's inversion. Where it is greyed, `info` says why beside its name (ADR 0096).
 */
export function PositionField({
  notes,
  position,
  disabled = false,
  info,
  onChange,
}: {
  notes: number
  position: RowPosition
  disabled?: boolean
  /** Why it is greyed, opened from the ⓘ beside its name. */
  info?: ReactNode
  onChange: (change: { inversion?: Inversion; nearest?: boolean }) => void
}) {
  const { t } = useTranslation('music')
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <Labelled label={t('position.first')} info={info}>
        <InversionChoice
          notes={notes}
          label={t('position.first')}
          disabled={disabled}
          value={fitInversion(position.inversion, notes)}
          onChange={(inversion) => onChange({ inversion: inversion as Inversion })}
        />
      </Labelled>
      <SwitchRow
        className="border-b-0"
        label={t('position.nearest')}
        info={t('position.nearestInfo')}
        checked={position.nearest}
        disabled={disabled}
        onCheckedChange={(nearest) => onChange({ nearest })}
      />
    </div>
  )
}
