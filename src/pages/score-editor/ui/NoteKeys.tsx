import { ArrowDown, ArrowLeftRight, ArrowUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'
import {
  carriesAccidental,
  chosenNotes,
  NOTE_VALUES,
  shownValue,
  takesDot,
} from '@/features/score-editor'
import { isCompound, type Accidental } from '@/shared/lib/music'
import { ToolKey } from '@/shared/ui'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { useNotesChosen } from '../model/use-notes-chosen'
import { VALUE_GLYPHS, VALUE_WORDS } from '../model/value-words'
import { GlyphGrid } from './palette-keys'

/** A key drawn as notation: a glyph of the music font, at a note value's size. */
const GLYPH = 'font-sans text-3xl leading-none'
/** A quarter rest, as the staff draws it. */
const REST = '𝄽'

/** What the palette shows as chosen: the chosen note's value, else the next note's. */
const useShown = () => useEditorState(useShallow(shownValue))

/**
 * The palette's quick row (spec 2026-10-23), always in sight: the values whole to 32nd and Dotted.
 * With a note chosen it is made that value; else the next note is written so. The chosen note's own
 * value stands pressed.
 */
export function QuickValues() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const shown = useShown()
  const dottable = useEditorState((state) =>
    takesDot((shownValue(state) ?? state.value).value, state.draft.meter),
  )
  return (
    <div role="group" aria-label={t('values.label')} className="grid grid-cols-7 gap-1">
      {NOTE_VALUES.map((option) => (
        <ToolKey
          key={option}
          label={t(`values.${VALUE_WORDS[option]}`)}
          pressed={shown?.value === option}
          className="h-11"
          onClick={() => actions.dispatch({ type: 'value', value: option })}
        >
          <span aria-hidden className={GLYPH}>
            {VALUE_GLYPHS[option]}
          </span>
        </ToolKey>
      ))}
      <ToolKey
        label={t('dot')}
        pressed={shown?.dots === 1}
        disabled={!dottable}
        className="h-11"
        onClick={() => actions.dispatch({ type: 'dot' })}
      >
        <span aria-hidden className={GLYPH}>
          {VALUE_GLYPHS[4]}.
        </span>
      </ToolKey>
    </div>
  )
}

/** A natural, drawn as the staff draws it. */
function Natural() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="currentColor">
      <rect x="8" y="2" width="1.5" height="15" />
      <rect x="14.5" y="7" width="1.5" height="15" />
      <path d="M8 9.5 16 7.5v2.6L8 12.1zM8 15.5l8-2v2.6l-8 2z" />
    </svg>
  )
}

/** The accidentals' keys, ♯ ♭ ♮, in the palette's order. */
const ACCIDENTAL_KEYS = [1, -1, 0] as const satisfies readonly Accidental[]

/**
 * The accidentals, Flat's (ADR 0091): each a toggle on the notes chosen, pressed while every one
 * carries its sign, a tap writing the sign or taking it off (the note back as the key spells it);
 * greyed with no note chosen.
 */
function AccidentalKeys() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const chosen = useNotesChosen()
  const carried = useEditorState(
    useShallow((state) => {
      const notes = chosenNotes(state)
      return ACCIDENTAL_KEYS.map((accidental) => carriesAccidental(notes, accidental))
    }),
  )
  const keys = {
    1: { label: t('accidentals.sharp'), picture: <Sharp /> },
    [-1]: { label: t('accidentals.flat'), picture: <Flat /> },
    0: { label: t('accidentals.natural'), picture: <Natural /> },
  } as const
  return ACCIDENTAL_KEYS.map((accidental, i) => {
    const { label, picture } = keys[accidental]
    return (
      <ToolKey
        key={label}
        label={label}
        pressed={carried[i] ?? false}
        disabled={!chosen}
        onClick={() => actions.dispatch({ type: 'accidental', accidental })}
      >
        <span aria-hidden>{picture}</span>
      </ToolKey>
    )
  })
}

/**
 * The Notes section, under the quick row's values: Double dotted and Triplet (out of reach where the
 * meter takes none), Rest, Tie and Chord, then the accidentals.
 */
