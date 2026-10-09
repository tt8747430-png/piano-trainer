import { CircleDot } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { selectRecorder, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { selectRoomLeft, useTakes } from '@/entities/take'
import { isMidiConnected, MidiControl, useMidiConnection } from '@/features/connect-midi'
import { barAt } from '@/features/score-editor'
import { setRecorderClick, setRecorderTune } from '@/features/set-preference'
import { Fact, SwitchRow } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'

/**
 * What a take is recorded to (the song's tempo and meter, from the caret's bar), the click, the tune
 * under it where the song has one, and Record: with a MIDI keyboard connected and room in the takes.
 */
export function RecordPanel() {
  const { t } = useTranslation('editor')
  const { takes } = useScoreEditorContext()
  const tempo = useEditorState((state) => state.draft.tempo)
  const meter = useEditorState((state) => state.draft.meter)
  const fromBar = useEditorState((state) => barAt(state.draft, state.caret).index + 1)
  const hasTune = useEditorState((state) => state.draft.melody.length > 0)
  const { click, tune } = useSettings(selectRecorder)
  const settings = useSettingsStoreApi()
  const room = useTakes(selectRoomLeft)
  const { connection } = useMidiConnection()
  const connected = isMidiConnected(connection)
  return (
    <section className="flex flex-col gap-4">
      <dl className="flex flex-col gap-1">
        <Fact term={t('song.tempo')}>{t('song.bpm', { tempo })}</Fact>
        <Fact term={t('song.meter')}>{meter}</Fact>
        <Fact term={t('recorder.from')}>{fromBar}</Fact>
      </dl>
      <div>
        <SwitchRow
          label={t('recorder.click')}
          checked={click}
          onCheckedChange={(on) => setRecorderClick(settings, on)}
        />
        {hasTune ? (
          <SwitchRow
            label={t('recorder.tune')}
            checked={tune}
            onCheckedChange={(on) => setRecorderTune(settings, on)}
          />
        ) : null}
      </div>
      {connected ? null : <MidiControl />}
      {takes.page.kind === 'takes' && takes.page.nothingPlayed ? (
        <p role="status">{t('recorder.nothing')}</p>
      ) : null}
      {room === 0 ? <p>{t('recorder.full')}</p> : null}
      <Button size="lg" disabled={!connected || room === 0} onClick={takes.record}>
        <CircleDot data-icon="inline-start" />
        {t('recorder.record')}
      </Button>
    </section>
  )
}
