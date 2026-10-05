import { ArrowLeft, ArrowRight, Delete } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { barAt, keyChords } from '@/features/score-editor'
import { chordSymbol } from '@/shared/lib/music'
import { ToolButton } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { BarMenu } from './BarMenu'
import { ChordField } from './ChordField'

/** Writing chords: the chord typed or tapped from the key's, deleting one, and the bars. */
export function ChordTools() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const key = useEditorState((state) => state.draft.key)
  const caret = useEditorState((state) => state.caret)
  const symbol = useEditorState((state) => {
    const { start, bar } = barAt(state.draft, state.caret)
    const chord = bar.chords.findLast((placed) => placed.at <= state.caret - start)
    return chord ? chordSymbol(chord.chord) : ''
  })
  return (
    <>
      <ChordField key={`${caret} ${symbol}`} symbol={symbol} />
      <div role="group" aria-label={t('chord.keyChords')} className="flex shrink-0 gap-1">
        {keyChords(key).map((chord) => (
          <Button
            key={chordSymbol(chord)}
            variant="outline"
            className="font-display text-lg font-semibold"
            onClick={() => actions.dispatch({ type: 'chord', chord, advance: 'bar' })}
          >
            {chordSymbol(chord)}
          </Button>
        ))}
      </div>
      <ToolButton label={t('chord.delete')} onClick={() => actions.dispatch({ type: 'delete' })}>
        <Delete aria-hidden />
      </ToolButton>
      <div role="group" aria-label={t('groups.caret')} className="flex shrink-0 gap-1">
        <ToolButton
          label={t('back')}
          onClick={() => actions.dispatch({ type: 'move', by: 'step', direction: -1 })}
        >
          <ArrowLeft aria-hidden />
        </ToolButton>
        <ToolButton
          label={t('on')}
          onClick={() => actions.dispatch({ type: 'move', by: 'step', direction: 1 })}
        >
          <ArrowRight aria-hidden />
        </ToolButton>
      </div>
      <BarMenu />
    </>
  )
}
