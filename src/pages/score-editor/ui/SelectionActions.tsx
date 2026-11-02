import { ClipboardPaste, Copy, Delete, Scissors } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'
import { copyTarget, whyNoPaste, type ClipEdit } from '@/features/score-editor'
import { Button } from '@/shared/ui/primitives/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/primitives/tooltip'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'

/**
 * One of the row's commands: its icon, named for a screen reader and in a tooltip, which adds `hint`,
 * what the command will act on. `blocked`, it does nothing and is greyed, its tooltip saying why.
 */
function EditButton({
  label,
  hint,
  blocked,
  disabled = false,
  onClick,
  children,
}: {
  label: string
  hint?: string
  blocked?: string
  disabled?: boolean
  onClick: () => void
  children: ReactNode
}) {
  const said = blocked ?? hint
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="tool"
            size="icon"
            aria-label={label}
            aria-disabled={blocked ? true : undefined}
            disabled={disabled}
            onClick={blocked ? undefined : onClick}
            className="size-11 shrink-0 aria-disabled:opacity-50 narrow-phone:w-9 landscape-phone:size-10 [&_svg:not([class*=size-])]:size-5"
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent>{said ? `${label} · ${said}` : label}</TooltipContent>
    </Tooltip>
  )
}

/** What Copy and Cut would take, in a line for their tooltips (ADR 0114). */
function useCopySaid(): string {
  const { t } = useTranslation('editor')
  const target = useEditorState(useShallow(copyTarget))
  if (!target) return t('clip.nothing')
  if (target.kind === 'notes')
    return target.count === 1 ? t('clip.note') : t('clip.notes', { n: target.count })
  return target.from === target.to
    ? t('clip.bar', { n: target.from })
    : t('clip.bars', { from: target.from, to: target.to })
}

/** What Paste holds, in a line; or, greyed, why it cannot paste here. */
function usePasteSaid(): { readonly hint?: string; readonly blocked?: string } {
  const { t } = useTranslation('editor')
  const why = useEditorState(whyNoPaste)
  const holds = useEditorState((state) =>
    state.clip?.kind === 'bars' ? state.clip.bars.length : (state.clip?.notes.length ?? 0),
  )
  const kind = useEditorState((state) => state.clip?.kind)
  if (why) return { blocked: t(`clip.${why}`) }
  return { hint: t(kind === 'bars' ? 'clip.holdsBars' : 'clip.holdsNotes', { n: holds }) }
}

/**
 * What is done to what is chosen (Flat's second toolbar), never a mark put on it: Delete (the notes
 * or chord chosen, else the ones before the caret, as Backspace), Copy, Cut and Paste of what is chosen
 * (the bars in the chord row, the notes on a staff; Paste greyed with its reason where the clip cannot
 * go, ADR 0114). A capsule floating over the music above the transport, as iOS's edit menu stands by
 * a selection: there while notes are chosen (in the chord row, the caret's bar
 * at least) or the clip holds some, gone otherwise. Undo and Redo are
 * the bar's. While a take records, it is gone.
 */
export function SelectionActions() {
  const { t } = useTranslation('editor')
  const { actions, takes } = useScoreEditorContext()
  const dispatch = actions.dispatch
  const chords = useEditorState((state) => state.layer === 'chords')
  // Something to act on: notes chosen, the chord row's bars (the caret's at least), or the clip.
  const shown = useEditorState(
    (state) => state.selection !== null || state.layer === 'chords' || state.clip !== null,
  )
  const copySaid = useCopySaid()
  const paste = usePasteSaid()
  if (!shown || takes.stage !== 'idle') return null
  const clip = (edit: ClipEdit) => () => dispatch({ type: 'clip', edit })
  return (
    <div
      role="toolbar"
      aria-label={t('selection')}
      className="pointer-events-auto flex items-center gap-0.5 rounded-full border border-border bg-raised px-1.5 py-0.5 elevation-2 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-1"
    >
      <EditButton
        label={t(chords ? 'chord.delete' : 'deleteNotes')}
        onClick={() => dispatch({ type: 'delete', back: true })}
      >
        <Delete aria-hidden />
      </EditButton>
      <EditButton label={t('copy')} hint={copySaid} onClick={clip('copy')}>
        <Copy aria-hidden />
      </EditButton>
      <EditButton label={t('cut')} hint={copySaid} onClick={clip('cut')}>
        <Scissors aria-hidden />
      </EditButton>
      <EditButton label={t('paste')} {...paste} onClick={clip('paste')}>
        <ClipboardPaste aria-hidden />
      </EditButton>
    </div>
  )
}
