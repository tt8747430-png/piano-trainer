import { Redo2, Undo2, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { MidiButton } from '@/features/connect-midi'
import { RoundButton, usePageHeading } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { EditorViewMenu } from './EditorViewMenu'
import { PieceSettings } from './PieceSettings'
import { RecorderSheet } from './RecorderSheet'

/**
 * The editor's bar, one row at every size, as the Player's is: Close; the title (on a phone only
 * what the caret is on, `status`, or Your version); Undo and Redo, plain, as a notation app's edit
 * commands; then the screen's round buttons in the Player's order and look (ADR 0085): Record, which
 * opens the takes; the eye (`EditorViewMenu`), how the work is shown; the MIDI keyboard, where the
 * Player has it (hidden without Web MIDI); and the sliders (`PieceSettings`), the song as a whole
 * (ADR 0080), the two menus named on a wide screen. Play, ‹ › and + ride in the dock over the
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
      {/* The title over what the caret is on; on a phone, where the buttons fill the first row, both
          share a row of their own under them, the title first. */}
      <div className="flex min-w-0 flex-col pl-1 max-sm:order-last max-sm:basis-full max-sm:flex-row max-sm:items-baseline max-sm:gap-2 max-sm:px-2 sm:flex-1">
        <h1
          {...heading}
          className="truncate text-lg leading-tight outline-none max-sm:max-w-[45%] max-sm:shrink-0 max-sm:text-base"
        >
          {meta.title}
        </h1>
        <div className="flex min-w-0 items-baseline gap-2">
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
        className="ms-auto flex items-center gap-0.5 sm:gap-1"
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
        <MidiButton />
        <PieceSettings />
      </div>
    </div>
  )
}
