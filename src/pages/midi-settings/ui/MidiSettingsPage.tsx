import { Link } from '@tanstack/react-router'

import { useTranslation } from 'react-i18next'
import {
  BluetoothPairing,
  MidiConnectionFields,
  MidiDeviceList,
  MidiPlayingFields,
  useMidiLog,
} from '@/features/connect-midi'
import { selectMidi, useSettings } from '@/entities/settings'
import { GroupLink, SettingsGroup } from '@/shared/ui'
import { SettingsScreen } from '@/widgets/settings-screen'

/**
 * Settings › Connect a piano (ADR 0034, R22): MIDI input, output and input plays sound; the devices
 * connected, the one heard chosen; how the keyboard plays (octave shift, touch, pedal) and its timing calibrated; how a
 * Bluetooth keyboard pairs; and, for troubleshooting, the MIDI log. One column (R20).
 */
export function MidiSettingsPage() {
  const { t } = useTranslation(['common', 'settings'])
  const { entries } = useMidiLog()
  const latency = useSettings((state) => selectMidi(state).latency)
  return (
    <SettingsScreen title={t('settings:pages.connectPiano')}>
      <MidiConnectionFields />
      <SettingsGroup
        title={t('midiSettings.devices.label')}
        info={t('midiSettings.devices.info')}
        flush
      >
        <MidiDeviceList />
      </SettingsGroup>
      <SettingsGroup flush title={t('midiSettings.playing')}>
        <MidiPlayingFields />
        <GroupLink
          label={t('midiSettings.timing.label')}
          value={t('midiSettings.timing.value', { latency })}
          render={<Link to="/settings/connect-piano/timing" />}
        />
      </SettingsGroup>
      <SettingsGroup title={t('midiSettings.bluetooth.label')} flush>
        <BluetoothPairing />
      </SettingsGroup>
      <SettingsGroup title={t('midiSettings.troubleshooting')} flush>
        <GroupLink
          label={t('midiSettings.log.label')}
          value={t('midiSettings.log.count', { count: entries.length })}
          render={<Link to="/settings/connect-piano/log" />}
        />
      </SettingsGroup>
    </SettingsScreen>
  )
}
