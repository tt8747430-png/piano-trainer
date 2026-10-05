import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Delete, Layers } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { NOTE_VALUES, takesDot } from '@/features/score-editor'
import { isCompound } from '@/shared/lib/music'
import { Segmented, ToolButton, ToolDivider } from '@/shared/ui'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { VALUE_GLYPHS, VALUE_WORDS } from '../model/value-words'
import { HandBarTools } from './HandBarTools'
import { TrebleVoice } from './TrebleVoice'

/** A tool drawn as notation: a glyph of the music font, at a note value's size. */
const GLYPH = 'font-sans text-3xl leading-none'
/** A quarter rest, as the staff draws it. */
const REST = '𝄽'

/**
 * Writing notes, as a palette in groups parted by a hairline: the value, then Dot, Triplet, Rest and
 * Chord, the caret's arrows, the notes there a semitone up or down, respelled or deleted; in a hand,
 * that bar's own tools.
 */
export function NoteTools() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const value = useEditorState((state) => state.value)
  const chord = useEditorState((state) => state.chord)
  const compound = useEditorState((state) => isCompound(state.draft.meter))
  const dottable = useEditorState((state) => takesDot(state.value.value, state.draft.meter))
  const dispatch = actions.dispatch
  return (
    <>
      <TrebleVoice />
      <div className="w-64 shrink-0">
        <Segmented
          label={t('values.label')}
          value={value.value}
          options={NOTE_VALUES.map((option) => ({
            value: option,
            label: '',
            icon: (
              <span aria-hidden className={GLYPH}>
                {VALUE_GLYPHS[option]}
              </span>
            ),
            title: t(`values.${VALUE_WORDS[option]}`),
          }))}
          onChange={(next) => dispatch({ type: 'value', value: next })}
        />
      </div>
      <ToolDivider />
      <div role="group" aria-label={t('groups.value')} className="flex shrink-0 gap-1">
        <ToolButton
          label={t('dot')}
          pressed={value.dots === 1}
          disabled={!dottable}
          onClick={() => dispatch({ type: 'dot' })}
        >
          <span aria-hidden className={GLYPH}>
            {VALUE_GLYPHS[4]}.
          </span>
        </ToolButton>
        {compound ? null : (
          <ToolButton
            label={t('triplet')}
            pressed={value.triplet}
            onClick={() => dispatch({ type: 'triplet' })}
          >
            <span aria-hidden className="font-display text-xl font-semibold italic">
              3
            </span>
          </ToolButton>
        )}
        <ToolButton label={t('rest')} onClick={() => dispatch({ type: 'rest' })}>
          <span aria-hidden className={GLYPH}>
            {REST}
          </span>
        </ToolButton>
        <ToolButton
          label={t('chordMode')}
          pressed={chord}
          onClick={() => dispatch({ type: 'chordMode' })}
        >
          <Layers aria-hidden />
        </ToolButton>
      </div>
      <ToolDivider />
      <div role="group" aria-label={t('groups.caret')} className="flex shrink-0 gap-1">
        <ToolButton
          label={t('back')}
          onClick={() => dispatch({ type: 'move', by: 'step', direction: -1 })}
        >
          <ArrowLeft aria-hidden />
        </ToolButton>
        <ToolButton
          label={t('on')}
          onClick={() => dispatch({ type: 'move', by: 'step', direction: 1 })}
        >
          <ArrowRight aria-hidden />
        </ToolButton>
      </div>
      <ToolDivider />
      <div role="group" aria-label={t('groups.notes')} className="flex shrink-0 gap-1">
        <ToolButton label={t('up')} onClick={() => dispatch({ type: 'shift', semitones: 1 })}>
          <ArrowUp aria-hidden />
        </ToolButton>
        <ToolButton label={t('down')} onClick={() => dispatch({ type: 'shift', semitones: -1 })}>
          <ArrowDown aria-hidden />
        </ToolButton>
        <ToolButton label={t('respell')} onClick={() => dispatch({ type: 'respell' })}>
          <span aria-hidden className="text-xl font-semibold tracking-tight">
            ♯♭
          </span>
        </ToolButton>
        <ToolButton label={t('deleteNotes')} onClick={() => dispatch({ type: 'delete' })}>
          <Delete aria-hidden />
        </ToolButton>
      </div>
      <HandBarTools />
    </>
  )
}
