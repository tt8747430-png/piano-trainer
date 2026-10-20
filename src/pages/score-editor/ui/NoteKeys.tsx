import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ChevronsDown,
  ChevronsUp,
  Delete,
  Layers,
} from 'lucide-react'
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

/** The values whole to 32nd, the one chosen on. */
function ValueKeys() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const value = useEditorState((state) => state.value.value)
  return NOTE_VALUES.map((option) => (
    <ToolKey
      key={option}
      label={t(`values.${VALUE_WORDS[option]}`)}
      pressed={value === option}
      onClick={() => actions.dispatch({ type: 'value', value: option })}
    >
      <span aria-hidden className={GLYPH}>
        {VALUE_GLYPHS[option]}
      </span>
    </ToolKey>
  ))
}

/** Dotted, Double dotted and Triplet (out of reach where the meter takes none), a Rest, and Chord. */
function RhythmKeys() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const dispatch = actions.dispatch
  const value = useEditorState((state) => state.value)
  const chord = useEditorState((state) => state.chord)
  const dottable = useEditorState((state) => takesDot(state.value.value, state.draft.meter))
  const doubleDottable = useEditorState((state) =>
    takesDot(state.value.value, state.draft.meter, 2),
  )
  const compound = useEditorState((state) => isCompound(state.draft.meter))
  return (
    <>
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
        label={t('doubleDot')}
        pressed={value.dots === 2}
        disabled={!doubleDottable}
        onClick={() => dispatch({ type: 'dot', dots: 2 })}
      >
        <span aria-hidden className={GLYPH}>
          {VALUE_GLYPHS[4]}..
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
      <ToolKey label={t('rest')} onClick={() => dispatch({ type: 'rest' })}>
        <span aria-hidden className={GLYPH}>
          {REST}
        </span>
      </ToolKey>
      <ToolKey label={t('marks.tie')} onClick={() => dispatch({ type: 'tie' })}>
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="size-6"
        >
          <circle cx="5" cy="9" r="2" fill="currentColor" />
          <circle cx="19" cy="9" r="2" fill="currentColor" />
          <path d="M5 13 C9 18 15 18 19 13" />
        </svg>
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

/** The notes at the caret a semitone up or down, as a sharp or a flat raises or lowers them. */
function SemitoneKeys() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const shift = (semitones: number) => actions.dispatch({ type: 'shift', semitones })
  return (
    <>
      <ToolKey label={t('up')} onClick={() => shift(1)}>
        <ArrowUp aria-hidden />
      </ToolKey>
      <ToolKey label={t('down')} onClick={() => shift(-1)}>
        <ArrowDown aria-hidden />
      </ToolKey>
    </>
  )
}

/** The notes at the caret an octave up or down. */
function OctaveKeys() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const shift = (semitones: number) => actions.dispatch({ type: 'shift', semitones })
  return (
    <>
      <ToolKey label={t('octaveUp')} onClick={() => shift(12)}>
        <ChevronsUp aria-hidden />
      </ToolKey>
      <ToolKey label={t('octaveDown')} onClick={() => shift(-12)}>
        <ChevronsDown aria-hidden />
      </ToolKey>
    </>
  )
}

/** The caret a step back or on. */
function StepKeys() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const move = (direction: -1 | 1) => actions.dispatch({ type: 'move', by: 'step', direction })
  return (
    <>
      <ToolKey label={t('back')} onClick={() => move(-1)}>
        <ArrowLeft aria-hidden />
      </ToolKey>
      <ToolKey label={t('on')} onClick={() => move(1)}>
        <ArrowRight aria-hidden />
      </ToolKey>
    </>
  )
}

/** Delete, as Backspace: the notes chosen, else the last before the caret, one by one back from the end. */
function DeleteKey({ span }: { span?: 'one' | 'wide' }) {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  return (
    <ToolKey
      label={t('deleteNotes')}
      {...(span ? { span } : {})}
      onClick={() => actions.dispatch({ type: 'delete', back: true })}
    >
      <Delete aria-hidden />
    </ToolKey>
  )
}

/**
 * The Notes keypad (a phone's), six keys a row: the values whole to 32nd; the dots, Triplet, Rest, Tie
 * and Chord; the caret's steps, a semitone up or down, and Delete at the row's end, where a keyboard
 * keeps it.
 */
export function NoteKeys() {
  const { t } = useTranslation('editor')
  return (
    <>
      <div
        role="group"
        aria-label={t('values.label')}
        className="col-span-full grid grid-cols-6 gap-1.5"
      >
        <ValueKeys />
      </div>
      <RhythmKeys />
      <StepKeys />
      <SemitoneKeys />
      <DeleteKey span="wide" />
    </>
  )
}

/** The Pitch keypad: a semitone and an octave up or down, and the notes spelled the other way. */
export function PitchKeys() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  return (
    <>
      <SemitoneKeys />
      <OctaveKeys />
      <ToolKey label={t('stepUp')} onClick={() => actions.dispatch({ type: 'step', steps: 1 })}>
        <span aria-hidden className="text-lg font-semibold">
          +1
        </span>
      </ToolKey>
      <ToolKey label={t('stepDown')} onClick={() => actions.dispatch({ type: 'step', steps: -1 })}>
        <span aria-hidden className="text-lg font-semibold">
          −1
        </span>
      </ToolKey>
      <ToolKey label={t('respell')} onClick={() => actions.dispatch({ type: 'respell' })}>
        <span aria-hidden className="text-xl font-semibold tracking-tight">
          ♯♭
        </span>
      </ToolKey>
    </>
  )
}

/**
 * A laptop's left column (Soundslice's): the values, then the rhythm's keys, the pitch's, and Delete
 * at its foot, two keys a row, always in sight beside the sheet.
 */
export function NoteColumn() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  return (
    <section aria-label={t('palette.notes')} className="grid grid-cols-3 content-start gap-1.5">
      <div
        role="group"
        aria-label={t('values.label')}
        className="col-span-full grid grid-cols-3 gap-1.5"
      >
        <ValueKeys />
      </div>
      <hr className="col-span-full my-1 border-hairline" />
      <RhythmKeys />
      <hr className="col-span-full my-1 border-hairline" />
      <SemitoneKeys />
      <OctaveKeys />
      <ToolKey label={t('respell')} onClick={() => actions.dispatch({ type: 'respell' })}>
        <span aria-hidden className="text-xl font-semibold tracking-tight">
          ♯♭
        </span>
      </ToolKey>
      <DeleteKey />
    </section>
  )
}
