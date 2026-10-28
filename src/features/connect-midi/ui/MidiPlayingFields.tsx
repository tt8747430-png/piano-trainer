import { useTranslation } from 'react-i18next'
import { selectMidi, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setMidi } from '@/features/set-preference'
import { OCTAVE_SHIFTS, PEDAL_WAYS, type OctaveShift } from '@/shared/lib'
import { TOUCHES } from '@/shared/lib/schedule'
import { Segmented, SettingField, SettingRows } from '@/shared/ui'
import { useMidiConnection } from '../use-midi-connection'

/** An octave shift as written: a sign before it, the minus a true one. */
const shiftLabel = (shift: OctaveShift) =>
  shift > 0 ? `+${shift}` : shift < 0 ? `−${-shift}` : '0'

/**
 * How the MIDI keyboard plays, on the MIDI screen: its octave shift, its touch and its pedal's way
 * round, each one row whose ⓘ says what it does (ADR 0096). Greyed where the browser cannot
 * connect a keyboard, as the line over the switches says.
 */
export function MidiPlayingFields() {
  const { t } = useTranslation('common')
  const store = useSettingsStoreApi()
  const midi = useSettings(selectMidi)
  const disabled = useMidiConnection().connection.kind === 'unsupported'
  return (
    <SettingRows>
      <SettingField
        label={t('midiSettings.octaveShift.label')}
        info={t('midiSettings.octaveShift.detail')}
      >
        <Segmented
          label={t('midiSettings.octaveShift.label')}
          value={midi.octaveShift}
          disabled={disabled}
          options={OCTAVE_SHIFTS.map((value) => ({ value, label: shiftLabel(value) }))}
          onChange={(octaveShift) => setMidi(store, { octaveShift })}
        />
      </SettingField>
      <SettingField label={t('midiSettings.touch.label')} info={t('midiSettings.touch.detail')}>
        <Segmented
          label={t('midiSettings.touch.label')}
          value={midi.touch}
          disabled={disabled}
          options={TOUCHES.map((value) => ({ value, label: t(`midiSettings.touch.${value}`) }))}
          onChange={(touch) => setMidi(store, { touch })}
        />
      </SettingField>
      <SettingField label={t('midiSettings.pedal.label')} info={t('midiSettings.pedal.detail')}>
        <Segmented
          label={t('midiSettings.pedal.label')}
          value={midi.pedal}
          disabled={disabled}
          options={PEDAL_WAYS.map((value) => ({ value, label: t(`midiSettings.pedal.${value}`) }))}
          onChange={(pedal) => setMidi(store, { pedal })}
        />
      </SettingField>
    </SettingRows>
  )
}
