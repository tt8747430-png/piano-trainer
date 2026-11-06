import { useTranslation } from 'react-i18next'
import { REPEAT_BAR_CHOICES, type BarMarkChoice } from '@/features/score-editor'
import { useScoreEditorContext } from '../model/editor-context'
import { BarIcon, type BarKeyEdit } from './palette-icons'
import type { Tool } from '../model/shortcuts'
import { GroupName, KeyGrid, PaletteKey } from './palette-keys'

/** What the Bar section does to the bars chosen, else the caret's, in order. */
const BAR_KEYS: readonly BarKeyEdit[] = [
  'insertBefore',
  'insert',
  'delete',
  'newLine',
  'joinLine',
  'newSection',
]

/** The bar edits' shortcuts, Flat's. */
const BAR_TOOLS: Readonly<Partial<Record<BarKeyEdit, Tool>>> = {
  insert: 'barAfter',
  delete: 'barDelete',
  newLine: 'newLine',
}

/**
 * Measures (R31-E, Flat's): what acts on the bars chosen, else the caret's: a bar added before or
 * after, the bars deleted, a line or a section (its rehearsal mark) begun there or the lines joined,
 * a page begun there; then the multi-bar rests and the bar repeats. A bar's length is its time
 * signature's: no key changes it here.
 */
export function BarKeys() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  return (
    <>
      <KeyGrid label={t('palette.groups.bars')}>
        {BAR_KEYS.map((edit) => (
          <PaletteKey
            key={edit}
            label={t(`bars.${edit}`)}
            tool={BAR_TOOLS[edit]}
            onClick={() => actions.dispatch({ type: 'bars', edit })}
          >
            <span aria-hidden className="size-7">
              <BarIcon edit={edit} />
            </span>
          </PaletteKey>
        ))}
        {/* Flat's page break: the line from the bar chosen starts a new page (ADR 0097). */}
        <PaletteKey
          label={t('barline.pageBreak')}
          onClick={() => actions.dispatch({ type: 'barMarks', choice: 'pageBreak' })}
        >
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-6"
          >
            <path d="M6 3h8l4 4v14H6z M14 3v4h4" />
            <path d="M15 11v4h-6 M11 13l-2 2 2 2" />
          </svg>
        </PaletteKey>
      </KeyGrid>
      <GroupName name={t('bars.repeats')} info={t('bars.repeatsInfo')} />
      <KeyGrid label={t('bars.repeats')}>
        {REPEAT_BAR_CHOICES.map((choice) => (
          <PaletteKey
            key={choice}
            label={t(`barline.${choice}`)}
            onClick={() => actions.dispatch({ type: 'barMarks', choice })}
          >
            <RepeatBarSign choice={choice} />
          </PaletteKey>
        ))}
      </KeyGrid>
    </>
  )
}

/** The signs a score draws: a bar repeat's slash between dots (one, or two for two bars), a multi-bar rest's bar. */
function RepeatBarSign({ choice }: { choice: BarMarkChoice }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className="size-6">
      {choice === 'multiRest' ? (
        <>
          <rect x="5" y="10.5" width="14" height="4" />
          <rect x="4" y="7.5" width="1.5" height="10" />
          <rect x="18.5" y="7.5" width="1.5" height="10" />
        </>
      ) : (
        <>
          <path
            d={
              choice === 'barRepeat1'
                ? 'M6 18l10-12h2L8 18z'
                : 'M3 18l10-12h2L5 18z M8 18l10-12h2L10 18z'
            }
          />
          <circle cx={choice === 'barRepeat1' ? 7.5 : 5} cy="8" r="1.6" />
          <circle cx={choice === 'barRepeat1' ? 16.5 : 19} cy="16" r="1.6" />
        </>
      )}
    </svg>
  )
}
