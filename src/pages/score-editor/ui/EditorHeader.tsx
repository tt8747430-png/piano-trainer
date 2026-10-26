import { Redo2, Undo2, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { MidiButton } from '@/features/connect-midi'
import { barAt } from '@/features/score-editor'
import { RoundButton } from '@/shared/ui'
import { ModeSwitch } from '@/widgets/mode-switch'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'

/**
 * The editor's bar's lead, as the Player's (ADR 0090, 0110): Close, then Practise · Edit, the Player
 * at the caret's bar, in the same place in both modes.
 */
export function EditorLead() {
  const { t } = useTranslation('common')
  const { actions, meta, takes } = useScoreEditorContext()
  const bar = useEditorState((state) => barAt(state.draft, state.caret).index + 1)
  return (
    <>
      <RoundButton label={t('close')} icon={X} onClick={actions.close} />
      <ModeSwitch pieceId={meta.id} mode="edit" bar={bar} disabled={takes.stage !== 'idle'} />
    </>
  )
}

/**
 * The editor's bar's end, in the slots the Player's MIDI · Setup · More stand in (ADR 0110): the MIDI
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
      <MidiButton />
      <RoundButton
        label={t('undo')}
        icon={Undo2}
        disabled={!canUndo || recording}
        onClick={() => actions.dispatch({ type: 'undo' })}
      />
      <RoundButton
        label={t('redo')}
        icon={Redo2}
        disabled={!canRedo || recording}
        onClick={() => actions.dispatch({ type: 'redo' })}
      />
    </>
  )
}
