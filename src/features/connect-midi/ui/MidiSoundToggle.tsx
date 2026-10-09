import { Volume2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { selectMidi, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setMidi } from '@/features/set-preference'
import { RailButton } from '@/shared/ui'
import { isMidiConnected, useMidiConnection } from '../use-midi-connection'

/** The rail's Sound the MIDI keyboard, while a keyboard is connected: the app sounds its keys, or not. */
export function MidiSoundToggle() {
  const { t } = useTranslation('common')
  const store = useSettingsStoreApi()
  const sound = useSettings((state) => selectMidi(state).sound)
  const { connection } = useMidiConnection()
  if (!isMidiConnected(connection)) return null
  return (
    <RailButton
      label={t('rail.sound')}
      icon={Volume2}
      aria-pressed={sound}
      onClick={() => setMidi(store, { sound: !sound })}
    />
  )
}
