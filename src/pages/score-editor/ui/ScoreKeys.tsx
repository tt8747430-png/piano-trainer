import { useTranslation } from 'react-i18next'
import {
  BARLINE_CHOICES,
  JUMP_CHOICES,
  sectionMeter,
  type BarMarkChoice,
} from '@/features/score-editor'
import { EXPRESSION_TEXT, EXPRESSIONS, meterSymbol, type Pedal } from '@/shared/lib/music'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { isJumpWords, JUMP_SIGNS, JUMP_WORDS } from '../model/palette-categories'
import { useNotesChosen } from '../model/use-notes-chosen'
import { useSignatureFrom } from '../model/use-signature-from'
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
import { useClefAt, useClefSaid } from '../model/use-clef-at'
import { ClefPicker } from './ClefPicker'
import { useKeyAt, useKeyNames } from '../model/use-key-at'
import { KeyPicker } from './KeyPicker'
import { BarlinePicture, ClefPicture, KeyPicture, TimePicture } from './sign-pictures'
import { SignPicker } from './SignPicker'
import { TimePicker } from './TimePicker'

/**
 * Clef in the palette (ADR 0069, 0097, 0114): the caret's staff from the first bar chosen (else the
 * caret's). Opened, its picker in its section under what it changes; in the folded row, the clef in
 * force drawn, opening the same picker over it; greyed, saying why, where the caret writes chords.
 */
export function ClefKeys() {
  const at = useClefAt()
  const { title, said } = useClefSaid(at)
  const reason = usePaletteReason()
  const { t } = useTranslation('editor')
  if (usePaletteForm() === 'sections')
    return at.staff ? (
      <>
        <SectionLine>{said}</SectionLine>
        <ClefPicker staff={at.staff} bar={at.bar} current={at.current} />
      </>
    ) : (
      <SectionLine>{reason}</SectionLine>
    )
  const tile = (
    <SignTile
      label={t('signature.change', { sign: title, now: at.current ? t(`clef.${at.current}`) : '' })}
      reason={reason}
      disabled={!at.staff}
    >
      <ClefPicture clef={at.current ?? 'treble'} />
    </SignTile>
  )
  if (!at.staff) return tile
  return (
    <SignPicker title={title} description={said} wide trigger={tile}>
      <ClefPicker staff={at.staff} bar={at.bar} current={at.current} />
    </SignPicker>
  )
}

/**
 * Key signature in the palette (ADR 0114): opened, its picker in its section under what it changes;
 * in the folded row, the key in force drawn, opening the same picker over it.
 */
export function KeySignatureKeys() {
  const { t } = useTranslation('editor')
  const names = useKeyNames()
  const key = useKeyAt(undefined)
  const { said } = useSignatureFrom(undefined)
  const title = t('palette.category.key')
  if (usePaletteForm() === 'sections')
    return (
      <>
        <SectionLine>{said}</SectionLine>
        <KeyPicker />
      </>
    )
  return (
    <SignPicker
      title={title}
      description={said}
      wide
      trigger={
        <SignTile label={t('signature.change', { sign: title, now: names.full(key) })}>
          <KeyPicture signatureOf={key} />
        </SignTile>
      }
    >
      <KeyPicker />
    </SignPicker>
  )
}

/**
 * Time signature in the palette (ADR 0114): the meter in force drawn, from the first bar chosen's
 * section (else the caret's), opening its picker over it, where the wheels slide and ✓ changes it;
 * opened, under what it changes.
 */
export function TimeSignatureKeys() {
  const { t } = useTranslation('editor')
  const { section, said } = useSignatureFrom(undefined)
  const meter = useEditorState((state) => sectionMeter(state.draft, section))
  const symbol = useEditorState((state) =>
    state.draft.timeSymbol === true ? meterSymbol(meter) : null,
  )
  const title = t('palette.category.time')
  return (
    <>
      <SectionLine>{said}</SectionLine>
      <SignGrid>
        <SignPicker
          title={title}
          description={said}
          trigger={
            <SignTile label={t('signature.change', { sign: title, now: meter })} name={meter}>
              <TimePicture meter={meter} symbol={symbol} />
            </SignTile>
          }
        >
          {(close) => <TimePicker onDone={close} />}
        </SignPicker>
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
