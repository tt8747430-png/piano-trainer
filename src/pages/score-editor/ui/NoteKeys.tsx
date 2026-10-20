import { Layers } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { NOTE_VALUES, takesDot } from '@/features/score-editor'
import { isCompound } from '@/shared/lib/music'
import { ToolKey } from '@/shared/ui'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { VALUE_GLYPHS, VALUE_WORDS } from '../model/value-words'

/** A key drawn as notation: a glyph of the music font, at a note value's size. */
const GLYPH = 'font-sans text-3xl leading-none'
/** A quarter rest, as the staff draws it. */
const REST = '𝄽'

/**
 * The Notes tab: the value the keys write, whole to sixteenth, the one chosen on; Dotted and Triplet
 * (out of reach where the meter takes neither); a Rest, wide; and Chord, the next key joining the last.
 */
export function NoteKeys() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const dispatch = actions.dispatch
  const value = useEditorState((state) => state.value)
  const chord = useEditorState((state) => state.chord)
  const dottable = useEditorState((state) => takesDot(state.value.value, state.draft.meter))
  const compound = useEditorState((state) => isCompound(state.draft.meter))
  return (
    <>
      <div
        role="group"
        aria-label={t('values.label')}
        className="col-span-full grid grid-cols-5 gap-1.5"
      >
        {NOTE_VALUES.map((option) => (
          <ToolKey
            key={option}
            label={t(`values.${VALUE_WORDS[option]}`)}
            pressed={value.value === option}
            onClick={() => dispatch({ type: 'value', value: option })}
          >
            <span aria-hidden className={GLYPH}>
              {VALUE_GLYPHS[option]}
            </span>
          </ToolKey>
        ))}
      </div>
      <ToolKey
        label={t('dot')}
        pressed={value.dots === 1}
        disabled={!dottable}
        onClick={() => dispatch({ type: 'dot' })}
      >
        <span aria-hidden className={GLYPH}>
          {VALUE_GLYPHS[4]}.
        </span>
      </ToolKey>
      <ToolKey
        label={t('triplet')}
        pressed={value.triplet}
        disabled={compound}
        onClick={() => dispatch({ type: 'triplet' })}
      >
        <span aria-hidden className="font-display text-xl font-semibold italic">
          3
        </span>
      </ToolKey>
      <ToolKey label={t('rest')} span="wide" onClick={() => dispatch({ type: 'rest' })}>
        <span aria-hidden className={GLYPH}>
          {REST}
        </span>
      </ToolKey>
      <ToolKey
        label={t('chordMode')}
        pressed={chord}
        onClick={() => dispatch({ type: 'chordMode' })}
      >
        <Layers aria-hidden />
      </ToolKey>
    </>
  )
}
