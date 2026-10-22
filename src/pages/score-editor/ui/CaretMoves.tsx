import { ChevronLeft, ChevronRight, Delete } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { FloatingBar, FloatingBarButton } from '@/shared/ui'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'

/**
 * The caret's moves, floating over the sheet as the Player's transport does (ADR 0061), kept apart
 * from the palette's tools as a touch notation app keeps them (Dorico for iPad's Advance caret and
 * Delete left): a step back, a step on, and Delete as Backspace, the notes or the chord before the
 * caret. The same three in every row and whatever the tab; on a phone, where the bar has no room
 * for it, the caret's line (`caption`) between ‹ and ›.
 */
export function CaretMoves({ caption }: { caption?: ReactNode }) {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const chords = useEditorState((state) => state.layer === 'chords')
  const dispatch = actions.dispatch
  return (
    <FloatingBar label={t('caret.moves')} className="gap-1 p-1">
      <FloatingBarButton
        label={t('back')}
        onClick={() => dispatch({ type: 'move', by: 'step', direction: -1 })}
      >
        <ChevronLeft aria-hidden />
      </FloatingBarButton>
      {caption ? <div className="max-w-[40vw] min-w-0 px-1">{caption}</div> : null}
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
