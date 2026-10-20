import { useTranslation } from 'react-i18next'
import { barAt, keyChords } from '@/features/score-editor'
import { chordSymbol } from '@/shared/lib/music'
import { ToolKey } from '@/shared/ui'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { ChordField } from './ChordField'

/** The Chords tab: the chord at the caret typed, and the key's chords to tap into its bar. */
export function ChordKeys() {
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
      <div className="col-span-full">
        <ChordField key={`${caret} ${symbol}`} symbol={symbol} />
      </div>
      <div
        role="group"
        aria-label={t('chord.keyChords')}
        className="col-span-full grid grid-cols-4 gap-1.5"
      >
        {keyChords(key).map((chord) => (
          <ToolKey
            key={chordSymbol(chord)}
            label={chordSymbol(chord)}
            className="font-display text-lg font-semibold"
            onClick={() => actions.dispatch({ type: 'chord', chord, advance: 'bar' })}
          >
            {chordSymbol(chord)}
          </ToolKey>
        ))}
      </div>
    </>
  )
}
