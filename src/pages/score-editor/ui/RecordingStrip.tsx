import { SlidersHorizontal, Square } from 'lucide-react'
import { useSyncExternalStore } from 'react'
import { useTranslation } from 'react-i18next'
import { MetronomeSwitch, TuneSwitch } from '@/features/record-take'
import { SettingRows } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/primitives/popover'
import { clockTime } from '../model/clock-time'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'

/**
 * How the take sounds, changed while it records (ADR 0096): the metronome after the count-in and the
 * tune under it where the song has one, Settings › Recording's own switches, in a popover from the
 * strip's settings button.
 */
function RecordingSettings() {
  const { t } = useTranslation('editor')
  const hasTune = useEditorState((state) => state.draft.melody.length > 0)
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={t('recorder.settings')}
            title={t('recorder.settings')}
            className="shrink-0 rounded-full"
          />
        }
      >
        <SlidersHorizontal aria-hidden />
      </PopoverTrigger>
      <PopoverContent
        aria-label={t('recorder.settings')}
        side="top"
        align="end"
        className="w-72 max-w-[calc(100vw-2rem)] p-4"
      >
        <SettingRows>
          <MetronomeSwitch />
          {hasTune ? <TuneSwitch /> : null}
        </SettingRows>
      </PopoverContent>
    </Popover>
  )
}

/**
 * A take recording, in place of the dock: the count-in's beat, then the piece's bar and the time; its
 * settings (what sounds along with it), and Stop, the screen's one action.
 */
export function RecordingStrip() {
  const { t } = useTranslation('editor')
  const { takes } = useScoreEditorContext()
  const state = useSyncExternalStore(takes.progress.subscribe, takes.progress.current)
  if (!state) return null
  return (
    <div className="flex min-h-14 items-center gap-3 card px-4 py-2">
      <span
        aria-hidden
        className="size-3 shrink-0 rounded-full bg-foreground motion-safe:animate-pulse"
      />
      <p className="flex min-w-0 flex-1 flex-wrap gap-x-2 tabular-nums">
        <span role="status" className="font-semibold">
          {t(state.stage === 'counting' ? 'recorder.counting' : 'recorder.recording')}
        </span>
        <span>
          {state.stage === 'counting'
            ? state.beat
            : `${t('recorder.bar', { n: takes.fromBar + state.bar })} · ${clockTime(state.seconds * 1000)}`}
        </span>
      </p>
      <RecordingSettings />
      <Button onClick={takes.stop}>
        <Square data-icon="inline-start" />
        {t('recorder.stop')}
      </Button>
    </div>
  )
}
