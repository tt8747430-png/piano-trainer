import { useSearch } from '@tanstack/react-router'
import { Redo2, Undo2, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { MidiButton } from '@/features/connect-midi'
import { barAt } from '@/features/score-editor'
import { Button } from '@/shared/ui/primitives/button'
import { ModeSwitch } from '@/widgets/mode-switch'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'

/**
 * The editor's bar's lead, as the Player's (ADR 0115): Close, then the mode (Practise · Edit · Edit
 * the original), the Player at the caret's bar, in the same place in both modes.
 */
export function EditorLead() {
  const { t } = useTranslation('common')
  const { actions, meta, takes } = useScoreEditorContext()
  const bar = useEditorState((state) => barAt(state.draft, state.caret).index + 1)
  const { original } = useSearch({ strict: false })
  return (
    <>
      <Button
        variant="tool"
        size="icon"
        aria-label={t('close')}
        title={t('close')}
        onClick={actions.close}
      >
        <X aria-hidden />
      </Button>
      <ModeSwitch
        pieceId={meta.id}
        mode={original ? 'original' : 'edit'}
        bar={bar}
        disabled={takes.stage !== 'idle'}
      />
    </>
  )
}

/**
 * The editor's bar's end, in the slots the Player's MIDI · Setup · More stand in (ADR 0115): the MIDI
 * keyboard (hidden without Web MIDI, as the Player's), then Undo and Redo, the edits made most often,
 * where Setup and More are. While a take records they wait for Stop.
 */
export function EditorActions() {
  const { t } = useTranslation('editor')
  const { actions, takes } = useScoreEditorContext()
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
    </>
  )
}
