import { useTranslation } from 'react-i18next'
import { MidiLog } from '@/features/connect-midi'
import { BackButton, InfoTip, ScreenHeader } from '@/shared/ui'

/**
 * Settings › MIDI keyboard › MIDI log (ADR 0034): what the MIDI devices send, live, to see why a key
 * or a pedal is not heard.
 */
export function MidiLogPage() {
  const { t } = useTranslation('common')
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('midiSettings.log.label')}
        back={<BackButton fallback={{ to: '/settings/midi' }} />}
        actions={<InfoTip name={t('midiSettings.log.label')}>{t('midiSettings.log.info')}</InfoTip>}
      />
      <div className="mx-auto w-full max-w-3xl">
        <MidiLog />
      </div>
    </div>
  )
}
