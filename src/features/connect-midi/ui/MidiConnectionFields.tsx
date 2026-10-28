import { CircleAlert, Piano, Speaker, Volume2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { selectMidi, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setMidi } from '@/features/set-preference'
import { InfoTip, SettingRows, SwitchRow } from '@/shared/ui'
import { useMidiInput } from '../use-midi-input'

/**
 * The MIDI keyboard's switches, as the MIDI screen opens with them: MIDI input (the app hears the
 * keyboards), MIDI output (the app's music on the keyboard's speaker) and MIDI input plays sound.
 * Output and sound need input, and say so while greyed. Where the browser has no Web MIDI, or MIDI
 * was blocked, a line over them says so, its ⓘ how to put it right.
 */
export function MidiConnectionFields() {
  const { t } = useTranslation('common')
  const store = useSettingsStoreApi()
  const { sound, throughPiano } = useSettings(selectMidi)
  const { connection, on, turn } = useMidiInput()
  const unsupported = connection.kind === 'unsupported'
  const denied = connection.kind === 'ready' && connection.status.state === 'denied'
  const needsInput = unsupported ? undefined : t('midiSettings.needsInput')
  return (
    <div className="flex flex-col gap-3">
      {unsupported || denied ? (
        <p
          role="status"
          className="flex items-start gap-2 rounded-xl bg-muted px-3 py-2 text-pretty"
        >
          <CircleAlert aria-hidden className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
          <span className="min-w-0">
            {unsupported ? t('midi.unsupported') : t('midi.denied')}
            <InfoTip
              name={unsupported ? t('midi.unsupported') : t('midi.denied')}
              className="ms-1.5 align-middle"
            >
              {unsupported ? t('midiSettings.unsupportedNote') : t('midiSettings.deniedNote')}
            </InfoTip>
          </span>
        </p>
      ) : null}
      <SettingRows>
        <SwitchRow
          icon={<Piano />}
          label={t('midiSettings.input')}
          info={t('midiSettings.inputNote')}
          checked={on}
          disabled={unsupported}
          onCheckedChange={turn}
        />
        <SwitchRow
          icon={<Speaker />}
          label={t('midiSettings.output')}
          info={t('midiSettings.outputNote')}
          checked={on && throughPiano}
          disabled={!on}
          reason={needsInput}
          onCheckedChange={(next) => setMidi(store, { throughPiano: next })}
        />
        <SwitchRow
          icon={<Volume2 />}
          label={t('midiSettings.sound')}
          info={t('midiSettings.soundNote')}
          checked={on && sound}
          disabled={!on}
          reason={needsInput}
          onCheckedChange={(next) => setMidi(store, { sound: next })}
        />
      </SettingRows>
    </div>
  )
}
