import type { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { TimeSignatureKeys } from './ScoreKeys'
import { SignPopover } from './SignPopover'

/**
 * A time signature's popover (ADR 0094, 0095), opened where it is printed: the palette's Time
 * signature at its bar, the meter from its section on, or the whole song's at its head.
 */
export function TimePopover({ bar, trigger }: { bar: number; trigger: ReactElement }) {
  const { t } = useTranslation('editor')
  return (
    <SignPopover label={t('palette.category.time')} trigger={trigger}>
      <TimeSignatureKeys bar={bar} />
    </SignPopover>
  )
}
