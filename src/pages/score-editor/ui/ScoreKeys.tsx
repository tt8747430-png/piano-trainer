import { useTranslation } from 'react-i18next'
import { useSectionHeading } from '@/entities/piece'
import {
  barsOf,
  BARLINE_CHOICES,
  chosenBars,
  clefAt,
  isHandLayer,
  JUMP_CHOICES,
  metersFor,
  sectionKey,
  sectionMeter,
  type BarMarkChoice,
  type NoteLayer,
} from '@/features/score-editor'
import { useShallow } from 'zustand/react/shallow'
import {
  beatGrouping,
  CLEFS,
  EXPRESSION_TEXT,
  EXPRESSIONS,
  keySignature,
  noteName,
  printedSymbol,
  signatureKey,
  SIGNATURE_COUNTS,
  writtenKey,
  type Key,
  type Pedal,
} from '@/shared/lib/music'
import { useLayerName } from '@/widgets/score-sheet'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { isJumpWords, JUMP_SIGNS, JUMP_WORDS } from '../model/palette-categories'
import { useFieldReason } from '../model/use-field-reason'
import { useNotesChosen } from '../model/use-notes-chosen'
import { useStaffHeads } from '../model/use-staff-heads'
import { FieldKey } from './FieldKey'
import { CodaSign } from './palette-icons'
import {
  CaptionGrid,
  CaptionKey,
  GroupName,
  Printed,
  SignGrid,
  SignTile,
  TermGrid,
  TermKey,
} from './palette-keys'
import { BarlinePicture, ClefPicture, KeyPicture, TimePicture } from './sign-pictures'
import { Segmented } from '@/shared/ui'
import { usePaletteReason } from './palette-reason'

/**
 * Clef (ADR 0069, 0097): a staff's clef, Treble or Bass, the one it is in pressed: one of the piano's
 * from a bar on, a single staff's whole. In the palette the caret's staff from the first bar chosen
 * (else the caret's); over a clef printed on the sheet (ADR 0094), its staff from its bar (`at`).
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
        <p className="text-sm text-muted-foreground">
          {isHandLayer(staff)
            ? t('clef.from', { staff: layerName(staff), bar: bar + 1 })
            : layerName(staff)}
        </p>
      ) : null}
      <SignGrid>
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

/**
 * Where a key or time signature changes from (ADR 0089, 0095), as Flat changes either from a bar: the
 * section of the bar given (its sign on the sheet), else of the first bar chosen (or the caret's), from
 * there on up to the next change; in the song's first section, the whole song. `said` names which,
 * over the choice.
 */
function useSignatureFrom(bar: number | undefined) {
  const { t } = useTranslation('editor')
  const named = useSectionHeading()
  const chosen = useEditorState((state) => chosenBars(state).from)
  const from = bar ?? chosen
  const section = useEditorState((state) => barsOf(state.draft)[from]?.section ?? 0)
  const heading = useEditorState((state) => state.draft.sections[section]?.heading)
  // The section's first bar, as printed.
  const first = useEditorState(
    (state) => (barsOf(state.draft).find((placed) => placed.section === section)?.index ?? 0) + 1,
  )
  const song = section === 0
  const said = song
    ? t('signature.song')
    : t('signature.fromSection', {
        section: heading ? named({ ...heading, lines: [] }) : '',
        bar: first,
      })
  return { from, section, song, said }
}

/** A key named as its signature writes it, its tonic printed (`E♭ major`). */
function useSignatureName(): (key: Key) => string {
  const { t } = useTranslation('music')
  return (key) =>
    t(key.minor ? 'key.minor' : 'key.major', { tonic: printedSymbol(noteName(key.tonic)) })
}

/**
 * Key signature (ADR 0089, 0094, 0110): its fifteen signatures as tiles, forScore's, each drawn after
 * a treble clef and named by its major key, its relative minor in small type; the one in force
 * pressed; over them Major · Minor, the same tonic's other mode, nothing moved. A tile chosen keeps the key's mode: a minor song goes to the signature's minor key. From a
 * bar's section on, up to the next change, as Flat changes key from a bar; in the song's first
 * section its own key, the music moved with it. In the palette the first bar chosen's (else the
 * caret's); over a key signature printed on the sheet, its bar (`bar`).
 */
