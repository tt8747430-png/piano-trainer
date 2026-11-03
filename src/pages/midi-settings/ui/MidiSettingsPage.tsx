import { Link } from '@tanstack/react-router'
import { ScrollText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  BluetoothPairing,
  MidiConnectionFields,
  MidiDeviceList,
  MidiPlayingFields,
  useMidiLog,
} from '@/features/connect-midi'
import { RowLink, SettingsGroup } from '@/shared/ui'
import { SettingsScreen } from '@/widgets/settings-screen'

/**
 * Settings › MIDI keyboard (ADR 0034): MIDI input, output and input plays sound; the devices
 * connected, the one heard chosen; how the keyboard plays (octave shift, touch, pedal); how a
 * Bluetooth keyboard pairs; and, for troubleshooting, the MIDI log. One column (R20).
 */
export function MidiSettingsPage() {
  const { t } = useTranslation('common')
  const { entries } = useMidiLog()
  return (
    <SettingsScreen title={t('midi.label')}>
      <section aria-label={t('midi.label')} className="card px-5 py-4">
        <MidiConnectionFields />
      </section>
      <SettingsGroup
        title={t('midiSettings.devices.label')}
        info={t('midiSettings.devices.info')}
        flush
      >
        <MidiDeviceList />
      </SettingsGroup>
      <SettingsGroup title={t('midiSettings.playing')}>
        <MidiPlayingFields />
      </SettingsGroup>
      <SettingsGroup title={t('midiSettings.bluetooth.label')} flush>
        <BluetoothPairing />
      </SettingsGroup>
      <SettingsGroup title={t('midiSettings.troubleshooting')} flush>
        <RowLink
          title={t('midiSettings.log.label')}
          icon={ScrollText}
          paint="sand"
          value={t('midiSettings.log.count', { count: entries.length })}
          render={<Link to="/settings/midi/log" />}
        />
      </SettingsGroup>
    </SettingsScreen>
  )
}
