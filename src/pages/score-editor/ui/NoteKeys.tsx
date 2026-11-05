import { ArrowDown, ArrowLeftRight, ArrowUp, ChevronDown } from 'lucide-react'
import { useMemo } from 'react'
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
  type ChosenValue,
  type EditMode,
  type GraceKind,
} from '@/features/score-editor'
import { isCompound, type Accidental } from '@/shared/lib/music'
import { TUPLET_COUNTS, tupletOf, type TupletCount } from '@/shared/lib/notation'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/primitives/popover'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { useNotesChosen } from '../model/use-notes-chosen'
import { TUPLET_WORDS, VALUE_GLYPHS, VALUE_WORDS } from '../model/value-words'
import type { Tool } from '../model/shortcuts'
import { PaletteFormContext, usePaletteForm } from './palette-form'
import { GroupName, KeyGrid, PaletteKey } from './palette-keys'
import { usePaletteReason } from './palette-reason'
import { LineKeys } from './LineKeys'
import { PaletteGlyph, TupletGlyph } from './palette-glyph'
import type { SmuflName } from '@/shared/ui/smufl'

/** A key drawn as notation: a glyph of the music font, at a note value's size. */
const GLYPH = 'font-sans text-3xl leading-none'
/** A quarter rest, as the staff draws it. */
const REST = '𝄽'

/** What the palette shows as chosen: the chosen note's value, else the next note's. */
/** The value shown, kept while it reads the same: its tuplet is a fresh object each time it is read. */
function useShown(): ChosenValue | null {
  const key = useEditorState((state) => JSON.stringify(shownValue(state)))
  return useMemo(() => JSON.parse(key) as ChosenValue | null, [key])
}

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
 * The input modes (ADR 0114, R31-E, Flat's Melody · Insert · Chord): a cell each, the one the editor
 * writes in pressed; what a key played does in each is the ⓘ beside the section's title (ADR 0096);
 * I cycles them.
 */
function ModeKeys() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const mode = useEditorState((state) => state.mode)
  return (
    <KeyGrid label={t('mode.label')}>
      {EDIT_MODES.map((each) => (
        <PaletteKey
          key={each}
          label={t(`mode.${each}`)}
          tool={each === 'chord' ? undefined : 'mode'}
          pressed={mode === each}
          onClick={() => actions.dispatch({ type: 'mode', mode: each })}
        >
          <ModeIcon mode={each} />
        </PaletteKey>
      ))}
    </KeyGrid>
  )
}

/** What a key played does in each input mode (ADR 0114), where their names alone do not say. */
function ModesAbout() {
  const { t } = useTranslation('editor')
  return (
    <dl className="flex flex-col gap-2">
      {EDIT_MODES.map((mode) => (
        <div key={mode}>
          <dt className="font-semibold">{t(`mode.${mode}`)}</dt>
          <dd className="text-muted-foreground">{t(`mode.${mode}Detail`)}</dd>
        </div>
      ))}
    </dl>
  )
}

/** Add note's picture (Flat's): a quarter note with a plus. */
function AddNoteIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-6" fill="currentColor">
      <ellipse cx="13" cy="17.5" rx="4.2" ry="3" transform="rotate(-20 13 17.5)" />
      <rect x="16.1" y="3" width="1.6" height="14.5" />
      <path d="M3 7.25h6v1.5H3zM5.25 5h1.5v6h-1.5z" />
    </svg>
  )
}

/**
 * The everyday tools, Flat's Notation in its order (R31-E): Add note, the values whole to 64th,
 * Dotted and Double dotted (out of reach where the meter takes none), Tie, Tuplets (the meter's
 * first, a triplet or a duplet in compound time, its ⌄ opening the others), Rest, then the
 * accidentals ♮ ♯ ♭ and Respell. The note-entry toolbar over the sheet on a laptop, the phone's
 * folded row, and the Notes' grid.
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
  const onStaff = useEditorState((state) => state.layer !== 'chords')
  const off = !useNotesChosen()
  return (
    <>
      <PaletteKey
        label={t('addNote')}
        reason={t('reason.staff')}
        disabled={!onStaff}
        onClick={() => dispatch({ type: 'addNote' })}
      >
        <AddNoteIcon />
      </PaletteKey>
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
      <TupletsKey />
      <PaletteKey label={t('rest')} tool="rest" onClick={() => dispatch({ type: 'rest' })}>
        <span aria-hidden className={GLYPH}>
          {REST}
        </span>
      </PaletteKey>
      <Divider />
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
    </>
  )
}

/**
 * The Notes category (R31-E): the input modes, then Notation's tools. In the row the modes are left
 * out: they are a choice made once, not a tool used at every note.
 */
export function NoteKeys() {
  const { t } = useTranslation('editor')
  const row = usePaletteForm() === 'bar'
  return (
    <>
      {row ? null : (
        <>
          <GroupName name={t('mode.label')} info={<ModesAbout />} />
          <ModeKeys />
          <GroupName name={t('palette.groups.notation')} />
        </>
      )}
      <KeyGrid label={t('palette.groups.notation')}>
        <NoteBar />
      </KeyGrid>
    </>
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
      <TupletGlyph num={num} />
    </PaletteKey>
  )
}

/**
 * Tuplets (R31-E, Flat's 3 ⌄): the meter's first on its face, a triplet or a duplet in compound
 * time, opening the tuplets two to nine (ADR 0097, Flat's ⇧2–⇧8, nine by its key alone), each on the
 * value chosen; greyed where the meter writes such notes plainly or the value is too short for it.
 * The one on the value chosen is pressed.
 */
function TupletsKey() {
  const { t } = useTranslation('editor')
  const compound = useEditorState((state) => isCompound(state.draft.meter))
  const on = useShown()?.tuplet !== undefined
  const label = t('palette.groups.tuplets')
  return (
    <Popover>
      <PopoverTrigger
        render={
          <PaletteKey label={label} pressed={on}>
            <span aria-hidden className="flex items-center gap-0.5">
              <TupletGlyph num={compound ? 2 : 3} />
              <ChevronDown className="size-3.5!" strokeWidth={2.5} />
            </span>
          </PaletteKey>
        }
      />
      <PopoverContent aria-label={label} side="top" className="w-72 max-w-[calc(100vw-2rem)] p-3">
        <PaletteFormContext value="grid">
          <KeyGrid label={label}>
            {TUPLET_COUNTS.map((num) => (
              <TupletKey key={num} num={num} />
            ))}
          </KeyGrid>
        </PaletteFormContext>
      </PopoverContent>
    </Popover>
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
        <span className="font-display text-base leading-none font-bold italic">8ve</span>
      )}
    </span>
  )
}

/** A grace note's key as the score prints it: Bravura's small note, the acciaccatura's stem slashed. */
const GRACE_GLYPHS = {
  appoggiatura: 'graceNoteAppoggiaturaStemUp',
  acciaccatura: 'graceNoteAcciaccaturaStemUp',
} as const satisfies Readonly<Record<GraceKind, SmuflName>>

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
      <PaletteGlyph smufl={GRACE_GLYPHS[kind]} />
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
