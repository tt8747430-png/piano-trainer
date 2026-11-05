import type { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useSignatureFrom } from '../model/use-signature-from'
import { SignPicker } from './SignPicker'
import { TimePicker } from './TimePicker'

/**
 * A time signature's picker (ADR 0114, 0097), opened where it is printed: its meter from its
 * section on, or the whole song's (with its pickup) at its head, said under its title.
 */
export function TimePopover({ bar, trigger }: { bar: number; trigger: ReactElement }) {
  const { t } = useTranslation('editor')
  const { said } = useSignatureFrom(bar)
  return (
    <SignPicker title={t('palette.category.time')} description={said} trigger={trigger}>
      {(close) => <TimePicker bar={bar} onDone={close} />}
    </SignPicker>
  )
}
