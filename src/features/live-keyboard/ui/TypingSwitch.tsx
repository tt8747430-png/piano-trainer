import { useTranslation } from 'react-i18next'
import { selectKeyboard, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setKeyboard } from '@/features/set-preference'
import { SwitchRow } from '@/shared/ui'

/** Whether the computer's letters play the on-screen piano: General's Computer keyboard group. */
export function TypingSwitch() {
  const { t } = useTranslation('common')
  const store = useSettingsStoreApi()
  const typing = useSettings((state) => selectKeyboard(state).typing)
  return (
    <SwitchRow
      setting="keyboard.typing"
      label={t('keyboardSettings.typing')}
      checked={typing}
      onCheckedChange={(on) => setKeyboard(store, { typing: on })}
    />
  )
}
