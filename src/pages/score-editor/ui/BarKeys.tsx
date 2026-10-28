import { useTranslation } from 'react-i18next'
import { barAt, barLengths, meterAt } from '@/features/score-editor'
import { TICKS_PER_BEAT, timeSignature, timeSignatureText } from '@/shared/lib/music'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { BarIcon, type BarKeyEdit } from './palette-icons'
import { TimeFigures } from './sign-pictures'
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
 * Bar: what acts on the bars chosen, else the caret's: a bar added before or after,
 * the bars deleted, a line or a section begun there or the lines joined; their length (a pickup, or a
 * bar of another length, as the ⓘ beside its name says), each saying what it does.
 */
export function BarKeys() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  // The caret's section's meter, its own or the song's (ADR 0097).
  const meter = useEditorState((state) => meterAt(state.draft, state.caret))
  const barTicks = useEditorState((state) => barAt(state.draft, state.caret).bar.ticks)
  return (
    <>
      <KeyGrid>
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
      <GroupName name={t('bars.length')} info={t('bars.lengthInfo')} />
      <KeyGrid label={t('bars.length')}>
        {barLengths(meter).map((ticks) => {
          const time = timeSignature(ticks / TICKS_PER_BEAT, meter)
          return (
            <PaletteKey
              key={ticks}
              label={t('bars.lengthOf', { time: timeSignatureText(time) })}
              pressed={ticks === barTicks}
              onClick={() => actions.dispatch({ type: 'barLength', ticks })}
            >
              <TimeFigures meter={time} />
            </PaletteKey>
          )
        })}
      </KeyGrid>
    </>
  )
}
