import { useTranslation } from 'react-i18next'
import { selectMidi, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setMidi } from '@/features/set-preference'
import { OCTAVE_SHIFTS, PEDAL_WAYS, type OctaveShift } from '@/shared/lib'
import { TOUCHES } from '@/shared/lib/schedule'
import { GroupRow, GroupSegmented, Stepper } from '@/shared/ui'

/** An octave shift as written: a sign before it, the minus a true one. */
const shiftLabel = (shift: number) => (shift > 0 ? `+${shift}` : shift < 0 ? `−${-shift}` : '0')

const LOWEST = Math.min(...OCTAVE_SHIFTS)
const HIGHEST = Math.max(...OCTAVE_SHIFTS)

/**
 * How the MIDI keyboard plays (the board's Playing): Octave shift a − n + stepper at its row's end,
 * then Touch and Pedal as segmented rows. Rows of a flush settings group.
 */
export function MidiPlayingFields() {
  const { t } = useTranslation('common')
  const store = useSettingsStoreApi()
  const midi = useSettings(selectMidi)
  return (
    <>
      <GroupRow setting="midi.octaveShift" label={t('midiSettings.octaveShift.label')}>
        <Stepper
          label={t('midiSettings.octaveShift.label')}
          value={midi.octaveShift}
          min={LOWEST}
          max={HIGHEST}
          format={shiftLabel}
          onChange={(next) => setMidi(store, { octaveShift: next as OctaveShift })}
          decrease={t('midiSettings.octaveShift.down')}
          increase={t('midiSettings.octaveShift.up')}
        />
      </GroupRow>
      <GroupSegmented
        setting="midi.touch"
        label={t('midiSettings.touch.label')}
        value={midi.touch}
        options={TOUCHES.map((value) => ({ value, label: t(`midiSettings.touch.${value}`) }))}
        onChange={(touch) => setMidi(store, { touch })}
      />
      <GroupSegmented
        setting="midi.pedal"
        label={t('midiSettings.pedal.label')}
        value={midi.pedal}
        options={PEDAL_WAYS.map((value) => ({ value, label: t(`midiSettings.pedal.${value}`) }))}
        onChange={(pedal) => setMidi(store, { pedal })}
      />
    </>
  )
}
