import { Play, Square, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { MidiButton } from '@/features/connect-midi'
import { RoundButton, usePageHeading } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { useScoreEditorContext } from '../model/editor-context'
import { PieceSettings } from './PieceSettings'
import { RecorderSheet } from './RecorderSheet'

/**
 * The editor's bar, one row at every size: Close, the title (and Your version), then Play from the
 * caret's bar (honey, Stop while it sounds) and Record, which opens the takes, as a notation app keeps
 * Play in its bar; MIDI and the song's settings. What writes is the palette's (`EditorPalette`).
 * Under the title, `status` where the screen puts the caret's line there (a phone on its side).
 */
export function EditorToolbar({ status }: { status?: ReactNode }) {
  const { t } = useTranslation(['editor', 'common'])
  const { actions, meta, takes } = useScoreEditorContext()
  const heading = usePageHeading<HTMLHeadingElement>(meta.title)
  const recording = takes.stage !== 'idle'
  const play = meta.playing ? t('common:stop') : t('editor:play')
  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <RoundButton label={t('common:close')} icon={X} onClick={actions.close} />
      <div className="flex min-w-0 flex-1 flex-col pl-1">
        <h1 {...heading} className="truncate text-lg outline-none">
          {meta.title}
        </h1>
        {status ??
          (meta.hasVersion ? (
            <span className="truncate text-sm text-muted-foreground">
              {t('editor:yourVersion')}
            </span>
          ) : null)}
      </div>
      <div role="toolbar" aria-label={t('editor:dock')} className="flex items-center gap-1">
        <Button
          size="icon"
          aria-label={play}
          title={play}
          aria-pressed={meta.playing}
          disabled={recording}
          className="rounded-full"
          onClick={actions.togglePlay}
        >
          {meta.playing ? <Square aria-hidden /> : <Play aria-hidden />}
        </Button>
        <RecorderSheet />
      </div>
      <MidiButton />
      <PieceSettings />
    </div>
  )
}
