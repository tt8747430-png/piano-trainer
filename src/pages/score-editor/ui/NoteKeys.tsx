import { ArrowDown, ArrowUp } from 'lucide-react'
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
        <StackedNotes />
      </ToolKey>
    </>
  )
}

/** Chord's picture: noteheads stacked on one stem, as the next notes stack onto the one at the caret. */
function StackedNotes() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-6" fill="currentColor">
      <ellipse cx="9" cy="18" rx="4" ry="2.8" transform="rotate(-20 9 18)" />
      <ellipse cx="9" cy="12.5" rx="4" ry="2.8" transform="rotate(-20 9 12.5)" />
      <ellipse cx="9" cy="7" rx="4" ry="2.8" opacity="0.45" transform="rotate(-20 9 7)" />
      <rect x="12.4" y="2" width="1.4" height="16" />
    </svg>
  )
}

/** A move in pitch drawn as its arrow over what it moves by, in words: a half step, a step, an octave. */
function Move({ up, by }: { up: boolean; by: string }) {
  const Arrow = up ? ArrowUp : ArrowDown
  return (
    <span aria-hidden className="flex flex-col items-center gap-0.5 leading-none">
      <Arrow className="size-5" />
      <span className="text-xs font-semibold tracking-tight">{by}</span>
    </span>
  )
}

/**
 * The Pitch keypad, each pair up then down: a half step (sharps up, flats down), a step of the key, an
 * octave; and Respell, the same keys written the other way (G♯ as A♭).
 */
export function PitchKeys() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const shift = (semitones: number) => actions.dispatch({ type: 'shift', semitones })
  const step = (steps: number) => actions.dispatch({ type: 'step', steps })
  const pairs = [
    { by: t('pitch.halfStep'), up: t('up'), down: t('down'), move: shift, size: 1 },
    { by: t('pitch.step'), up: t('stepUp'), down: t('stepDown'), move: step, size: 1 },
    { by: t('pitch.octave'), up: t('octaveUp'), down: t('octaveDown'), move: shift, size: 12 },
  ]
  return (
    <>
      {pairs.flatMap(({ by, up, down, move, size }) => [
        <ToolKey key={up} label={up} onClick={() => move(size)}>
          <Move up by={by} />
        </ToolKey>,
        <ToolKey key={down} label={down} onClick={() => move(-size)}>
          <Move up={false} by={by} />
        </ToolKey>,
      ])}
      <ToolKey
        label={t('respell')}
        span="wide"
        onClick={() => actions.dispatch({ type: 'respell' })}
      >
        <span aria-hidden className="flex flex-col items-center gap-0.5 leading-none">
          <span className="text-xl font-semibold tracking-tight">♯/♭</span>
          <span className="text-xs font-semibold tracking-tight">
            {t('pitch.respell')}
          </span>
        </span>
      </ToolKey>
    </>
  )
}

/**
 * The Notes keypad, six keys a row: the values whole to 32nd; the dots, Triplet, Rest, Tie and Chord.
 * The caret's moves and Delete stand apart from the palette (`CaretMoves`), a note's pitch under Pitch.
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
    </>
  )
}
