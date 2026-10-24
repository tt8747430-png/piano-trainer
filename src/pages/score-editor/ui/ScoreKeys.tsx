import { WholeWord } from 'lucide-react'
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
  singsHere,
  verseCount,
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
import { useNotesChosen } from '../model/use-notes-chosen'
import { LyricsField } from './LyricsField'
import { BarlineIcon, CodaSign } from './palette-icons'
import { CaptionGrid, CaptionKey, Printed } from './palette-keys'

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
 * inside the song is for later.
 */
export function TimeSignatureKeys() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const meter = useEditorState((state) => state.draft.meter)
  return (
    <>
      <Segmented
        label={t('palette.category.time')}
        value={meter}
        options={metersFor(meter).map((each) => ({ value: each, label: each }))}
        onChange={(next) => actions.dispatch({ type: 'settings', meter: next })}
      />
      <p className="text-sm text-pretty text-muted-foreground">{t('signature.timeLater')}</p>
    </>
  )
}

/**
 * Barlines & repeats: the barlines and endings, then the signs and jumps, on the bars chosen, else the
 * caret's: a barline drawn on its staff, a sign as printed, a jump's words with what they ask under
 * them.
 */
export function RepeatKeys() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const key = (choice: BarMarkChoice) => (
    <CaptionKey
      key={choice}
      label={t(`barline.${choice}`)}
      caption={isJumpWords(choice) ? t(`jumpMeaning.${choice}`) : undefined}
      onClick={() => actions.dispatch({ type: 'barMarks', choice })}
    >
      {isJumpWords(choice) ? (
        <Printed text={JUMP_WORDS[choice]} />
      ) : choice === 'coda' ? (
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
  return (
    <>
      <CaptionGrid label={t('barlines')}>{BARLINE_CHOICES.map(key)}</CaptionGrid>
      <h4 className="pt-1 text-sm text-muted-foreground">{t('jumps')}</h4>
      <CaptionGrid label={t('jumps')}>{JUMP_CHOICES.map(key)}</CaptionGrid>
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

/** Text & pedal: the expression words as printed, what each asks under it, and the pedal's marks. */
export function TextKeys() {
  const { t } = useTranslation('editor')
  const { actions, view } = useScoreEditorContext()
  const chosen = useNotesChosen()
  // The words go under the tune's staff alone (ADR 0093); the verse open is clamped to one past the last.
  const sings = useEditorState((state) => singsHere(state.draft, state.layer))
  const count = useEditorState((state) => verseCount(state.draft))
  const caret = useEditorState((state) => state.caret)
  const verse = view.lyricsVerse === null ? null : Math.min(view.lyricsVerse, count)
  return (
    <>
      <CaptionGrid label={t('expressions')}>
        {EXPRESSIONS.map((expression) => (
          <CaptionKey
            key={expression}
            label={t(`marks.${expression}`)}
            caption={t(`meaning.${expression}`)}
            disabled={!chosen}
            onClick={() =>
              actions.dispatch({ type: 'mark', mark: { kind: 'expression', expression } })
            }
          >
            <Printed text={EXPRESSION_TEXT[expression]} />
          </CaptionKey>
        ))}
      </CaptionGrid>
      <h4 className="pt-1 text-sm text-muted-foreground">{t('pedal')}</h4>
      <CaptionGrid label={t('pedal')}>
        {PEDALS.map(({ pedal, glyph }) => (
          <CaptionKey
            key={pedal}
            label={t(PEDAL_LABEL[pedal])}
            disabled={!chosen}
            onClick={() => actions.dispatch({ type: 'mark', mark: { kind: 'pedal', pedal } })}
          >
            <Printed text={glyph} music />
          </CaptionKey>
        ))}
      </CaptionGrid>
      <h4 className="pt-1 text-sm text-muted-foreground">{t('lyrics.label')}</h4>
      {sings ? null : (
        <p className="text-sm text-pretty text-muted-foreground">{t('reason.lyrics')}</p>
      )}
      <CaptionGrid label={t('lyrics.label')}>
        <CaptionKey
          label={t('lyrics.label')}
          pressed={verse !== null}
          disabled={!sings}
          onClick={() => view.openLyrics(verse === null ? 0 : null)}
        >
          <WholeWord />
        </CaptionKey>
      </CaptionGrid>
      {sings && verse !== null ? <LyricsField key={`${caret} ${verse}`} verse={verse} /> : null}
    </>
  )
}
