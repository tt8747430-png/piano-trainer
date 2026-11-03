import { useTranslation } from 'react-i18next'
import { KeyboardSettingsFields } from '@/features/live-keyboard'
import { SettingsScreen } from '@/widgets/settings-screen'

/**
 * Settings › On-screen piano (R22): the keys drawn on screen, how they look, where they sit, how they
 * play and the buttons over them.
 */
export function OnScreenPianoPage() {
  const { t } = useTranslation('settings')
  return (
    <SettingsScreen title={t('pages.onScreenPiano')}>
      <KeyboardSettingsFields />
    </SettingsScreen>
  )
}
