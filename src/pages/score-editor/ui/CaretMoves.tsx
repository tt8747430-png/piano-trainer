import { ChevronLeft, ChevronRight, Delete } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/primitives/button'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'

/**
 * The caret's moves, kept apart from the palette's tools as a touch notation app keeps them (Dorico
 * for iPad's Advance caret and Delete left): a step back, a step on, and Delete as Backspace, the
 * notes or the chord before the caret. The same three in every row and whatever the tab.
 */
export function CaretMoves() {
  const { t } = useTranslation('editor')
  const { actions, takes } = useScoreEditorContext()
  const chords = useEditorState((state) => state.layer === 'chords')
  const dispatch = actions.dispatch
  const idle = takes.stage === 'idle'
  const moves = [
    {
      label: t('back'),
      icon: <ChevronLeft aria-hidden />,
      act: () => dispatch({ type: 'move', by: 'step', direction: -1 }),
    },
    {
      label: t('on'),
      icon: <ChevronRight aria-hidden />,
      act: () => dispatch({ type: 'move', by: 'step', direction: 1 }),
    },
    {
      label: t(chords ? 'chord.delete' : 'deleteNotes'),
      icon: <Delete aria-hidden />,
      act: () => dispatch({ type: 'delete', back: true }),
    },
  ]
  return (
    <div role="group" aria-label={t('caret.moves')} className="flex shrink-0 items-center gap-1">
      {moves.map(({ label, icon, act }) => (
        <Button
          key={label}
          variant="outline"
          size="icon"
          aria-label={label}
          title={label}
          disabled={!idle}
          className="size-10 rounded-xl landscape-phone:size-9"
          onClick={act}
        >
          {icon}
        </Button>
      ))}
    </div>
  )
}
