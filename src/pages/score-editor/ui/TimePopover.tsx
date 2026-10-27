import type { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { SignPopover } from './SignPopover'
import { TimePicker } from './TimePicker'

/**
 * A time signature's popover (ADR 0094, 0095, 0114), opened where it is printed: the time signature
 * picker at its bar, the meter from its section on, or the whole song's (with its pickup) at its head.
 */
export function TimePopover({ bar, trigger }: { bar: number; trigger: ReactElement }) {
  const { t } = useTranslation('editor')
  return (
    <SignPopover label={t('palette.category.time')} trigger={trigger}>
      {(close) => <TimePicker bar={bar} onDone={close} />}
    </SignPopover>
  )
}
