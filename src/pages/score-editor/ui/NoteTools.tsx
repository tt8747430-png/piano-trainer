import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Delete } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { NOTE_VALUES, type NoteValue } from '@/features/score-editor'
import { isCompound } from '@/shared/lib/music'
import { RoundButton, Segmented } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { HandBarTools } from './HandBarTools'

/** Each value's glyph (Noto Music) and the word a screen reader says. */
const VALUE_GLYPHS: Readonly<Record<NoteValue['value'], string>> = {
  1: '𝅝',
  2: '𝅗𝅥',
  4: '𝅘𝅥',
  8: '𝅘𝅥𝅮',
  16: '𝅘𝅥𝅯',
}
const VALUE_WORDS = {
  1: 'whole',
  2: 'half',
  4: 'quarter',
  8: 'eighth',
  16: 'sixteenth',
} as const satisfies Readonly<Record<NoteValue['value'], string>>

const PRESSABLE = 'aria-pressed:bg-muted aria-pressed:text-foreground'

/** Writing notes: the value, Dot and Triplet, Rest, Chord, moving and changing the notes at the caret. */
export function NoteTools() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const value = useEditorState((state) => state.value)
  const chord = useEditorState((state) => state.chord)
  const compound = useEditorState((state) => isCompound(state.draft.meter))
  const dispatch = actions.dispatch
  return (
    <>
      <div className="w-64 shrink-0">
        <Segmented
          label={t('values.label')}
          value={value.value}
          options={NOTE_VALUES.map((option) => ({
            value: option,
            label: VALUE_GLYPHS[option],
            title: t(`values.${VALUE_WORDS[option]}`),
          }))}
          onChange={(next) => dispatch({ type: 'value', value: next })}
        />
      </div>
      <Button
        variant="outline"
        aria-pressed={value.dots === 1}
        className={PRESSABLE}
        onClick={() => dispatch({ type: 'dot' })}
      >
        {t('dot')}
      </Button>
      {compound ? null : (
        <Button
          variant="outline"
          aria-pressed={value.triplet}
          className={PRESSABLE}
          onClick={() => dispatch({ type: 'triplet' })}
        >
          {t('triplet')}
        </Button>
      )}
      <Button variant="outline" onClick={() => dispatch({ type: 'rest' })}>
        {t('rest')}
      </Button>
      <Button
        variant="outline"
        aria-pressed={chord}
        className={PRESSABLE}
        onClick={() => dispatch({ type: 'chordMode' })}
      >
        {t('chordMode')}
      </Button>
      <RoundButton
        label={t('back')}
        icon={ArrowLeft}
        onClick={() => dispatch({ type: 'move', by: 'step', direction: -1 })}
      />
      <RoundButton
        label={t('on')}
        icon={ArrowRight}
        onClick={() => dispatch({ type: 'move', by: 'step', direction: 1 })}
      />
      <RoundButton
        label={t('up')}
        icon={ArrowUp}
        onClick={() => dispatch({ type: 'shift', semitones: 1 })}
      />
      <RoundButton
        label={t('down')}
        icon={ArrowDown}
        onClick={() => dispatch({ type: 'shift', semitones: -1 })}
      />
      <Button variant="outline" onClick={() => dispatch({ type: 'respell' })}>
        {t('respell')}
      </Button>
      <RoundButton
        label={t('deleteNotes')}
        icon={Delete}
        onClick={() => dispatch({ type: 'delete' })}
      />
      <HandBarTools />
    </>
  )
}