export function KeySignatureKeys({ bar }: { bar?: number }) {
  const { t } = useTranslation('music')
  const { actions } = useScoreEditorContext()
  const { from, section, song, said } = useSignatureFrom(bar)
  const named = useSignatureName()
  // The song's own key at its head; a later section's from there on.
  const key = useEditorState(
    useShallow((state) => (song ? state.draft.key : sectionKey(state.draft, section))),
  )
  const count = keySignature(key)
  const choose = (next: Key) =>
    actions.dispatch(
      song ? { type: 'settings', key: next } : { type: 'sectionKey', bar: from, key: next },
    )
  return (
    <>
      <h4 className="text-sm text-muted-foreground">{said}</h4>
      {/* Major or minor on the same tonic, nothing moved: C major to C minor. */}
      <Segmented
        label={t('key.mode')}
        value={key.minor ? 'minor' : 'major'}
        options={(['major', 'minor'] as const).map((mode) => ({
          value: mode,
          label: t(`key.${mode}Mode`),
        }))}
        onChange={(mode) => choose(writtenKey({ tonic: key.tonic, minor: mode === 'minor' }))}
      />
      <SignGrid label={t('key.label')}>
        {SIGNATURE_COUNTS.map((each) => {
          const major = signatureKey(each, false)
          const minor = signatureKey(each, true)
          return (
            <SignTile
              key={each}
              label={named(major)}
              detail={named(minor)}
              pressed={each === count}
              onClick={() => (each === count ? undefined : choose(key.minor ? minor : major))}
            >
              <KeyPicture signatureOf={major} />
            </SignTile>
          )
        })}
      </SignGrid>
    </>
  )
}

/**
 * Time signature (ADR 0094, 0095, 0110): the meters of the song's kind as tiles, forScore's, each
 * drawn on a staff over its eighths by beat in small type (3/4's 2, 2, 2), the one in force pressed, from a bar's section on up to the
 * next change, as Flat changes time from a measure; in the song's first section the whole song's, every
 * bar counted in it. In the palette the first bar chosen's (else the caret's); over a time signature
 * printed on the sheet, its bar (`bar`).
 */
export function TimeSignatureKeys({ bar }: { bar?: number }) {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const { from, section, song, said } = useSignatureFrom(bar)
  const kind = useEditorState((state) => state.draft.meter)
  const meter = useEditorState((state) => sectionMeter(state.draft, section))
  return (
    <>
      <h4 className="text-sm text-muted-foreground">{said}</h4>
      <SignGrid label={t('song.meter')}>
        {metersFor(kind).map((each) => (
          <SignTile
            key={each}
            label={each}
            // The sign says its meter: under it, its eighths by beat, in small type.
            name={null}
            detail={beatGrouping(each).join(', ')}
            pressed={each === meter}
            onClick={() =>
              each === meter
                ? undefined
                : actions.dispatch(
                    song
                      ? { type: 'settings', meter: each }
                      : { type: 'sectionMeter', bar: from, meter: each },
                  )
            }
          >
            <TimePicture meter={each} />
          </SignTile>
        ))}
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
      <div role="group" aria-label={t('jumps')} className="flex flex-col gap-1.5">
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
 * pedal's marks.
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
    </>
  )
}

/**
 * The chord symbols and the words, typed where they print (ADR 0096): one key each, opening its field
 * at the caret (the chord symbol's over the staff at its beat, the Lyrics field under its note);
 * greyed where it cannot open, its tooltip and the ⓘ beside the group's name saying why.
 */
export function ChordAndLyricsKeys() {
  const { t } = useTranslation('editor')
  const reasons = [useFieldReason('chord'), useFieldReason('lyrics')].filter(
    (why) => why !== undefined,
  )
  const name = t('chordsAndLyrics')
  return (
    <>
      <GroupName
        name={name}
        info={reasons.length > 0 ? reasons.map((why) => <p key={why}>{why}</p>) : undefined}
      />
      <CaptionGrid label={name}>
        <FieldKey field="chord" />
        <FieldKey field="lyrics" />
      </CaptionGrid>
    </>
  )
}
