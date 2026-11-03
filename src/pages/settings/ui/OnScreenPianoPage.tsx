import { useTranslation } from 'react-i18next'
import { KeyboardSettingsFields, TypingSwitch } from '@/features/live-keyboard'
import { ShortcutsButton } from '@/features/shortcuts-help'
import { hasFinePointer } from '@/shared/lib'
import { SettingRows, SettingsGroup } from '@/shared/ui'
import { SettingsScreen } from '@/widgets/settings-screen'

/**
 * Settings › On-screen piano (R22): the keys drawn on screen, how they look, where they sit, how they
 * play and the buttons over them; on a computer, the computer keys too (R29: no page of their own,
 * and none on a phone, which has no letters to play).
 */
export function OnScreenPianoPage() {
  const { t } = useTranslation('settings')
  return (
    <SettingsScreen title={t('pages.onScreenPiano')}>
      <KeyboardSettingsFields />
      {hasFinePointer() ? (
        <SettingsGroup title={t('pages.computerKeys')}>
          <SettingRows>
            <TypingSwitch />
          </SettingRows>
          <ShortcutsButton />
        </SettingsGroup>
      ) : null}
    </SettingsScreen>
  )
}
