import { useTranslation } from 'react-i18next'
import { selectMidi, useSettings } from '@/entities/settings'
import { useMidiConnection } from './use-midi-connection'

/**
 * The MIDI keyboard's state in a word or a name, as Settings' row shows it at its right: the keyboard
 * heard (the one chosen, the one connected, or how many), else why there is none.
 */
export function useMidiSummary(): string {
  const { t } = useTranslation('common')
  const chosen = useSettings((state) => selectMidi(state).device)
  const { connection } = useMidiConnection()
  switch (connection.kind) {
    case 'unsupported':
      return t('midiSettings.summary.unavailable')
    case 'idle':
      return t('midiSettings.summary.off')
    case 'connecting':
      return t('midiSettings.summary.connecting')
    case 'ready':
      break
  }
  const { status } = connection
  switch (status.state) {
    case 'off':
      return t('midiSettings.summary.off')
    case 'denied':
      return t('midiSettings.summary.denied')
    case 'no-device':
      return t('midiSettings.summary.noDevice')
    case 'away':
      return t('midiSettings.summary.away', { device: status.device })
    case 'connected': {
      const [only] = status.devices
      if (chosen !== null) return chosen
      return status.devices.length === 1 && only !== undefined
        ? only
        : t('midiSettings.summary.devices', { count: status.devices.length })
    }
  }
}
