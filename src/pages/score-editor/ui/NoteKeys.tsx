import { ArrowDown, ArrowLeftRight, ArrowUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'
import {
  carriesAccidental,
  chosenNotes,
  EDIT_MODES,
  NOTE_VALUES,
  shownValue,
  takesDot,
  takesTuplet,
  type EditMode,
  type GraceKind,
} from '@/features/score-editor'
import { isCompound, type Accidental } from '@/shared/lib/music'
import { TUPLET_COUNTS, tupletOf, type TupletCount } from '@/shared/lib/notation'
import { Segmented } from '@/shared/ui'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { useNotesChosen } from '../model/use-notes-chosen'
import { TUPLET_WORDS, VALUE_GLYPHS, VALUE_WORDS } from '../model/value-words'
import type { Tool } from '../model/shortcuts'
import { usePaletteDock, usePaletteForm } from './palette-form'
import { KeyGrid, PaletteKey } from './palette-keys'
import { usePaletteReason } from './palette-reason'
import { LineKeys } from './LineKeys'

/** A key drawn as notation: a glyph of the music font, at a note value's size. */
const GLYPH = 'font-sans text-3xl leading-none'
/** A quarter rest, as the staff draws it. */
const REST = '𝄽'

/** What the palette shows as chosen: the chosen note's value, else the next note's. */
const useShown = () => useEditorState(useShallow(shownValue))

/** Each value's key, Flat's 1 to 7. */
const VALUE_TOOLS: Readonly<Partial<Record<number, Tool>>> = {
  1: 'whole',
  2: 'half',
  4: 'quarter',
  8: 'eighth',
  16: 'sixteenth',
  32: 'thirtySecond',
  64: 'sixtyFourth',
}

/**
 * The values whole to 64th (ADR 0114): with a note chosen it is made that value; else the next note
 * is written so. The chosen note's own value stands pressed.
 */
function ValueKeys() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const shown = useShown()
  return (
    <div role="group" aria-label={t('values.label')} className="contents">
      {NOTE_VALUES.map((option) => (
        <PaletteKey
          key={option}
          label={t(`values.${VALUE_WORDS[option]}`)}
          tool={VALUE_TOOLS[option]}
          pressed={shown?.value === option}
          onClick={() => actions.dispatch({ type: 'value', value: option })}
        >
          <span aria-hidden className={GLYPH}>
            {VALUE_GLYPHS[option]}
          </span>
        </PaletteKey>
      ))}
    </div>
  )
}

