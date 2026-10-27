import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'
import {
  BARLINE_CHOICES,
  chosenBars,
  clefAt,
  isHandLayer,
  JUMP_CHOICES,
  sectionKey,
  sectionMeter,
  type BarMarkChoice,
  type NoteLayer,
} from '@/features/score-editor'
import {
  CLEFS,
  EXPRESSION_TEXT,
  EXPRESSIONS,
  keySignature,
  noteName,
  printedSymbol,
  signatureKey,
  writtenKey,
  type Key,
  type Pedal,
} from '@/shared/lib/music'
import { Segmented } from '@/shared/ui'
import { useLayerName } from '@/widgets/score-sheet'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { isJumpWords, JUMP_SIGNS, JUMP_WORDS } from '../model/palette-categories'
import { useNotesChosen } from '../model/use-notes-chosen'
import { useSignatureFrom } from '../model/use-signature-from'
import { useStaffHeads } from '../model/use-staff-heads'
import { FieldKey } from './FieldKey'
import { CodaSign } from './palette-icons'
import { usePaletteForm } from './palette-form'
import {
  CaptionGrid,
  CaptionKey,
  GroupName,
  Printed,
  SectionLine,
  SignGrid,
  SignTile,
  TermGrid,
  TermKey,
} from './palette-keys'
import { usePaletteReason } from './palette-reason'
import { BarlinePicture, ClefPicture, KeyPicture, TimePicture } from './sign-pictures'
import { SignPopover } from './SignPopover'
import { TimePicker } from './TimePicker'

/**
 * The clef picker (ADR 0069, 0097, 0114): the clefs the notation writes, each drawn on its staff over
 * its name, the one the staff is in pressed: one of the piano's from a bar on, a single staff's whole.
 * In the palette the caret's staff from the first bar chosen (else the caret's); over a clef printed
 * on the sheet (ADR 0094), its staff from its bar (`at`).
 */
export function ClefKeys({ at }: { at?: { readonly staff: NoteLayer; readonly bar: number } }) {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const caret = useEditorState((state) => (state.layer === 'chords' ? null : state.layer))
  const chosen = useEditorState((state) => chosenBars(state).from)
  const staff = at ? at.staff : caret
  const bar = at ? at.bar : chosen
  const current = useEditorState((state) => (staff ? clefAt(state.draft, bar, staff) : null))
  const layerName = useLayerName(useStaffHeads())
  const reason = usePaletteReason()
  return (
    <>
      {staff ? (
        <SectionLine>
          {isHandLayer(staff)
            ? t('clef.from', { staff: layerName(staff), bar: bar + 1 })
            : layerName(staff)}
        </SectionLine>
      ) : null}
      <SignGrid label={t('palette.category.clef')}>
        {CLEFS.map((clef) => (
          <SignTile
            key={clef}
            label={t(`clef.${clef}`)}
            reason={reason}
            pressed={current === clef}
            disabled={!staff}
            onClick={() => staff && actions.dispatch({ type: 'clef', staff, clef, bar })}
          >
            <ClefPicture clef={clef} />
          </SignTile>
        ))}
      </SignGrid>
    </>
  )
}

/** A key's names: its tonic printed, the major's alone and the minor's with its m (`E♭`, `Cm`). */
function useKeyNames() {
  const { t } = useTranslation('music')
  const tonic = (key: Key) => printedSymbol(noteName(key.tonic))
  return {
    /** As a screen reader and a tooltip say it: `E♭ major`. */
    full: (key: Key) => t(key.minor ? 'key.minor' : 'key.major', { tonic: tonic(key) }),
    /** As a tile prints it: `E♭`, `Cm`. */
    short: (key: Key) => `${tonic(key)}${key.minor ? 'm' : ''}`,
  }
}

/** The key in force where the picker changes it: the song's own at its head, a section's after. */
const useKeyAt = (bar: number | undefined) => {
  const { section, song } = useSignatureFrom(bar)
  return useEditorState(
    useShallow((state) => (song ? state.draft.key : sectionKey(state.draft, section))),
  )
}

/** The signatures of one to seven sharps, and of one to seven flats. */
const SHARPS = [1, 2, 3, 4, 5, 6, 7] as const
const FLATS = [-1, -2, -3, -4, -5, -6, -7] as const

