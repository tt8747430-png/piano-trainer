import { Redo2, Undo2, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { MidiButton } from '@/features/connect-midi'
import { barAt } from '@/features/score-editor'
import { Button } from '@/shared/ui/primitives/button'
import { ScoreEditToggle } from '@/widgets/mode-switch'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'

/**
 * The editor's bar's lead, as the Player's (ADR 0115): Close.
 */
export function EditorLead() {
  const { t } = useTranslation('common')
  const { actions } = useScoreEditorContext()
  return (
    <Button
      variant="tool"
      size="icon"
      aria-label={t('close')}
      title={t('close')}
      onClick={actions.close}
    >
      <X aria-hidden />
    </Button>
  )
}

/**
 * The editor's bar's end, in the slots the Player's MIDI · Setup · More stand in (ADR 0115): the MIDI
 * keyboard (hidden without Web MIDI, as the Player's), then Undo and Redo, the edits made most often,
 * where Setup and More are; an original's draft, its status and its menu (`draft`); Done at the end.
 * While a take records they wait for Stop.
 */
export function EditorActions({ draft }: { draft?: ReactNode }) {
  const { t } = useTranslation('editor')
  const { actions, meta, takes } = useScoreEditorContext()
  const bar = useEditorState((state) => barAt(state.draft, state.caret).index + 1)
  const canUndo = useEditorState((state) => state.past.length > 0)
  const canRedo = useEditorState((state) => state.future.length > 0)
  const recording = takes.stage !== 'idle'
  return (
    <>
      <MidiButton variant="tool" />
      <Button
        variant="tool"
        size="icon"
        aria-label={t('undo')}
        title={t('undo')}
        disabled={!canUndo || recording}
        onClick={() => actions.dispatch({ type: 'undo' })}
      >
        <Undo2 aria-hidden />
      </Button>
      <Button
        variant="tool"
        size="icon"
        aria-label={t('redo')}
        title={t('redo')}
        disabled={!canRedo || recording}
        onClick={() => actions.dispatch({ type: 'redo' })}
      >
        <Redo2 aria-hidden />
      </Button>
      {draft}
      <ScoreEditToggle pieceId={meta.id} editing bar={bar} disabled={recording} />
    </>
  )
}
