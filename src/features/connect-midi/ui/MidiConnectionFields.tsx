import { CircleAlert } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { selectMidi, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setMidi } from '@/features/set-preference'
import { InfoTip, SettingsGroup, SwitchRow } from '@/shared/ui'
import { useMidiInput } from '../use-midi-input'

/**
 * The MIDI keyboard's group (the board's: plain switch rows), as the MIDI screen opens with it: MIDI input (the app hears the
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
    <>
      {unsupported || denied ? (
        <p
          role="status"
          className="flex items-start gap-2 rounded-control bg-muted px-3 py-2 text-pretty"
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
      <SettingsGroup flush title={t('midi.label')}>
        <SwitchRow
          setting="midi.input"
          label={t('midiSettings.input')}
          checked={on}
          disabled={unsupported}
          onCheckedChange={turn}
        />
        <SwitchRow
          setting="midi.throughPiano"
          label={t('midiSettings.output')}
          checked={on && throughPiano}
          disabled={!on}
          reason={needsInput}
          onCheckedChange={(next) => setMidi(store, { throughPiano: next })}
        />
        <SwitchRow
          setting="midi.sound"
          label={t('midiSettings.sound')}
          checked={on && sound}
          disabled={!on}
          reason={needsInput}
          onCheckedChange={(next) => setMidi(store, { sound: next })}
        />
      </SettingsGroup>
    </>
  )
}
