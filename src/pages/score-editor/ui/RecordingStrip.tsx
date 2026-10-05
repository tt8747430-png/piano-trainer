import { Square } from 'lucide-react'
import { useSyncExternalStore } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/primitives/button'
import { clockTime } from '../model/clock-time'
import { useScoreEditorContext } from '../model/editor-context'

/**
 * A take recording, in place of the tools: the count-in's beat, then the piece's bar and the time,
 * and Stop, the screen's one action.
 */
export function RecordingStrip() {
  const { t } = useTranslation('editor')
  const { takes } = useScoreEditorContext()
  const state = useSyncExternalStore(takes.progress.subscribe, takes.progress.current)
  if (!state) return null
  return (
    <div className="flex min-h-14 items-center gap-4 card px-4 py-2">
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
      <Button onClick={takes.stop}>
        <Square data-icon="inline-start" />
        {t('recorder.stop')}
      </Button>
    </div>
  )
}
