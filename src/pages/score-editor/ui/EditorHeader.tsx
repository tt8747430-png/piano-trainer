import { Play, Redo2, Square, Undo2, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { RoundButton, usePageHeading } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { AddMenu } from './AddMenu'
import { PieceSettings } from './PieceSettings'
import { RecorderSheet } from './RecorderSheet'

/**
 * The editor's bar, one row at every size, as a notation app's: Close and the title (Your version,
 * or the caret's line where the screen puts it there); Undo and Redo; Play from the caret's bar (honey,
 * Stop while it sounds) and Record, which opens the takes; then + (`AddMenu`), what is added to the
 * score, and the gear (`PieceSettings`): the song, the view and the MIDI keyboard (ADR 0065). What
 * writes into the notes is the palette's (`EditorTools`), and a click on the staff it writes.
 */
export function EditorHeader({ status }: { status?: ReactNode }) {
  const { t } = useTranslation(['editor', 'common'])
  const { actions, meta, takes } = useScoreEditorContext()
  const heading = usePageHeading<HTMLHeadingElement>(meta.title)
  const canUndo = useEditorState((state) => state.past.length > 0)
  const canRedo = useEditorState((state) => state.future.length > 0)
  const recording = takes.stage !== 'idle'
  const play = meta.playing ? t('common:stop') : t('editor:play')
  return (
    // Under 360px its eight buttons outgrow one row: + and the gear wrap to the next, at its end.
    <div className="flex items-center justify-end gap-1 narrow-phone:flex-wrap sm:gap-2">
      <RoundButton label={t('common:close')} icon={X} onClick={actions.close} />
      <div className="flex min-w-0 flex-1 flex-col pl-1">
        <h1 {...heading} className="truncate text-lg outline-none max-sm:sr-only">
          {meta.title}
        </h1>
        {status ??
          (meta.hasVersion ? (
            <span className="truncate text-sm text-muted-foreground">
              {t('editor:yourVersion')}
            </span>
          ) : null)}
      </div>
      <div
        role="toolbar"
        aria-label={t('editor:dock')}
        className="flex items-center gap-0.5 sm:gap-1"
      >
        <Button
          variant="ghost"
          size="icon"
          aria-label={t('editor:undo')}
          title={t('editor:undo')}
          disabled={!canUndo || recording}
          className="rounded-full"
          onClick={() => actions.dispatch({ type: 'undo' })}
        >
          <Undo2 aria-hidden />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t('editor:redo')}
          title={t('editor:redo')}
          disabled={!canRedo || recording}
          className="rounded-full"
          onClick={() => actions.dispatch({ type: 'redo' })}
        >
          <Redo2 aria-hidden />
        </Button>
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
      <div className="flex items-center gap-0.5 sm:gap-1">
        <AddMenu />
        <PieceSettings />
      </div>
    </div>
  )
}
