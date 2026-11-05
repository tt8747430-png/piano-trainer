import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { BARLINE_CHOICES, JUMP_CHOICES, type BarMarkChoice } from '@/features/score-editor'
import { EXPRESSION_GROUP_IDS, EXPRESSION_GROUPS, EXPRESSION_TEXT } from '@/shared/lib/music'
import { useScoreEditorContext } from '../model/editor-context'
import { isJumpWords, JUMP_SIGNS, JUMP_WORDS } from '../model/palette-categories'
import { isTool } from '../model/shortcuts'
import { useNotesChosen } from '../model/use-notes-chosen'
import { useSignatureFrom } from '../model/use-signature-from'
import { FieldKey } from './FieldKey'
import { CodaSign, FieldIcon } from './palette-icons'
import { TempoChangePopover } from './TempoPopover'
import {
  GroupName,
  KeyGrid,
  PaletteKey,
  Printed,
  SectionLine,
  SignTile,
  TermKey,
} from './palette-keys'
import { useClefAt, useClefSaid } from '../model/use-clef-at'
import { ClefPicker } from './ClefPicker'
import { KeyPicker } from './KeyPicker'
import { BarlinePicture } from './sign-pictures'
import { TimePicker } from './TimePicker'

/**
 * Clef in the palette (ADR 0097, 0114), the one place a clef is chosen (R32-B): the caret's staff
 * from the first bar chosen (else the caret's; a clef tapped on the score chooses its bar and staff),
 * its picker's 17 clefs under what it changes, the clef in force pressed. The chord row has no clef:
 * there the category is not in the strip.
 */
export function ClefKeys() {
  const at = useClefAt()
  const said = useClefSaid(at)
  if (!at.staff) return null
  return (
    <>
      <SectionLine>{said}</SectionLine>
      <ClefPicker staff={at.staff} bar={at.bar} current={at.current} />
    </>
  )
}

/**
 * Key signature in the palette (ADR 0114), the one place a key is chosen (R32-B): its picker under
 * what it changes, Flat's 7♯ over 7♭.
 */
export function KeySignatureKeys() {
  const { said } = useSignatureFrom()
  return (
    <>
      <SectionLine>{said}</SectionLine>
      <KeyPicker />
    </>
  )
}

/**
 * Time signature in the palette (A34, Flat's), the one place a meter is chosen (R32-B): from the first
 * bar chosen's section (else the caret's), the one time signature control.
 */
export function TimeSignatureKeys() {
  const { said } = useSignatureFrom()
  return (
    <>
      <SectionLine>{said}</SectionLine>
      <TimePicker />
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
/**
 * The Roman numeral key (ADR 0097, Flat's ⌘⇧K): the numeral of the chord sounding at the notes
 * chosen, in the key there (the numerals kernel's), under them; again, taken off. Drawn while notes
 * are chosen (R32-B).
 */
function NumeralKey() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  return (
    <PaletteKey
      label={t('words.numeral')}
      tool="numeral"
      onClick={() => actions.dispatch({ type: 'numeral' })}
    >
      <span aria-hidden className="font-serif text-lg font-semibold leading-none">
        IV<sup className="text-[0.6em]">6</sup>
      </span>
    </PaletteKey>
  )
}

/** Flat's Tempo change in Text (A34): a tempo mark at the notes chosen, set in its popover. */
function TempoChangeKey() {
  const { t } = useTranslation('editor')
  return (
    <TempoChangePopover
      trigger={
        <PaletteKey label={t('tempo.change')}>
          <span aria-hidden className="size-7">
            <FieldIcon field="tempo" />
          </span>
        </PaletteKey>
      }
    />
  )
}

export function TextKeys() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const chosen = useNotesChosen()
  return (
    <>
      <KeyGrid>
        <FieldKey field="lyrics" />
        <FieldKey field="chord" />
        {chosen ? <NumeralKey /> : null}
        <FieldKey field="text" />
        {chosen ? <TempoChangeKey /> : null}
      </KeyGrid>
      {/* The expression words act on the notes chosen: drawn while some are (R32-B). */}
      {(chosen ? EXPRESSION_GROUP_IDS : []).map((group) => (
        <Fragment key={group}>
          <GroupName name={t(`expressions.${group}`)} />
          <KeyGrid label={t(`expressions.${group}`)}>
            {EXPRESSION_GROUPS[group].map((expression) => (
              <TermKey
                key={expression}
                label={t(`marks.${expression}`)}
                term={EXPRESSION_TEXT[expression]}
                meaning={t(`meaning.${expression}`)}
                onClick={() =>
                  actions.dispatch({ type: 'mark', mark: { kind: 'expression', expression } })
                }
              />
            ))}
          </KeyGrid>
        </Fragment>
      ))}
    </>
  )
}
