import { useTranslation } from 'react-i18next'
import { TypingSwitch } from '@/features/live-keyboard'
import { ShortcutsButton } from '@/features/shortcuts-help'
import { SettingRows, SettingsGroup } from '@/shared/ui'
import { SettingsScreen } from '@/widgets/settings-screen'

/**
 * Settings › Computer keys (R22): whether the letters play the on-screen piano (Z X an octave, Space
 * the pedal, in its ⓘ), and the computer's shortcuts.
 */
export function ComputerKeysPage() {
  const { t } = useTranslation('settings')
  return (
    <SettingsScreen title={t('pages.computerKeys')}>
      <SettingsGroup title={t('computerKeys.typingGroup')}>
        <SettingRows>
          <TypingSwitch />
        </SettingRows>
      </SettingsGroup>
      <SettingsGroup title={t('computerKeys.shortcuts')}>
        <ShortcutsButton />
      </SettingsGroup>
    </SettingsScreen>
  )
}
