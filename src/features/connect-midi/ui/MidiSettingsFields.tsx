import { useTranslation } from 'react-i18next'
import { selectMidi, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setMidi } from '@/features/set-preference'
import { OCTAVE_SHIFTS, PEDAL_WAYS, type OctaveShift } from '@/shared/lib'
import { TOUCHES } from '@/shared/lib/schedule'
import { Dropdown, Segmented, SettingField, SwitchRow } from '@/shared/ui'
import { useMidiConnection } from '../use-midi-connection'

/** Any keyboard, in the Keyboard choice: a name no keyboard has. */
const ANY = ''

/** An octave shift as written: a sign before it, the minus a true one. */
const shiftLabel = (shift: OctaveShift) =>
  shift > 0 ? `+${shift}` : shift < 0 ? `−${-shift}` : '0'

/**
 * The MIDI keyboard's settings, as Settings lists them under its connection (spec 2026-10-09 §3.1):
 * the keyboard heard (the ones connected now, and the one chosen while it is away), whether the app
 * sounds its keys or its own music through it, its octave shift, its touch and its pedal's way round.
 * Nothing where the browser cannot connect a keyboard.
 */
export function MidiSettingsFields() {
  const { t } = useTranslation('common')
  const store = useSettingsStoreApi()
  const midi = useSettings(selectMidi)
  const { connection } = useMidiConnection()
  if (connection.kind === 'unsupported') return null
  const status = connection.kind === 'ready' ? connection.status : null
  const connected = status && 'devices' in status ? status.devices : []
  const away = midi.device !== null && !connected.includes(midi.device) ? [midi.device] : []
  return (
    <div className="flex flex-col gap-4">
      <SettingField label={t('midiSettings.device.label')}>
        <Dropdown
          label={t('midiSettings.device.label')}
          bare
          value={midi.device ?? ANY}
          options={[
            { value: ANY, label: t('midiSettings.device.any') },
            ...connected.map((device) => ({ value: device, label: device })),
            ...away.map((device) => ({
              value: device,
              label: t('midiSettings.device.away', { device }),
            })),
          ]}
          onChange={(device) => setMidi(store, { device: device === ANY ? null : device })}
          className="self-start"
        />
      </SettingField>
      <div>
        <SwitchRow
          label={t('midiSettings.sound')}
          detail={t('midiSettings.soundNote')}
          checked={midi.sound}
          onCheckedChange={(sound) => setMidi(store, { sound })}
        />
        <SwitchRow
          label={t('midiSettings.throughPiano')}
          detail={t('midiSettings.throughPianoNote')}
          checked={midi.throughPiano}
          onCheckedChange={(throughPiano) => setMidi(store, { throughPiano })}
          className="border-b-0"
        />
      </div>
      <SettingField label={t('midiSettings.octaveShift')}>
        <Segmented
          label={t('midiSettings.octaveShift')}
          value={midi.octaveShift}
          options={OCTAVE_SHIFTS.map((value) => ({ value, label: shiftLabel(value) }))}
          onChange={(octaveShift) => setMidi(store, { octaveShift })}
        />
      </SettingField>
      <SettingField label={t('midiSettings.touch.label')}>
        <Segmented
          label={t('midiSettings.touch.label')}
          value={midi.touch}
          options={TOUCHES.map((value) => ({ value, label: t(`midiSettings.touch.${value}`) }))}
          onChange={(touch) => setMidi(store, { touch })}
        />
      </SettingField>
      <SettingField label={t('midiSettings.pedal.label')}>
        <Segmented
          label={t('midiSettings.pedal.label')}
          value={midi.pedal}
          options={PEDAL_WAYS.map((value) => ({ value, label: t(`midiSettings.pedal.${value}`) }))}
          onChange={(pedal) => setMidi(store, { pedal })}
        />
      </SettingField>
    </div>
  )
}