/** A hairline between the toolbar's groups; nothing in a grid or a list. */
function Divider() {
  if (usePaletteForm() !== 'bar') return null
  return <span aria-hidden className="mx-1 h-6 w-px shrink-0 self-center bg-hairline" />
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

/** The accidentals' keys, ♮ ♯ ♭, in Flat's order. */
const ACCIDENTAL_KEYS = [0, 1, -1] as const satisfies readonly Accidental[]

/**
 * The accidentals, Flat's (ADR 0114): each a toggle on the notes chosen, pressed while every one
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
    1: { label: t('accidentals.sharp'), picture: <Sharp />, tool: 'sharp' },
    [-1]: { label: t('accidentals.flat'), picture: <Flat />, tool: 'flat' },
    0: { label: t('accidentals.natural'), picture: <Natural />, tool: 'natural' },
  } as const
  return ACCIDENTAL_KEYS.map((accidental, i) => {
    const { label, picture, tool } = keys[accidental]
    return (
      <PaletteKey
        key={label}
        label={label}
        tool={tool}
        reason={t('reason.chooseNote')}
        pressed={carried[i] ?? false}
        disabled={!chosen}
        onClick={() => actions.dispatch({ type: 'accidental', accidental })}
      >
        <span aria-hidden>{picture}</span>
      </PaletteKey>
    )
  })
}

/** A notehead, as the mode pictures draw it. */
const Head = ({ cx, cy, soft = false }: { cx: number; cy: number; soft?: boolean }) => (
  <ellipse
    cx={cx}
    cy={cy}
    rx="4"
    ry="2.8"
    opacity={soft ? 0.45 : 1}
    transform={`rotate(-20 ${cx} ${cy})`}
  />
)

/**
 * A mode's picture (ADR 0114): Replace, the caret before a note it writes over; Insert, a note with
 * the arrow the later notes move by; Chord, noteheads stacked on one stem.
 */
function ModeIcon({ mode }: { mode: EditMode }) {
  if (mode === 'chord') return <StackedNotes />
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-6" fill="currentColor">
      {mode === 'replace' ? (
        <>
          <rect x="4" y="3" width="1.6" height="18" rx="0.8" />
          <Head cx={14} cy={15} />
          <rect x="17.4" y="3" width="1.4" height="12" />
        </>
      ) : (
        <>
          <Head cx={7} cy={15} />
          <rect x="10.4" y="3" width="1.4" height="12" />
          <path
            d="M14 15h6m-2.5-2.5L20 15l-2.5 2.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </svg>
  )
}

/**
 * The editing modes (ADR 0114, Flat's Melody · Insert · Chord): one always chosen; what a key played
 * does in each is the ⓘ beside the section's name (ADR 0096); I cycles them.
 */
function ModeChoice() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const mode = useEditorState((state) => state.mode)
  return (
    <Segmented
      label={t('mode.label')}
      value={mode}
      options={EDIT_MODES.map((each) => ({
        value: each,
        label: t(`mode.${each}`),
        icon: <ModeIcon mode={each} />,
      }))}
      onChange={(next) => actions.dispatch({ type: 'mode', mode: next })}
    />
  )
}

/**
 * The everyday tools, Flat's quick toolbar in its order: the accidentals ♮ ♯ ♭ and Respell, the
 * values whole to 64th, Dotted and Double dotted (out of reach where the meter takes none), Tie,
 * Tuplet (the meter's first: a triplet, a duplet in compound time) and Rest. The note-entry toolbar over the sheet on a
 * laptop, the sheet's quick row on a phone, and the Notes' keys there.
 */
export function NoteBar() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const dispatch = actions.dispatch
  const shown = useShown()
  const dottable = useEditorState((state) =>
    takesDot((shownValue(state) ?? state.value).value, state.draft.meter),
  )
  const doubleDottable = useEditorState((state) =>
    takesDot((shownValue(state) ?? state.value).value, state.draft.meter, 2),
  )
  const off = !useNotesChosen()
  return (
    <>
      <AccidentalKeys />
      <PaletteKey
        label={t('respell')}
        tool="respell"
        reason={t('reason.chooseNote')}
        disabled={off}
        onClick={() => dispatch({ type: 'respell' })}
      >
        <span aria-hidden className="flex items-center [&_svg]:size-4.5">
          <Flat />
          <ArrowLeftRight className="size-3.5!" strokeWidth={2.5} />
          <Sharp />
        </span>
      </PaletteKey>
      <Divider />
      <ValueKeys />
      <Divider />
      <PaletteKey
        label={t('dot')}
        tool="dot"
        reason={t('reason.noDot')}
        pressed={shown?.dots === 1}
        disabled={!dottable}
        onClick={() => dispatch({ type: 'dot' })}
      >
        <span aria-hidden className={GLYPH}>
          {VALUE_GLYPHS[4]}.
        </span>
      </PaletteKey>
      <PaletteKey
        label={t('doubleDot')}
        reason={t('reason.noDot')}
        pressed={shown?.dots === 2}
        disabled={!doubleDottable}
        onClick={() => dispatch({ type: 'dot', dots: 2 })}
      >
        <span aria-hidden className={GLYPH}>
          {VALUE_GLYPHS[4]}..
        </span>
      </PaletteKey>
      <PaletteKey label={t('marks.tie')} tool="tie" onClick={() => dispatch({ type: 'tie' })}>
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="size-6"
        >
          <path d="M3 10 C8 16 16 16 21 10" />
        </svg>
      </PaletteKey>
      <QuickTupletKey />
      <PaletteKey label={t('rest')} tool="rest" onClick={() => dispatch({ type: 'rest' })}>
        <span aria-hidden className={GLYPH}>
          {REST}
        </span>
      </PaletteKey>
    </>
  )
}

/**
 * The Notes section: the editing modes, then, where the palette is a sheet at the foot (a phone),
 * the everyday tools in its table; on a laptop those stand in the note-entry toolbar over the sheet.
 */
export function NoteKeys() {
  const sheet = usePaletteDock() === 'sheet'
  return (
    <>
      <ModeChoice />
      {sheet ? (
        <KeyGrid>
          <NoteBar />
        </KeyGrid>
      ) : null}
      <KeyGrid>
        <TupletKeys />
      </KeyGrid>
    </>
  )
}

/** A tuplet's bracket round its count, as Flat's key and a score draw it: ⌐3¬. */
function TupletBracket({ num }: { num: TupletCount }) {
  return (
    <span aria-hidden className="flex items-start gap-0.5 font-display text-base leading-none">
      <span className="mt-1 size-1.5 border-t-[1.5px] border-l-[1.5px] border-current" />
      <span className="font-semibold italic">{num}</span>
      <span className="mt-1 size-1.5 border-t-[1.5px] border-r-[1.5px] border-current" />
    </span>
  )
}

/** One tuplet's key: on the value chosen, the same again off; greyed where the meter or value takes none. */
function TupletKey({ num }: { num: TupletCount }) {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const shown = useShown()
  const meter = useEditorState((state) => state.draft.meter)
  const value = useEditorState((state) => (shownValue(state) ?? state.value).value)
  return (
    <PaletteKey
      label={t(`tuplets.${TUPLET_WORDS[num]}`)}
      tool={num === 9 ? undefined : `tuplet${num}`}
      reason={t(tupletOf(num, meter) ? 'reason.shortTuplet' : 'reason.plainTuplet')}
      pressed={shown?.tuplet?.num === num}
      disabled={!takesTuplet(value, num, meter)}
      onClick={() => actions.dispatch({ type: 'tuplet', num })}
    >
      <TupletBracket num={num} />
    </PaletteKey>
  )
}