/**
 * The key signature picker (ADR 0089, 0094, 0114, after notation apps' sheets): Major · Minor, the
 * same tonic's other mode, nothing moved; No key signature, C major or A minor, a tile of its own;
 * then one to seven sharps over one to seven flats, each tile the signature drawn on a staff, named
 * by its major and relative minor, the one in force pressed. A tile keeps the key's mode: a minor song
 * goes to the signature's minor key. From a bar's section on, up to the next change, as Flat changes
 * key from a bar; in the song's first section its own key, the music moved with it (`said` says
 * which). In the palette the first bar chosen's (else the caret's); over a key signature printed on
 * the sheet, its bar (`bar`). A tap changes it.
 */
export function KeyPicker({ bar }: { bar?: number | undefined }) {
  const { t } = useTranslation(['editor', 'music'])
  const { actions } = useScoreEditorContext()
  const { from, song, said } = useSignatureFrom(bar)
  const names = useKeyNames()
  const key = useKeyAt(bar)
  const count = keySignature(key)
  const choose = (next: Key) =>
    actions.dispatch(
      song ? { type: 'settings', key: next } : { type: 'sectionKey', bar: from, key: next },
    )
  const tile = (each: number) => {
    const major = signatureKey(each, false)
    const minor = signatureKey(each, true)
    const label = `${names.full(major)}, ${names.full(minor)}`
    return (
      <SignTile
        key={each}
        label={each === 0 ? `${t('signature.none')}: ${label}` : label}
        name={
          each === 0
            ? `${t('signature.none')} · ${names.short(major)} / ${names.short(minor)}`
            : `${names.short(major)} / ${names.short(minor)}`
        }
        pressed={each === count}
        onClick={() => (each === count ? undefined : choose(key.minor ? minor : major))}
      >
        <KeyPicture signatureOf={major} />
      </SignTile>
    )
  }
  return (
    <>
      <h4 className="text-sm text-muted-foreground">{said}</h4>
      {/* Major or minor on the same tonic, nothing moved: C major to C minor. */}
      <Segmented
        label={t('music:key.mode')}
        value={key.minor ? 'minor' : 'major'}
        options={(['major', 'minor'] as const).map((mode) => ({
          value: mode,
          label: t(`music:key.${mode}Mode`),
        }))}
        onChange={(mode) => choose(writtenKey({ tonic: key.tonic, minor: mode === 'minor' }))}
      />
      <div role="group" aria-label={t('music:key.label')} className="flex flex-col gap-2">
        <div className="grid">{tile(0)}</div>
        <GroupName name={t('signature.sharps')} />
        <SignGrid label={t('signature.sharps')} narrow>
          {SHARPS.map(tile)}
        </SignGrid>
        <GroupName name={t('signature.flats')} />
        <SignGrid label={t('signature.flats')} narrow>
          {FLATS.map(tile)}
        </SignGrid>
      </div>
    </>
  )
}

/**
 * Key signature in the palette (ADR 0114): opened, its picker in its section; in the folded row, the
 * key in force drawn, opening the same picker over it.
 */
export function KeySignatureKeys() {
  const { t } = useTranslation('editor')
  const names = useKeyNames()
  const key = useKeyAt(undefined)
  const title = t('palette.category.key')
  if (usePaletteForm() === 'sections') return <KeyPicker />
  return (
    <SignPopover
      label={title}
      wide
      trigger={
        <SignTile label={t('signature.change', { sign: title, now: names.full(key) })}>
          <KeyPicture signatureOf={key} />
        </SignTile>
      }
    >
      <KeyPicker />
    </SignPopover>
  )
}

/**
 * Time signature in the palette (ADR 0114): the meter in force drawn, from the first bar chosen's
 * section (else the caret's), opening its picker over it, where the wheels slide and Apply changes it;
 * opened, under what it changes.
 */
export function TimeSignatureKeys() {
  const { t } = useTranslation('editor')
  const { section, said } = useSignatureFrom(undefined)
  const meter = useEditorState((state) => sectionMeter(state.draft, section))
  const common = useEditorState((state) => meter === '4/4' && state.draft.timeSymbol === true)
  const title = t('palette.category.time')
  return (
    <>
      <SectionLine>{said}</SectionLine>
      <SignGrid>
        <SignPopover
          label={title}
          trigger={
            <SignTile label={t('signature.change', { sign: title, now: meter })} name={meter}>
              <TimePicture meter={meter} common={common} />
            </SignTile>
          }
        >
          {(close) => <TimePicker onDone={close} />}
        </SignPopover>
      </SignGrid>
    </>
  )
}

