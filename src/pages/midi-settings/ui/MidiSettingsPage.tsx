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
import { OpensMark, SettingsGroup } from '@/shared/ui'
import { SettingsScreen } from '@/widgets/settings-screen'

/** A row that opens a page under this one (the board's link row): its name, its value, a chevron. */
function GroupLink({
  label,
  value,
  to,
}: {
  label: string
  value: string
  to: '/settings/connect-piano/timing' | '/settings/connect-piano/log'
}) {
  return (
    <Link
      to={to}
      className="flex min-h-13 items-center gap-2.5 py-1.5 ps-4 pe-3 transition-colors hover:bg-foreground/[0.04]"
    >
      <span className="shrink-0">{label}</span>
      <span className="min-w-0 flex-1 truncate text-end text-muted-foreground tabular-nums">
        {value}
      </span>
      <OpensMark />
    </Link>
  )
}

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
          to="/settings/connect-piano/timing"
        />
      </SettingsGroup>
      <SettingsGroup title={t('midiSettings.bluetooth.label')} flush>
        <BluetoothPairing />
      </SettingsGroup>
      <SettingsGroup title={t('midiSettings.troubleshooting')} flush>
        <GroupLink
          label={t('midiSettings.log.label')}
          value={t('midiSettings.log.count', { count: entries.length })}
          to="/settings/connect-piano/log"
        />
      </SettingsGroup>
    </SettingsScreen>
  )
}
