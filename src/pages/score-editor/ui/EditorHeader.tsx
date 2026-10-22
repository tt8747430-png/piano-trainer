import { Redo2, Undo2, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { RoundButton, usePageHeading } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { EditorViewMenu } from './EditorViewMenu'
import { PieceSettings } from './PieceSettings'
import { RecorderSheet } from './RecorderSheet'

/**
 * The editor's bar, one row at every size, as the Player's is: Close; the title (on a phone only
 * what the caret is on, `status`, or Your version); Undo and Redo; then the screen's menus, as the
 * Player's: Record, which opens the takes; the eye (`EditorViewMenu`), how the work is shown; and the
 * gear (`PieceSettings`), the song as a whole (ADR 0080). Play, ‹ › and + ride in the dock over the
 * sheet's foot, where the Player's transport is (`EditorDock`).
 */
export function EditorHeader({ status }: { status?: ReactNode }) {
  const { t } = useTranslation(['editor', 'common'])
  const { actions, meta, takes } = useScoreEditorContext()
  const heading = usePageHeading<HTMLHeadingElement>(meta.title)
  const canUndo = useEditorState((state) => state.past.length > 0)
  const canRedo = useEditorState((state) => state.future.length > 0)
  const recording = takes.stage !== 'idle'
  return (
    <div className="flex flex-wrap items-center gap-x-1 gap-y-1 sm:flex-nowrap sm:gap-x-2">
      <RoundButton label={t('common:close')} icon={X} onClick={actions.close} />
      {/* The title over what the caret is on; on a phone that line has a row of its own, at the foot. */}
      <div className="flex min-w-0 flex-col pl-1 max-sm:contents sm:flex-1">
        <h1
          {...heading}
          className="truncate text-lg leading-tight outline-none max-sm:min-w-0 max-sm:flex-1 max-sm:pl-1"
        >
          {meta.title}
        </h1>
        <div className="flex min-w-0 items-baseline gap-2 max-sm:order-last max-sm:basis-full max-sm:px-2">
          {meta.hasVersion ? (
            <span className="shrink-0 text-sm font-medium text-muted-foreground">
              {t('editor:yourVersion')}
            </span>
          ) : null}
          {status}
        </div>
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
      </div>
      <div className="flex items-center gap-0.5 sm:gap-1">
        <RecorderSheet />
        <EditorViewMenu />
        <PieceSettings />
      </div>
    </div>
  )
}
