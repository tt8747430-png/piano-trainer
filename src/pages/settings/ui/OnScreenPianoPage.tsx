import { useTranslation } from 'react-i18next'
import { KeyboardSettingsFields } from '@/features/live-keyboard'
import { ShortcutsButton } from '@/features/shortcuts-help'
import { hasFinePointer } from '@/shared/lib'
import { SettingsGroup } from '@/shared/ui'
import { SettingsScreen } from '@/widgets/settings-screen'

/**
 * Settings › On-screen piano (R22, R33): the keys drawn on screen, how they sound, look, play and sit;
 * on a computer, the computer keys' switch among them and the shortcuts' list (R29: no page of their
 * own, and none on a phone, which has no letters to play).
 */
export function OnScreenPianoPage() {
  const { t } = useTranslation('settings')
  return (
    <SettingsScreen title={t('pages.onScreenPiano')}>
      <KeyboardSettingsFields />
      {hasFinePointer() ? (
        <SettingsGroup title={t('pages.computerKeys')}>
          <ShortcutsButton />
        </SettingsGroup>
      ) : null}
    </SettingsScreen>
  )
}
