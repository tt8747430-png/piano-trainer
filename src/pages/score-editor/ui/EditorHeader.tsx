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

/**
 * The editor's bar, one at every size (ADR 0094): Close; Practise · Edit (ADR 0090), the Player at
 * the caret's bar; the edit row (`EditRow`: Delete, Undo, Redo, Copy, Cut, Paste); then the screen's
 * own round buttons in the Player's order and look: the eye (`EditorViewMenu`), how the work is
 * shown, and the MIDI keyboard (hidden without Web MIDI). No Song sheet: the song is edited where it
 * is printed and in the palette. On a phone the edit row wraps under the rest. The sheet shows the
 * title and the caret: here they are a screen reader's alone, the page's heading (with Your
 * version) and a live line saying where the caret is (`status`). Play, ‹ › and Record ride in the
 * dock over the sheet's foot, where the Player's transport is (`EditorDock`).
 */
export function EditorHeader({ status }: { status?: ReactNode }) {
  const { t } = useTranslation(['editor', 'common'])
  const { actions, meta, takes } = useScoreEditorContext()
  const bar = useEditorState((state) => barAt(state.draft, state.caret).index + 1)
  const heading = usePageHeading<HTMLHeadingElement>(meta.title)
  return (
    <div className="flex flex-wrap items-center gap-1 sm:flex-nowrap sm:gap-2">
      <h1 {...heading} className="sr-only">
        {meta.title}
      </h1>
      {meta.hasVersion ? <p className="sr-only">{t('editor:yourVersion')}</p> : null}
      {status}
      <RoundButton label={t('common:close')} icon={X} onClick={actions.close} />
      <ModeSwitch pieceId={meta.id} mode="edit" bar={bar} disabled={takes.stage !== 'idle'} />
      <EditRow className="max-sm:order-last max-sm:basis-full max-sm:justify-between" />
      <div className="ms-auto flex items-center gap-1">
        <EditorViewMenu />
        <MidiButton />
      </div>
    </div>
  )
}
