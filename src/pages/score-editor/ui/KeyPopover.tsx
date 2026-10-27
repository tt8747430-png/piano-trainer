import type { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useSignatureFrom } from '../model/use-signature-from'
import { KeyPicker } from './KeyPicker'
import { SignPicker } from './SignPicker'

/**
 * A key signature's picker (ADR 0094, 0114), opened where it is printed: the key from its section on,
 * or the song's own at its head, said under its title.
 */
export function KeyPopover({ bar, trigger }: { bar: number; trigger: ReactElement }) {
  const { t } = useTranslation('editor')
  const { said } = useSignatureFrom(bar)
  return (
    <SignPicker title={t('palette.category.key')} description={said} wide trigger={trigger}>
      <KeyPicker bar={bar} />
    </SignPicker>
  )
}
