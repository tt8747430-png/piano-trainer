import { WholeWord } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSectionHeading } from '@/entities/piece'
import {
  barAt,
  barsOf,
  BARLINE_CHOICES,
  clefAt,
  isHandLayer,
  JUMP_CHOICES,
  metersFor,
  sectionKey,
  selectedBars,
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
 * Clef (ADR 0069): the caret's staff, from the first bar chosen (else the caret's) on, Treble or
 * Bass, the one it is in pressed. Only the piano's two staves change clef.
 */
export function ClefKeys() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const layer = useEditorState((state) => state.layer)
  const bar = useEditorState((state) =>
    state.selection
      ? selectedBars(state.draft, state.selection).from
      : barAt(state.draft, state.caret).index,
  )
  const current = useEditorState((state) =>
    isHandLayer(state.layer) ? clefAt(state.draft, bar, state.layer) : null,
  )
  return (
    <>
      {isHandLayer(layer) ? (
        <p className="text-sm text-muted-foreground">
          {t('clef.from', { staff: t(`layers.${layer}`), bar: bar + 1 })}
        </p>
      ) : null}
      <CaptionGrid>
        {CLEFS.map((clef) => (
          <CaptionKey
            key={clef}
            label={t(`clef.${clef}`)}
            pressed={current === clef}
            disabled={!isHandLayer(layer)}
            onClick={() =>
              isHandLayer(layer) && actions.dispatch({ type: 'clef', hand: layer, clef })
            }
          >
            <Printed text={CLEF_GLYPHS[clef]} music />
          </CaptionKey>
        ))}
      </CaptionGrid>
    </>
  )
}

/** The song's own key, changed for the whole song: its music moves with it (ADR 0094: no Song sheet). */
function SongKey() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const key = useEditorState((state) => state.draft.key)
  return (
    <div role="group" aria-label={t('signature.song')}>
      <KeyChoice
        value={keyParam(key)}
        onChange={(next) => actions.dispatch({ type: 'settings', key: keyFromParam(next) })}
      />
    </div>
  )
}

/**
 * Key signature (ADR 0089): a key change from the section of the first bar chosen (else the caret's)
 * on, up to the next change, as Flat changes key from a bar; then the song's own key, changed for the
 * whole song (`SongKey`).
 */
export function KeySignatureKeys() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const named = useSectionHeading()
  const at = useEditorState((state) => {
    const from = state.selection
      ? selectedBars(state.draft, state.selection).from
      : barAt(state.draft, state.caret).index
    const placed = barsOf(state.draft)[from]
    return placed ? placed.section : 0
  })
  const heading = useEditorState((state) => state.draft.sections[at]?.heading)
  // The section's first bar, as printed.
  const first = useEditorState(
    (state) => (barsOf(state.draft).find((placed) => placed.section === at)?.index ?? 0) + 1,
  )
  const key = useEditorState((state) => keyParam(sectionKey(state.draft, at)))
  return (
    <>
      <h4 className="text-sm text-muted-foreground">
        {t('signature.fromSection', {
          section: heading ? named({ ...heading, lines: [] }) : '',
          bar: first,
        })}
      </h4>
      <KeyChoice
        value={key}
        onChange={(next) => actions.dispatch({ type: 'sectionKey', key: keyFromParam(next) })}
      />
      <h4 className="pt-1 text-sm text-muted-foreground">{t('signature.song')}</h4>
      <SongKey />
    </>
  )
}

/**
 * Time signature: the song's own, one for every bar, another of its kind (each bar made the new
 * one); a change of time inside the song is for later.
 */
export function TimeSignatureKeys() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const meter = useEditorState((state) => state.draft.meter)
  return (
    <>
      <Segmented
        label={t('song.meter')}
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
