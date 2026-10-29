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
import { BackButton, RowLink, ScreenHeader, SettingsGroup } from '@/shared/ui'

/**
 * Settings › MIDI keyboard (ADR 0034): MIDI input, output and input plays sound; the devices
 * connected, the one heard chosen; how the keyboard plays (octave shift, touch, pedal); how a
 * Bluetooth keyboard pairs; and, for troubleshooting, the MIDI log. Two columns from a laptop's
 * width, as Settings has.
 */
export function MidiSettingsPage() {
  const { t } = useTranslation('common')
  const { entries } = useMidiLog()
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('midi.label')}
        back={<BackButton fallback={{ to: '/settings/playing' }} />}
      />
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-10">
        <div className="flex flex-col gap-6">
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
          <SettingsGroup title={t('midiSettings.bluetooth.label')} flush>
            <BluetoothPairing />
          </SettingsGroup>
        </div>
        <div className="flex flex-col gap-6">
          <SettingsGroup title={t('midiSettings.playing')}>
            <MidiPlayingFields />
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
        </div>
      </div>
    </div>
  )
}
