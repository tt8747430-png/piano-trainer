import { useTranslation } from 'react-i18next'
import { fitInversion, type Inversion, type RowPosition } from '@/shared/lib/music'
import { InversionChoice } from './InversionChoice'
import { SwitchRow } from './SwitchRow'

/**
 * Where a row's hand stands: the first chord's inversion, each drawn as its stack of `notes` notes,
 * and Nearest: on, each chord after the first moves to the nearest hand; off, every one stays in the
 * first one's inversion.
 */
export function PositionField({
  notes,
  position,
  disabled = false,
  onChange,
}: {
  notes: number
  position: RowPosition
  disabled?: boolean
  onChange: (change: { inversion?: Inversion; nearest?: boolean }) => void
}) {
  const { t } = useTranslation('music')
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <span aria-hidden className="text-sm text-muted-foreground">
        {t('position.first')}
      </span>
      <InversionChoice
        notes={notes}
        label={t('position.first')}
        disabled={disabled}
        value={fitInversion(position.inversion, notes)}
        onChange={(inversion) => onChange({ inversion: inversion as Inversion })}
      />
      <SwitchRow
        className="border-b-0"
        label={t('position.nearest')}
        detail={t(position.nearest ? 'position.nearestOn' : 'position.nearestOff')}
        checked={position.nearest}
        disabled={disabled}
        onCheckedChange={(nearest) => onChange({ nearest })}
      />
    </div>
  )
}