/** The quick toolbar's Tuplet, Flat's: the meter's first, a triplet, or a duplet in compound time. */
function QuickTupletKey() {
  const compound = useEditorState((state) => isCompound(state.draft.meter))
  return <TupletKey num={compound ? 2 : 3} />
}

/**
 * The tuplets two to nine (ADR 0097, Flat's ⇧2–⇧8, nine by its key alone), each on the value
 * chosen: the chosen note's, else the next written; greyed where the meter writes such notes plainly (two or four to a simple
 * beat, three or six to a compound one) or the value is too short for it.
 */
function TupletKeys() {
  return TUPLET_COUNTS.map((num) => <TupletKey key={num} num={num} />)
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
        <span className="font-display text-base leading-none font-bold italic">8ve</span>
      )}
    </span>
  )
}

/**
 * A grace note before its note, as Flat's keys draw it: a small flagged note, then a head; the
 * acciaccatura's stem slashed.
 */
function GraceNote({ kind }: { kind: GraceKind }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-6" fill="currentColor">
      <ellipse cx="6" cy="16" rx="2.6" ry="1.9" transform="rotate(-20 6 16)" />
      <rect x="7.9" y="6" width="1.1" height="10" />
      <path d="M9 6c0 2 3.2 2.6 2.9 5.6-.4-1.6-1.6-2.3-2.9-2.5z" />
      {kind === 'acciaccatura' ? (
        <path d="M4.5 12.5 12 7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      ) : null}
      <ellipse cx="16.5" cy="17" rx="3.8" ry="2.7" transform="rotate(-20 16.5 17)" />
    </svg>
  )
}

/** Flat's two grace-note keys, with their shortcuts: the appoggiatura (9), the acciaccatura (⇧9). */
const GRACE_KEYS = [
  { kind: 'appoggiatura', label: 'grace', tool: 'grace' },
  { kind: 'acciaccatura', label: 'acciaccatura', tool: 'acciaccatura' },
] as const satisfies readonly { kind: GraceKind; label: string; tool: Tool }[]

/**
 * The grace-note keys (Flat's): one puts a grace note of its kind before the notes chosen and chooses
 * it, so ↑ ↓, the accidentals, a key played and Delete edit it; pressed where they carry its kind.
 */
function GraceKeys() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const off = !useNotesChosen()
  const reason = usePaletteReason()
  const kinds = useEditorState(
    useShallow((state) =>
      GRACE_KEYS.map(({ kind }) => {
        const notes = chosenNotes(state)
        return (
          notes.length > 0 &&
          notes.every((n) => {
            const grace = n.marks?.grace
            return (
              grace !== undefined &&
              grace.length > 0 &&
              grace.every((g) => (g.appoggiatura === true) === (kind === 'appoggiatura'))
            )
          })
        )
      }),
    ),
  )
  return GRACE_KEYS.map(({ kind, label, tool }, i) => (
    <PaletteKey
      key={kind}
      label={t(label)}
      tool={tool}
      reason={reason}
      pressed={kinds[i] ?? false}
      disabled={off}
      onClick={() => actions.dispatch({ type: 'grace', kind })}
    >
      <GraceNote kind={kind} />
    </PaletteKey>
  ))
}

/**
 * The Pitch section (Flat's Pitch and representation): each pair up then down, a step of the key, a
 * half step (sharps up, flats down), an octave; then the grace note (Flat's 9) and the octave lines.
 * Each key its picture alone, named in its tooltip.
 */
export function PitchKeys() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const shift = (semitones: number) => actions.dispatch({ type: 'shift', semitones })
  const step = (steps: number) => actions.dispatch({ type: 'step', steps })
  const off = !useNotesChosen()
  const reason = usePaletteReason()
  const pairs = [
    // In the keys' order: ↑ ↓ a step in the key, with Shift a semitone, with Cmd an octave.
    { by: 'step', up: t('stepUp'), down: t('stepDown'), move: step, size: 1 },
    { by: 'half', up: t('up'), down: t('down'), move: shift, size: 1 },
    { by: 'octave', up: t('octaveUp'), down: t('octaveDown'), move: shift, size: 12 },
  ] as const
  return (
    <KeyGrid>
      {pairs.flatMap(({ by, up, down, move, size }) => [
        <PaletteKey key={up} label={up} reason={reason} disabled={off} onClick={() => move(size)}>
          <Move up by={by} />
        </PaletteKey>,
        <PaletteKey
          key={down}
          label={down}
          reason={reason}
          disabled={off}
          onClick={() => move(-size)}
        >
          <Move up={false} by={by} />
        </PaletteKey>,
      ])}
      <GraceKeys />
      <LineKeys lines={['8va', '8vb', '15ma', '15mb']} />
    </KeyGrid>
  )
}
