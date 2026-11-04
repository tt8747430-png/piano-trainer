import { Square } from 'lucide-react'
import { useSyncExternalStore } from 'react'
import { useTranslation } from 'react-i18next'
import { selectMidi, useSettings } from '@/entities/settings'
import { useMidiDevices } from '@/features/connect-midi'
import { RecordingChoices } from '@/features/record-take'
import { Button } from '@/shared/ui/primitives/button'
import { clockTime } from '../model/clock-time'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'

/** The keyboard a take is heard from: the one chosen, else the first connected; none, Any. */
function useDeviceName(): string {
  const { t } = useTranslation('editor')
  const chosen = useSettings((state) => selectMidi(state).device)
  const first = useMidiDevices().find((device) => device.input)?.name
  const name = chosen ?? first
  return name ? t('recordingBar.device', { name }) : t('recordingBar.anyDevice')
}

/** Where the take is: what to do to start it, its count-in's beat, or its bar and its time. */
function Status() {
  const { t } = useTranslation('editor')
  const { takes } = useScoreEditorContext()
  const now = useSyncExternalStore(takes.progress.subscribe, takes.progress.current)
  if (!now || now.stage === 'waiting') return <span>{t('recordingBar.playToStart')}</span>
  return (
    <span className="tabular-nums">
      <span className="font-semibold">
        {t(now.stage === 'counting' ? 'recorder.counting' : 'recorder.recording')}
      </span>{' '}
      {now.stage === 'counting'
        ? now.beat
        : `${t('recorder.bar', { n: takes.fromBar + now.bar })} · ${clockTime(now.seconds * 1000)}`}
    </span>
  )
}

/**
 * The recording bar under the score (A40, Flat's): the Metronome with the song's tempo, Start
 * countdown (Off, 1 bar, 2 bars), the MIDI keyboard heard, where the take is (Play to start
 * recording, the count-in, the bar and the time), and Stop. The countdown is changed while the take
 * waits for its first note (a countdown chosen then counts in at once); the Metronome may be turned
 * on or off while it records.
 */
export function RecordingBar() {
  const { t } = useTranslation('editor')
  const { takes } = useScoreEditorContext()
  const tempo = useEditorState((state) => state.draft.tempo)
  const device = useDeviceName()
  const going = takes.stage === 'counting' || takes.stage === 'recording'
  return (
    <section
      aria-label={t('recordingBar.label')}
      className="flex w-full max-w-3xl flex-col gap-2 card px-4 py-3"
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <RecordingChoices
          tempo={t('recordingBar.tempo', { bpm: Math.round(tempo) })}
          countdown={!going}
        />
        <span className="min-w-0 truncate text-sm text-muted-foreground">{device}</span>
      </div>
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="size-3 shrink-0 rounded-pill bg-destructive motion-safe:animate-pulse"
        />
        <p role="status" className="min-w-0 flex-1">
          <Status />
        </p>
        <Button onClick={takes.stop}>
          <Square data-icon="inline-start" />
          {t('recorder.stop')}
        </Button>
      </div>
    </section>
  )
}
