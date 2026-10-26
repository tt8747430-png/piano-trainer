import type { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { KeySignatureKeys } from './ScoreKeys'
import { SignPopover } from './SignPopover'

/**
 * A key signature's popover (ADR 0094), opened where it is printed: the palette's Key signature at its
 * bar, the key from its section on, or the song's own at its head.
 */
export function KeyPopover({ bar, trigger }: { bar: number; trigger: ReactElement }) {
  const { t } = useTranslation('editor')
  return (
    <SignPopover label={t('palette.category.key')} trigger={trigger}>
      <KeySignatureKeys bar={bar} />
    </SignPopover>
  )
}
