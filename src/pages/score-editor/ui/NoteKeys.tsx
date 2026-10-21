import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Delete, Layers } from 'lucide-react'
import type { ReactNode } from 'react'
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

/**
 * A key's picture of a move in pitch: the sign of how far (♯ ♭ a semitone, 8 an octave, a note on a
 * line a step of the key) with an arrow up or down beside it.
 */
function Raised({ mark, up = false }: { mark: ReactNode; up?: boolean }) {
  const Arrow = up ? ArrowUp : ArrowDown
  return (
    <span aria-hidden className="flex items-center gap-0.5 leading-none">
      <span className="font-music text-2xl">{mark}</span>
      <Arrow className="size-4" />
    </span>
  )
}

/** A note on a staff's lines: a step of the key's picture. */
const ON_LINES = (
  <svg viewBox="0 0 20 20" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.2">
    <path d="M1 6 H19 M1 10 H19 M1 14 H19" />
    <ellipse cx="10" cy="10" rx="3.6" ry="2.6" fill="currentColor" transform="rotate(-20 10 10)" />
  </svg>
)

/** The notes at the caret a semitone up or down, as a sharp or a flat raises or lowers them. */
function SemitoneKeys() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const shift = (semitones: number) => actions.dispatch({ type: 'shift', semitones })
  return (
    <>
      <ToolKey label={t('up')} onClick={() => shift(1)}>
        <Raised mark="♯" up />
      </ToolKey>
      <ToolKey label={t('down')} onClick={() => shift(-1)}>
        <Raised mark="♭" />
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
        <Raised mark="8" up />
      </ToolKey>
      <ToolKey label={t('octaveDown')} onClick={() => shift(-12)}>
        <Raised mark="8" />
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
        <Raised mark={ON_LINES} up />
      </ToolKey>
      <ToolKey label={t('stepDown')} onClick={() => actions.dispatch({ type: 'step', steps: -1 })}>
        <Raised mark={ON_LINES} />
      </ToolKey>
      <ToolKey label={t('respell')} onClick={() => actions.dispatch({ type: 'respell' })}>
        <span aria-hidden className="text-xl font-semibold tracking-tight">
          ♯♭
        </span>
      </ToolKey>
    </>
  )
}
