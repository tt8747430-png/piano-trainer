import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { BARLINE_CHOICES, JUMP_CHOICES, type BarMarkChoice } from '@/features/score-editor'
import {
  EXPRESSION_GROUP_IDS,
  EXPRESSION_GROUPS,
  EXPRESSION_TEXT,
  type ExpressionGroup,
} from '@/shared/lib/music'
import { useScoreEditorContext } from '../model/editor-context'
import { isJumpWords, JUMP_SIGNS, JUMP_WORDS } from '../model/palette-categories'
import { isTool } from '../model/shortcuts'
import { useNotesChosen } from '../model/use-notes-chosen'
import { FieldKey } from './FieldKey'
import { CodaSign, FieldIcon } from './palette-icons'
import { TempoChangePopover } from './TempoPopover'
import { GroupName, KeyGrid, PaletteKey, Printed, SignTile, TermKey } from './palette-keys'
import { useClefAt } from '../model/use-clef-at'
import { ClefPicker } from './ClefPicker'
import { BarlinePicture } from './sign-pictures'

/** Text's expression groups: every one but the tempo words, which are Measure's (Flat's). */
const TEXT_GROUPS = EXPRESSION_GROUP_IDS.filter((group) => group !== 'tempo')

/**
 * Clef in the palette (ADR 0097, 0114), the one place a clef is chosen (R32-B, R32-C Flat's): the
 * caret's staff from the first bar chosen (a clef tapped on the score chooses its bar and staff), the
 * clef in force pressed. The chord row has no clef: there the category is not shown.
 */
export function ClefKeys() {
  const at = useClefAt()
  if (!at.staff) return null
  return <ClefPicker staff={at.staff} bar={at.bar} to={at.to} current={at.current} />
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

/** An expression's key: its words alone as printed, what it asks its tooltip (ADR 0096). */
function ExpressionKeys({ group }: { group: ExpressionGroup }) {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  return EXPRESSION_GROUPS[group].map((expression) => (
    <TermKey
      key={expression}
      label={t(`marks.${expression}`)}
      term={EXPRESSION_TEXT[expression]}
      meaning={t(`meaning.${expression}`)}
      onClick={() => actions.dispatch({ type: 'mark', mark: { kind: 'expression', expression } })}
    />
  ))
}

/**
 * Flat's Tempo tools in Measure (R32-C): Tempo, a tempo mark at the notes chosen set on its dial,
 * then the tempo words (accel., rit., a tempo…), each on the notes chosen; drawn while some are
 * (R32-B).
 */
export function TempoKeys() {
  const { t } = useTranslation('editor')
  if (!useNotesChosen()) return null
  return (
    <>
      <GroupName name={t('expressions.tempo')} />
      <KeyGrid label={t('expressions.tempo')}>
        <TempoChangePopover
          trigger={
            <PaletteKey label={t('tempo.change')}>
              <span aria-hidden className="size-7">
                <FieldIcon field="tempo" />
              </span>
            </PaletteKey>
          }
        />
        <ExpressionKeys group="tempo" />
      </KeyGrid>
    </>
  )
}

/**
 * Text (Flat's): the Lyrics and the chord symbols' keys, each opening its field where it prints
 * (ADR 0096), the Roman numeral and free text; then the character and technique words, as printed,
 * what each asks its tooltip, while notes are chosen (R32-B). The tempo words are Measure's (Flat's).
 */
export function TextKeys() {
  const { t } = useTranslation('editor')
  const chosen = useNotesChosen()
  return (
    <>
      <KeyGrid>
        <FieldKey field="lyrics" />
        <FieldKey field="chord" />
        {chosen ? <NumeralKey /> : null}
        <FieldKey field="text" />
      </KeyGrid>
      {chosen
        ? TEXT_GROUPS.map((group) => (
            <Fragment key={group}>
              <GroupName name={t(`expressions.${group}`)} />
              <KeyGrid label={t(`expressions.${group}`)}>
                <ExpressionKeys group={group} />
              </KeyGrid>
            </Fragment>
          ))
        : null}
    </>
  )
}