export function NoteKeys() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const dispatch = actions.dispatch
  const shown = useShown()
  const chord = useEditorState((state) => state.chord)
  const doubleDottable = useEditorState((state) =>
    takesDot((shownValue(state) ?? state.value).value, state.draft.meter, 2),
  )
  const compound = useEditorState((state) => isCompound(state.draft.meter))
  return (
    <GlyphGrid>
      <ToolKey
        label={t('doubleDot')}
        pressed={shown?.dots === 2}
        disabled={!doubleDottable}
        onClick={() => dispatch({ type: 'dot', dots: 2 })}
      >
        <span aria-hidden className={GLYPH}>
          {VALUE_GLYPHS[4]}..
        </span>
      </ToolKey>
      <ToolKey
        label={t('triplet')}
        pressed={shown?.triplet === true}
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
      <AccidentalKeys />
    </GlyphGrid>
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

/** A sharp, drawn as the staff draws it. */
function Sharp() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="currentColor">
      <rect x="8.5" y="3" width="1.4" height="18" />
      <rect x="14.1" y="2" width="1.4" height="18" />
      <path d="M5 9.6 19 6.6v2.8L5 12.4zM5 15.6l14-3v2.8L5 18.4z" />
    </svg>
  )
}

/** A flat, drawn as the staff draws it. */
function Flat() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="currentColor">
      <rect x="7" y="2" width="1.6" height="20" />
      <path d="M8.6 21.5c4.5-2.6 9-5.4 8.3-8.6-.6-2.4-4-2.5-8.3.6v1.9c3-2.2 5.3-2.4 5.6-.9.4 1.8-2.3 4-5.6 6z" />
    </svg>
  )
}

/** A move in pitch, drawn: its arrow beside a sharp or a flat, two notes a step apart, or 8va. */
function Move({ up, by }: { up: boolean; by: 'half' | 'step' | 'octave' }) {
  const Arrow = up ? ArrowUp : ArrowDown
  return (
    <span aria-hidden className="flex items-center gap-0.5 leading-none">
      <Arrow className="size-4" strokeWidth={2.5} />
      {by === 'half' ? (
        up ? (
          <Sharp />
        ) : (
          <Flat />
        )
      ) : by === 'step' ? (
        <svg viewBox="0 0 24 24" className="size-6" fill="currentColor">
          <ellipse
            cx="7"
            cy={up ? 16 : 9}
            rx="4"
            ry="2.8"
            transform={`rotate(-20 7 ${up ? 16 : 9})`}
          />
          <ellipse
            cx="17"
            cy={up ? 9 : 16}
            rx="4"
            ry="2.8"
            transform={`rotate(-20 17 ${up ? 9 : 16})`}
          />
        </svg>
      ) : (
        <span className="font-display text-base leading-none font-bold italic">
          8<sup className="text-[0.6em]">{up ? 'va' : 'vb'}</sup>
        </span>
      )}
    </span>
  )
}

/**
 * The Pitch keypad, each pair up then down: a half step (sharps up, flats down), a step of the key, an
 * octave; and Respell, the same keys written the other way (G♯ as A♭). Each key its picture alone,
 * named in its tooltip.
 */
export function PitchKeys() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const shift = (semitones: number) => actions.dispatch({ type: 'shift', semitones })
  const step = (steps: number) => actions.dispatch({ type: 'step', steps })
  const off = !useNotesChosen()
  const pairs = [
    // In the keys' order: ↑ ↓ a step in the key, with Shift a semitone, with Cmd an octave.
    { by: 'step', up: t('stepUp'), down: t('stepDown'), move: step, size: 1 },
    { by: 'half', up: t('up'), down: t('down'), move: shift, size: 1 },
    { by: 'octave', up: t('octaveUp'), down: t('octaveDown'), move: shift, size: 12 },
  ] as const
  return (
    <GlyphGrid>
      {pairs.flatMap(({ by, up, down, move, size }) => [
        <ToolKey key={up} label={up} disabled={off} onClick={() => move(size)}>
          <Move up by={by} />
        </ToolKey>,
        <ToolKey key={down} label={down} disabled={off} onClick={() => move(-size)}>
          <Move up={false} by={by} />
        </ToolKey>,
      ])}
      <ToolKey
        label={t('respell')}
        span="wide"
        disabled={off}
        onClick={() => actions.dispatch({ type: 'respell' })}
      >
        <span aria-hidden className="flex items-center gap-1">
          <Sharp />
          <ArrowLeftRight className="size-5" strokeWidth={2.5} />
          <Flat />
        </span>
      </ToolKey>
    </GlyphGrid>
  )
}
