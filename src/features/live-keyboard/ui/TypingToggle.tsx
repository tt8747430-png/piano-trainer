import { Keyboard } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { selectKeyboard, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setKeyboard } from '@/features/set-preference'
import { RailButton } from '@/shared/ui'

/**
 * The rail's typing toggle: the computer keyboard plays the keys, each wearing its letter. A screen
 * touched with a finger has no letters to type, and does not see it.
 */
export function TypingToggle() {
  const { t } = useTranslation('common')
  const store = useSettingsStoreApi()
  const typing = useSettings((state) => selectKeyboard(state).typing)
  return (
    <RailButton
      label={t('keyboardSettings.typing')}
      title={`${t('keyboardSettings.typing')} (${t('keyboardSettings.typingHint')})`}
      icon={Keyboard}
      aria-pressed={typing}
      onClick={() => setKeyboard(store, { typing: !typing })}
      className="pointer-coarse:hidden"
    />
  )
}
