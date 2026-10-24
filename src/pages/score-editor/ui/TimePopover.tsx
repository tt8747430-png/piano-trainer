import type { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { TimeSignatureKeys } from './ScoreKeys'
import { SignPopover } from './SignPopover'

/**
 * The time signature's popover (ADR 0094), opened where it is printed: the palette's Time signature,
 * the song's meter, another of its kind.
 */
export function TimePopover({ trigger }: { trigger: ReactElement }) {
  const { t } = useTranslation('editor')
  return (
    <SignPopover label={t('palette.category.time')} trigger={trigger}>
      <TimeSignatureKeys />
    </SignPopover>
  )
}
