import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { MidiButton } from '@/features/connect-midi'
import { barAt } from '@/features/score-editor'
import { RoundButton, usePageHeading } from '@/shared/ui'
import { ModeSwitch } from '@/widgets/mode-switch'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { EditorViewMenu } from './EditorViewMenu'
import { EditRow } from './EditRow'
import { PieceSettings } from './PieceSettings'
import { RecorderSheet } from './RecorderSheet'

/**
 * The editor's bar, as the Player's (ADR 0085): Close; the title (on a phone only what the caret is
 * on, `status`, or Your version); then the screen's round buttons in the Player's order and look:
 * Practise · Edit (ADR 0090), the Player at the caret's bar; Record, which opens the takes; the eye (`EditorViewMenu`), how the work is shown; the MIDI keyboard
 * (hidden without Web MIDI); and the sliders (`PieceSettings`), the song as a whole (ADR 0080). The
 * edit row (`EditRow`: Delete, Undo, Redo, Copy, Cut, Paste, Add bar) stands under it on a phone and
 * in its row, before the round buttons, where there is room (spec 2026-10-23). Play and ‹ › ride in
 * the dock over the sheet's foot, where the Player's transport is (`EditorDock`).
 */
export function EditorHeader({ status }: { status?: ReactNode }) {
  const { t } = useTranslation(['editor', 'common'])
  const { actions, meta, takes } = useScoreEditorContext()
  const bar = useEditorState((state) => barAt(state.draft, state.caret).index + 1)
  const heading = usePageHeading<HTMLHeadingElement>(meta.title)
  return (
    <div className="flex flex-wrap items-center gap-x-1 gap-y-1 sm:flex-nowrap sm:gap-x-2">
      <RoundButton label={t('common:close')} icon={X} onClick={actions.close} />
      {/* The title over what the caret is on; on a phone, where the buttons fill the first row, both
          share a row of their own under them, the title first. On a phone on its side the bar is
          one row with no room left: both are read by a screen reader alone (the caret on the
          sheet and the pressed value show the same). */}
      <div className="flex min-w-0 flex-col pl-1 max-sm:order-last max-sm:basis-full max-sm:flex-row max-sm:items-baseline max-sm:gap-2 max-sm:px-2 sm:flex-1 landscape-phone:sr-only">
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
      <EditRow className="max-sm:order-last max-sm:basis-full max-sm:justify-between" />
      <div className="ms-auto flex items-center gap-0.5 sm:ms-0 sm:gap-1">
        <ModeSwitch pieceId={meta.id} mode="edit" bar={bar} disabled={takes.stage !== 'idle'} />
        <RecorderSheet />
        <EditorViewMenu />
        <MidiButton />
        <PieceSettings />
      </div>
    </div>
  )
}
