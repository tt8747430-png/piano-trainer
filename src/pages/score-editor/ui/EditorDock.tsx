import { ChevronLeft, ChevronRight, Delete } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { FloatingBar, FloatingBarButton, FloatingBarPlay } from '@/shared/ui'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { AddMenu } from './AddMenu'

/**
 * The editor's transport, the Player's (`PlayerDock`, ADR 0061) in shape and place: one pill floating
 * over the sheet's foot, ‹ Play › in its middle, so the two screens are worked the same way. Around
 * them what the editor does without pause, as a touch notation app keeps them (Dorico for iPad's
 * Advance caret and Delete left): + to insert at the caret on the left, Delete as Backspace (the notes
 * or the chord before the caret) on the right. Play plays from the caret's bar.
 */
export function EditorDock() {
  const { t } = useTranslation('editor')
  const { actions, meta, takes } = useScoreEditorContext()
  const chords = useEditorState((state) => state.layer === 'chords')
  const dispatch = actions.dispatch
  return (
    <FloatingBar label={t('caret.moves')} className="gap-1">
      <AddMenu />
      <FloatingBarButton
        label={t('back')}
        onClick={() => dispatch({ type: 'move', by: 'step', direction: -1 })}
      >
        <ChevronLeft aria-hidden />
      </FloatingBarButton>
      <FloatingBarPlay
        label={t('play')}
        playing={meta.playing}
        disabled={takes.stage !== 'idle'}
        onClick={actions.togglePlay}
      />
      <FloatingBarButton
        label={t('on')}
        onClick={() => dispatch({ type: 'move', by: 'step', direction: 1 })}
      >
        <ChevronRight aria-hidden />
      </FloatingBarButton>
      <FloatingBarButton
        label={t(chords ? 'chord.delete' : 'deleteNotes')}
        onClick={() => dispatch({ type: 'delete', back: true })}
      >
        <Delete aria-hidden />
      </FloatingBarButton>
    </FloatingBar>
  )
}
