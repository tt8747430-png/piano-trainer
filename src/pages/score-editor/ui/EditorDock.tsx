import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { FloatingBar, FloatingBarButton, FloatingBarPlay } from '@/shared/ui'
import { useScoreEditorContext } from '../model/editor-context'

/**
 * The editor's transport, the Player's (`PlayerDock`, ADR 0061) in shape and place: one pill floating
 * over the sheet's foot, ‹ Play ›, so the two screens are worked the same way. Play plays from the
 * caret's bar; ‹ › move the caret. What changes the music is the edit row's and the palette's.
 */
export function EditorDock() {
  const { t } = useTranslation('editor')
  const { actions, meta, takes } = useScoreEditorContext()
  const dispatch = actions.dispatch
  return (
    <FloatingBar label={t('caret.moves')} className="gap-1">
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
    </FloatingBar>
  )
}
