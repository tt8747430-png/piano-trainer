import { useTranslation } from 'react-i18next'
import {
  barAt,
  BARLINE_CHOICES,
  clefAt,
  isHandLayer,
  JUMP_CHOICES,
  selectedBars,
  type BarMarkChoice,
} from '@/features/score-editor'
import { useKeyName } from '@/shared/i18n'
import {
  CLEFS,
  EXPRESSION_TEXT,
  EXPRESSIONS,
  beatsPerBar,
  timeSignature,
  type Pedal,
} from '@/shared/lib/music'
import { Button } from '@/shared/ui/primitives/button'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { isJumpWords, JUMP_SIGNS, JUMP_WORDS } from '../model/palette-categories'
import { Figures } from './BarKeys'
import { useNotesChosen } from '../model/use-notes-chosen'
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
          {t('clef.from', { hand: t(`layers.${layer}`), bar: bar + 1 })}
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

/**
 * Key or Time: the song's own, one for every bar (the draft holds no change of key or time inside the
 * song), named as it is with a way to the Song sheet, where it is changed.
 */
export function SongSignature({ kind }: { kind: 'key' | 'time' }) {
  const { t } = useTranslation('editor')
  const { view } = useScoreEditorContext()
  const keyName = useKeyName()
  const key = useEditorState((state) => state.draft.key)
  const meter = useEditorState((state) => state.draft.meter)
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="flex min-w-0 items-center gap-2">
        {kind === 'time' ? <Figures time={timeSignature(beatsPerBar(meter), meter)} /> : null}
        <span className="text-base font-semibold">{kind === 'key' ? keyName(key) : meter}</span>
      </span>
      <Button variant="soft" onClick={() => view.openSettings(true)}>
        {t('signature.change')}
      </Button>
    </div>
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
  const { actions } = useScoreEditorContext()
  const chosen = useNotesChosen()
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
    </>
  )
}
