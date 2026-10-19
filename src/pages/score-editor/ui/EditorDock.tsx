import { Redo2, Undo2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { FloatingBar, FloatingBarButton, FloatingBarPlay } from '@/shared/ui'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { RecorderSheet } from './RecorderSheet'

/**
 * What the editor does without pause, always in sight between the sheet and the tools: Undo, Redo,
 * Play from the caret's bar (honey) and Record, which opens the takes. Along the foot on a phone,
 * upright beside the sheet on a phone on its side. While a take records, all of it waits for Stop.
 */
export function EditorDock() {
  const { t } = useTranslation('editor')
  const { actions, meta, takes } = useScoreEditorContext()
  const canUndo = useEditorState((state) => state.past.length > 0)
  const canRedo = useEditorState((state) => state.future.length > 0)
  const recording = takes.stage !== 'idle'
  return (
    <FloatingBar label={t('dock')} orientation="landscape-phone">
      <FloatingBarButton
        label={t('undo')}
        disabled={recording || !canUndo}
        onClick={() => actions.dispatch({ type: 'undo' })}
      >
        <Undo2 aria-hidden />
      </FloatingBarButton>
      <FloatingBarButton
        label={t('redo')}
        disabled={recording || !canRedo}
        onClick={() => actions.dispatch({ type: 'redo' })}
      >
        <Redo2 aria-hidden />
      </FloatingBarButton>
      <FloatingBarPlay
        label={t('play')}
        playing={meta.playing}
        disabled={recording}
        onClick={actions.togglePlay}
      />
      <RecorderSheet />
    </FloatingBar>
  )
}
