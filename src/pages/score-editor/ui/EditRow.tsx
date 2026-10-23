import { ClipboardPaste, Copy, Delete, Redo2, Scissors, Undo2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { BarEdit } from '@/features/score-editor'
import { cn } from '@/shared/lib'
import { Button } from '@/shared/ui/primitives/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/primitives/tooltip'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { LayerChip } from './LayerChip'
import { BarIcon } from './palette-icons'

/** One of the row's commands: its icon, named for a screen reader and in a tooltip. */
function EditButton({
  label,
  disabled = false,
  onClick,
  children,
}: {
  label: string
  disabled?: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={label}
            disabled={disabled}
            onClick={onClick}
            className="size-11 shrink-0 rounded-xl [&_svg:not([class*=size-])]:size-5"
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

/**
 * The edit row (spec 2026-10-23, Flat's second toolbar): at its head the layer chip, where the next
 * note goes (`LayerChip`); then what is done to what is chosen, never a mark put on it: Delete (the notes or chord chosen, else the ones before the caret, as Backspace), Undo
 * and Redo, Copy, Cut and Paste of the bars chosen (else the caret's), and Add bar after them. In
 * sight under the bar on a phone, in the bar's row where it has room; scrolling sideways where even a
 * phone's row is too narrow. While a take records, it waits for Stop.
 */
export function EditRow({ className }: { className?: string }) {
  const { t } = useTranslation('editor')
  const { actions, takes } = useScoreEditorContext()
  const dispatch = actions.dispatch
  const chords = useEditorState((state) => state.layer === 'chords')
  const canUndo = useEditorState((state) => state.past.length > 0)
  const canRedo = useEditorState((state) => state.future.length > 0)
  const canPaste = useEditorState((state) => state.clip !== null)
  const recording = takes.stage !== 'idle'
  const bars = (edit: BarEdit) => () => dispatch({ type: 'bars', edit })
  return (
    <div
      role="toolbar"
      aria-label={t('editRow')}
      className={cn(
        'flex min-w-0 items-center gap-0.5 overflow-x-auto [scrollbar-width:none]',
        className,
      )}
    >
      <LayerChip />
      <EditButton
        label={t(chords ? 'chord.delete' : 'deleteNotes')}
        disabled={recording}
        onClick={() => dispatch({ type: 'delete', back: true })}
      >
        <Delete aria-hidden />
      </EditButton>
      <EditButton
        label={t('undo')}
        disabled={!canUndo || recording}
        onClick={() => dispatch({ type: 'undo' })}
      >
        <Undo2 aria-hidden />
      </EditButton>
      <EditButton
        label={t('redo')}
        disabled={!canRedo || recording}
        onClick={() => dispatch({ type: 'redo' })}
      >
        <Redo2 aria-hidden />
      </EditButton>
      <EditButton label={t('bars.copy')} disabled={recording} onClick={bars('copy')}>
        <Copy aria-hidden />
      </EditButton>
      <EditButton label={t('bars.cut')} disabled={recording} onClick={bars('cut')}>
        <Scissors aria-hidden />
      </EditButton>
      <EditButton label={t('bars.paste')} disabled={!canPaste || recording} onClick={bars('paste')}>
        <ClipboardPaste aria-hidden />
      </EditButton>
      <EditButton label={t('bars.add')} disabled={recording} onClick={bars('insert')}>
        <span aria-hidden className="size-6">
          <BarIcon edit="insert" />
        </span>
      </EditButton>
    </div>
  )
}
