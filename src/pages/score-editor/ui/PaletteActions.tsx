import { ArrowLeft, ArrowRight, Delete, Redo2, Undo2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ToolKey, ToolPaletteActions } from '@/shared/ui'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'

/** The palette's top row, whatever its tab: Delete, Undo, Redo and the caret a step back or on. */
export function PaletteActions() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const dispatch = actions.dispatch
  const chords = useEditorState((state) => state.layer === 'chords')
  const canUndo = useEditorState((state) => state.past.length > 0)
  const canRedo = useEditorState((state) => state.future.length > 0)
  return (
    <ToolPaletteActions label={t('palette.actions')}>
      <ToolKey
        label={chords ? t('chord.delete') : t('deleteNotes')}
        onClick={() => dispatch({ type: 'delete' })}
      >
        <Delete aria-hidden />
      </ToolKey>
      <ToolKey label={t('undo')} disabled={!canUndo} onClick={() => dispatch({ type: 'undo' })}>
        <Undo2 aria-hidden />
      </ToolKey>
      <ToolKey label={t('redo')} disabled={!canRedo} onClick={() => dispatch({ type: 'redo' })}>
        <Redo2 aria-hidden />
      </ToolKey>
      <ToolKey
        label={t('back')}
        onClick={() => dispatch({ type: 'move', by: 'step', direction: -1 })}
      >
        <ArrowLeft aria-hidden />
      </ToolKey>
      <ToolKey label={t('on')} onClick={() => dispatch({ type: 'move', by: 'step', direction: 1 })}>
        <ArrowRight aria-hidden />
      </ToolKey>
    </ToolPaletteActions>
  )
}
