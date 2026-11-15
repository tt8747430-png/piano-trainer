import { useTranslation } from 'react-i18next'
import { KeyboardSettingsFields, TypingSwitch } from '@/features/live-keyboard'
import { ShortcutsButton } from '@/features/shortcuts-help'
import { hasFinePointer } from '@/shared/lib'
import { SettingsGroup } from '@/shared/ui'
import { SettingsScreen } from '@/widgets/settings-screen'
import { PianoSoundGroup } from './PianoSoundGroup'

/**
 * Settings › On-screen piano (the board's P_PIANO): the keys previewed, Keys, Sound (the grand kept
 * for offline, the Volume), Display, While you play, Placement; on a computer, Computer keyboard
 * last, its switch and the shortcuts' row, with what the letters do behind its ⓘ (none on a phone,
 * which has no letters to play).
 */
export function OnScreenPianoPage() {
  const { t } = useTranslation(['settings', 'common'])
  return (
    <SettingsScreen title={t('pages.onScreenPiano')}>
      <KeyboardSettingsFields sound={<PianoSoundGroup />} />
      {hasFinePointer() ? (
        <SettingsGroup
          flush
          title={t('pages.computerKeys')}
          info={`${t('common:keyboardSettings.typingNote')} ${t('common:keyboardSettings.typingHint')}`}
        >
          <TypingSwitch />
          <ShortcutsButton />
        </SettingsGroup>
      ) : null}
    </SettingsScreen>
  )
}
