import type { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { KeyPicker } from './ScoreKeys'
import { SignPopover } from './SignPopover'

/**
 * A key signature's popover (ADR 0094, 0114), opened where it is printed: the key signature picker at
 * its bar, the key from its section on, or the song's own at its head.
 */
export function KeyPopover({ bar, trigger }: { bar: number; trigger: ReactElement }) {
  const { t } = useTranslation('editor')
  return (
    <SignPopover label={t('palette.category.key')} wide trigger={trigger}>
      <KeyPicker bar={bar} />
    </SignPopover>
  )
}
