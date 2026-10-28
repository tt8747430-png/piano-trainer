import { useTranslation } from 'react-i18next'
import {
  BARLINE_CHOICES,
  JUMP_CHOICES,
  meterBar,
  sectionMeter,
  type BarMarkChoice,
} from '@/features/score-editor'
import { EXPRESSION_TEXT, EXPRESSIONS, meterSymbol, type Meter } from '@/shared/lib/music'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { isJumpWords, JUMP_SIGNS, JUMP_WORDS } from '../model/palette-categories'
import { isTool } from '../model/shortcuts'
import { useNotesChosen } from '../model/use-notes-chosen'
import { useSignatureFrom } from '../model/use-signature-from'
import { FieldKey } from './FieldKey'
import { CodaSign } from './palette-icons'
import {
  GroupName,
  KeyGrid,
  PaletteKey,
  Printed,
  SectionLine,
  SignTile,
  TermKey,
} from './palette-keys'
import { usePaletteReason } from './palette-reason'
import { useClefAt, useClefSaid } from '../model/use-clef-at'
import { ClefPicker } from './ClefPicker'
import { KeyPicker } from './KeyPicker'
import { BarlinePicture, TimePicture } from './sign-pictures'
import { SignPicker } from './SignPicker'
import { TimePicker } from './TimePicker'

/**
 * Clef in the palette (ADR 0097, 0114): the caret's staff from the first bar chosen (else the
 * caret's), its picker's 17 clefs under what it changes, the clef in force pressed; where the caret
 * writes chords, why there is none.
 */
export function ClefKeys() {
  const at = useClefAt()
  const { said } = useClefSaid(at)
  const reason = usePaletteReason()
  return at.staff ? (
    <>
      <SectionLine>{said}</SectionLine>
      <ClefPicker staff={at.staff} bar={at.bar} current={at.current} />
    </>
  ) : (
    <SectionLine>{reason}</SectionLine>
  )
}

/** Key signature in the palette (ADR 0114): its picker under what it changes, Flat's 7♯ over 7♭. */
export function KeySignatureKeys() {
  const { said } = useSignatureFrom(undefined)
  return (
    <>
      <SectionLine>{said}</SectionLine>
      <KeyPicker />
    </>
  )
}

/** Flat's time signature tiles: the common meters, with C and ¢ as printed. */
const QUICK_TIMES = [
  { meter: '2/4', symbol: false },
  { meter: '3/4', symbol: false },
  { meter: '4/4', symbol: false },
  { meter: '4/4', symbol: true },
  { meter: '2/2', symbol: true },
  { meter: '6/8', symbol: false },
] as const satisfies readonly { meter: Meter; symbol: boolean }[]

/**
 * Time signature in the palette (ADR 0114, Flat's): from the first bar chosen's section (else the
 * caret's), the common meters as tiles, C and ¢ among them, the one in force pressed, a tap changing
 * it; then Another, opening the picker over it, where the wheels slide and ✓ changes it. A meter the
 * bars after cannot be counted in is greyed.
 */
export function TimeSignatureKeys() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const { from, section, said } = useSignatureFrom(undefined)
  const draft = useEditorState((state) => state.draft)
  const meter = sectionMeter(draft, section)
  const symbol = draft.timeSymbol === true ? meterSymbol(meter) : null
  const title = t('palette.category.time')
  return (
    <>
      <SectionLine>{said}</SectionLine>
      <KeyGrid label={title}>
        {QUICK_TIMES.map((quick) => {
          const sign = quick.symbol ? meterSymbol(quick.meter) : null
          const name = sign ? t(`time.symbolName.${sign}`) : quick.meter
          return (
            <SignTile
              key={name}
              label={t('time.set', { time: name })}
              name={name}
              pressed={meter === quick.meter && symbol === sign}
              disabled={meter !== quick.meter && meterBar(draft, section, quick.meter) !== null}
              onClick={() =>
                actions.dispatch({
                  type: 'time',
                  bar: from,
                  time: {
                    meter: quick.meter,
                    ...(meterSymbol(quick.meter) ? { timeSymbol: quick.symbol } : {}),
                  },
                })
              }
            >
              <TimePicture meter={quick.meter} symbol={sign} />
            </SignTile>
          )
        })}
        <SignPicker
          title={title}
          description={said}
          trigger={
            <SignTile label={t('time.other')} name={t('time.other')}>
              <TimePicture meter={meter} symbol={symbol} />
            </SignTile>
          }
        >
          {(close) => <TimePicker onDone={close} />}
        </SignPicker>
      </KeyGrid>
    </>
  )
}

/**
 * Barlines & repeats (Flat's): the barlines and endings as tiles (ADR 0115), each drawn on its staff,
 * then the signs and jumps, on the bars chosen, else the caret's: a sign as printed; a jump's words
 * alone, what they ask its tooltip (ADR 0096). Start and end repeat by Flat's [ and ].
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
      <PaletteKey key={choice} label={t(`barline.${choice}`)} onClick={mark(choice)}>
        {choice === 'coda' ? (
          <span aria-hidden className="size-7">
            <CodaSign />
          </span>
        ) : (
          <Printed text={JUMP_SIGNS.segno} music />
        )}
      </PaletteKey>
    )
  const words = JUMP_CHOICES.filter(isJumpWords)
  const signs = JUMP_CHOICES.filter((choice) => !isJumpWords(choice))
  return (
    <>
      <KeyGrid label={t('barlines')}>
        {BARLINE_CHOICES.map((choice) => (
          <SignTile
            key={choice}
            label={t(`barline.${choice}`)}
            tool={isTool(choice) ? choice : undefined}
            onClick={mark(choice)}
          >
            <BarlinePicture choice={choice} />
          </SignTile>
        ))}
      </KeyGrid>
      <GroupName name={t('jumps')} />
      <KeyGrid label={t('jumps')}>
        {signs.map(key)}
        {words.map(key)}
      </KeyGrid>
    </>
  )
}

/**
 * Text (Flat's): the Lyrics and the chord symbols' keys, each opening its field where it prints
 * (ADR 0096) — with a pointer the one way in to a song with no words or chords printed yet to tap —
 * then the expression words alone as printed, what each asks its tooltip.
 */
export function TextKeys() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const chosen = useNotesChosen()
  const reason = usePaletteReason()
  return (
    <>
      <KeyGrid>
        <FieldKey field="lyrics" />
        <FieldKey field="chord" />
      </KeyGrid>
      <GroupName name={t('expressions')} />
      <KeyGrid label={t('expressions')}>
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
      </KeyGrid>
    </>
  )
}
