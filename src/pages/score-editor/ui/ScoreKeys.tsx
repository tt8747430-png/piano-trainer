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
  type BarMarkChoice,
} from '@/features/score-editor'
import {
  CLEFS,
  EXPRESSION_TEXT,
  EXPRESSIONS,
  keyFromParam,
  keyParam,
  type Hand,
  type Pedal,
} from '@/shared/lib/music'
import { KeyChoice, Segmented } from '@/shared/ui'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { isJumpWords, JUMP_SIGNS, JUMP_WORDS } from '../model/palette-categories'
import { useFieldReason } from '../model/use-field-reason'
import { useNotesChosen } from '../model/use-notes-chosen'
import { FieldKey } from './FieldKey'
import { BarlineIcon, CodaSign } from './palette-icons'
import { CaptionGrid, CaptionKey, GroupName, Printed, TermGrid, TermKey } from './palette-keys'
import { usePaletteReason } from './palette-reason'

/** Each clef as the music font draws it. */
const CLEF_GLYPHS = { treble: '\u{1D11E}', bass: '\u{1D122}' } as const

/**
 * Clef (ADR 0069): a staff's clef from a bar on, Treble or Bass, the one it is in pressed; only the
 * piano's two staves change clef. In the palette the caret's staff from the first bar chosen (else
 * the caret's); over a clef printed on the sheet (ADR 0094), its staff from its bar (`at`).
 */
export function ClefKeys({ at }: { at?: { readonly hand: Hand; readonly bar: number } }) {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const caret = useEditorState((state) => (isHandLayer(state.layer) ? state.layer : null))
  const chosen = useEditorState((state) => chosenBars(state).from)
  const hand = at ? at.hand : caret
  const bar = at ? at.bar : chosen
  const current = useEditorState((state) => (hand ? clefAt(state.draft, bar, hand) : null))
  const reason = usePaletteReason()
  return (
    <>
      {hand ? (
        <p className="text-sm text-muted-foreground">
          {t('clef.from', { staff: t(`layers.${hand}`), bar: bar + 1 })}
        </p>
      ) : null}
      <CaptionGrid>
        {CLEFS.map((clef) => (
          <CaptionKey
            key={clef}
            label={t(`clef.${clef}`)}
            reason={reason}
            pressed={current === clef}
            disabled={!hand}
            onClick={() => hand && actions.dispatch({ type: 'clef', hand, clef, bar })}
          >
            <Printed text={CLEF_GLYPHS[clef]} music />
          </CaptionKey>
        ))}
      </CaptionGrid>
    </>
  )
}

/**
 * Key signature (ADR 0089, 0094): from a bar's section on, up to the next change, as Flat changes key
 * from a bar; in the song's first section its own key, the music moved with it. In the palette the
 * first bar chosen's (else the caret's); over a key signature printed on the sheet, its bar (`bar`).
 */
export function KeySignatureKeys({ bar }: { bar?: number }) {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const named = useSectionHeading()
  const chosen = useEditorState((state) => chosenBars(state).from)
  const from = bar ?? chosen
  const section = useEditorState((state) => barsOf(state.draft)[from]?.section ?? 0)
  const heading = useEditorState((state) => state.draft.sections[section]?.heading)
  // The section's first bar, as printed.
  const first = useEditorState(
    (state) => (barsOf(state.draft).find((placed) => placed.section === section)?.index ?? 0) + 1,
  )
  // The song's own key at its head; a later section's from there on.
  const song = section === 0
  const key = useEditorState((state) =>
    keyParam(song ? state.draft.key : sectionKey(state.draft, section)),
  )
  return (
    <>
      <h4 className="text-sm text-muted-foreground">
        {song
          ? t('signature.song')
          : t('signature.fromSection', {
              section: heading ? named({ ...heading, lines: [] }) : '',
              bar: first,
            })}
      </h4>
      <KeyChoice
        value={key}
        onChange={(next) =>
          actions.dispatch(
            song
              ? { type: 'settings', key: keyFromParam(next) }
              : { type: 'sectionKey', bar: from, key: keyFromParam(next) },
          )
        }
      />
    </>
  )
}

/**
 * Time signature (ADR 0094): the song's own, one for every bar, another of its kind; a change of time
 * inside the song is for later, as the ⓘ beside the section's name says (ADR 0096).
 */
export function TimeSignatureKeys() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const meter = useEditorState((state) => state.draft.meter)
  return (
    <Segmented
      label={t('song.meter')}
      value={meter}
      options={metersFor(meter).map((each) => ({ value: each, label: each }))}
      onChange={(next) => actions.dispatch({ type: 'settings', meter: next })}
    />
  )
}

/**
 * Barlines & repeats: the barlines and endings, then the signs and jumps, on the bars chosen, else the
 * caret's: a barline drawn on its staff and a sign as printed, each over its name; a jump's words
 * alone, what they ask its tooltip (ADR 0096).
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
        ) : choice === 'segno' ? (
          <Printed text={JUMP_SIGNS.segno} music />
        ) : (
          <BarlineIcon choice={choice} />
        )}
      </CaptionKey>
    )
  const words = JUMP_CHOICES.filter(isJumpWords)
  const signs = JUMP_CHOICES.filter((choice) => !isJumpWords(choice))
  return (
    <>
      <CaptionGrid label={t('barlines')}>{BARLINE_CHOICES.map(key)}</CaptionGrid>
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
