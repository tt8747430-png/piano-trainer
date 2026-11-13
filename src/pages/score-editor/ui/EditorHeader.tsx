import { Ellipsis, Redo2, Undo2, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { barAt } from '@/features/score-editor'
import { Button } from '@/shared/ui/primitives/button'
import { ModeSwitch } from '@/widgets/mode-switch'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'

/** The editor's bar's lead (its canvas): Close, the one way out. */
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
 * The bar's middle (its canvas): Play · Edit, the way back to the Player at the caret's bar; a
 * lesson's example has its own Done there (`done`), back to its lesson.
 */
export function EditorMode({ done }: { done?: ReactNode }) {
  const { t } = useTranslation('editor')
  const { meta, takes } = useScoreEditorContext()
  const bar = useEditorState((state) => barAt(state.draft, state.caret).index + 1)
  const recording = takes.stage !== 'idle'
  return (
    done ?? (
      <ModeSwitch
        pieceId={meta.id}
        bar={bar}
        waiting={recording ? t('recordingBar.label') : undefined}
      />
    )
  )
}

/**
 * The bar's end (its canvas, Flat's): Undo, Redo and ···, the score's Settings (`EditorGear`):
 * what the score does not print. Play, the keys and Delete are the selection strip's. While a
 * take records they wait for Stop.
 */
export function EditorActions() {
  const { t } = useTranslation('editor')
  const { actions, takes, view } = useScoreEditorContext()
  const canUndo = useEditorState((state) => state.past.length > 0)
  const canRedo = useEditorState((state) => state.future.length > 0)
  const recording = takes.stage !== 'idle'
  return (
    <>
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
      <Button
        variant="tool"
        size="icon"
        aria-label={t('scoreSettings.title')}
        title={t('scoreSettings.title')}
        aria-expanded={view.gear !== null}
        disabled={recording}
        onClick={() => view.setGear(view.gear === null ? 'main' : null)}
      >
        <Ellipsis aria-hidden />
      </Button>
    </>
  )
}
