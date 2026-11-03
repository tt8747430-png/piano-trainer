import { useTranslation } from 'react-i18next'
import { MidiLog } from '@/features/connect-midi'
import { InfoTip } from '@/shared/ui'
import { SettingsScreen } from '@/widgets/settings-screen'

/**
 * Settings › MIDI keyboard › MIDI log (ADR 0034): what the MIDI devices send, live, to see why a key
 * or a pedal is not heard.
 */
export function MidiLogPage() {
  const { t } = useTranslation('common')
  return (
    <SettingsScreen
      title={t('midiSettings.log.label')}
      sub
      actions={<InfoTip name={t('midiSettings.log.label')}>{t('midiSettings.log.info')}</InfoTip>}
    >
      <MidiLog />
    </SettingsScreen>
  )
}