/**
 * Barlines & repeats: the barlines and endings as tiles (ADR 0110, forScore's), each drawn on its staff
 * over its name, then the signs and jumps, on the bars chosen, else the caret's: a sign as printed
 * over its name; a jump's words alone, what they ask its tooltip (ADR 0096).
 */
export function RepeatKeys() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const mark = (choice: BarMarkChoice) => () => actions.dispatch({ type: 'barMarks', choice })
  const key = (choice: BarMarkChoice) =>
    isJumpWords(choice) ? (
      <TermKey
        key={choice}
        label={t(`barline.${choice}`)}
        term={JUMP_WORDS[choice]}
        meaning={t(`jumpMeaning.${choice}`)}
        onClick={mark(choice)}
      />
    ) : (
      <CaptionKey key={choice} label={t(`barline.${choice}`)} onClick={mark(choice)}>
        {choice === 'coda' ? (
          <span className="size-7">
            <CodaSign />
          </span>
        ) : (
          <Printed text={JUMP_SIGNS.segno} music />
        )}
      </CaptionKey>
    )
  const words = JUMP_CHOICES.filter(isJumpWords)
  const signs = JUMP_CHOICES.filter((choice) => !isJumpWords(choice))
  return (
    <>
      <SignGrid label={t('barlines')}>
        {BARLINE_CHOICES.map((choice) => (
          <SignTile key={choice} label={t(`barline.${choice}`)} onClick={mark(choice)}>
            <BarlinePicture choice={choice} />
          </SignTile>
        ))}
      </SignGrid>
      <GroupName name={t('jumps')} />
      <div
        role="group"
        aria-label={t('jumps')}
        className={usePaletteForm() === 'row' ? 'contents' : 'flex flex-col gap-1.5'}
      >
        <CaptionGrid>{signs.map(key)}</CaptionGrid>
        <TermGrid>{words.map(key)}</TermGrid>
      </div>
    </>
  )
}

const PEDALS = [
  { pedal: 'down', glyph: '𝆮' },
  { pedal: 'change', glyph: '𝆯𝆮' },
  { pedal: 'up', glyph: '𝆯' },
] as const satisfies readonly { pedal: Pedal; glyph: string }[]

const PEDAL_LABEL = {
  down: 'marks.pedalDown',
  change: 'marks.pedalChange',
  up: 'marks.pedalUp',
} as const satisfies Readonly<Record<Pedal, string>>

/**
 * Text & pedal: the expression words alone as printed, what each asks its tooltip (ADR 0096); the
 * pedal's marks; the Lyrics key, opening the words' field under the caret's note (ADR 0093, 0096),
 * the one way in, with a pointer, to a song with no words printed yet to tap.
 */
export function TextKeys() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const chosen = useNotesChosen()
  const reason = usePaletteReason()
  return (
    <>
      <TermGrid label={t('expressions')}>
        {EXPRESSIONS.map((expression) => (
          <TermKey
            key={expression}
            label={t(`marks.${expression}`)}
            term={EXPRESSION_TEXT[expression]}
            meaning={t(`meaning.${expression}`)}
            reason={reason}
            disabled={!chosen}
            onClick={() =>
              actions.dispatch({ type: 'mark', mark: { kind: 'expression', expression } })
            }
          />
        ))}
      </TermGrid>
      <GroupName name={t('pedal')} />
      <CaptionGrid label={t('pedal')}>
        {PEDALS.map(({ pedal, glyph }) => (
          <CaptionKey
            key={pedal}
            label={t(PEDAL_LABEL[pedal])}
            reason={reason}
            disabled={!chosen}
            onClick={() => actions.dispatch({ type: 'mark', mark: { kind: 'pedal', pedal } })}
          >
            <Printed text={glyph} music />
          </CaptionKey>
        ))}
      </CaptionGrid>
      <CaptionGrid>
        <FieldKey field="lyrics" />
      </CaptionGrid>
    </>
  )
}
