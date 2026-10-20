import {
  ClipboardPaste,
  Copy,
  Heading,
  Merge,
  Minus,
  Plus,
  Scissors,
  WrapText,
  type LucideIcon,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { barAt, barLengths, type BarEdit } from '@/features/score-editor'
import { TICKS_PER_BEAT, timeSignature, timeSignatureText } from '@/shared/lib/music'
import { Dropdown, ToolKey } from '@/shared/ui'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'

/** Each edit of the bars, by its picture. */
const EDITS: readonly (readonly [BarEdit, LucideIcon])[] = [
  ['insert', Plus],
  ['delete', Minus],
  ['copy', Copy],
  ['cut', Scissors],
  ['paste', ClipboardPaste],
  ['newLine', WrapText],
  ['joinLine', Merge],
  ['newSection', Heading],
]

/** The Bars tab: add, delete, copy, cut and paste bars, lines and sections, and the caret's bar's length. */
export function BarKeys() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const meter = useEditorState((state) => state.draft.meter)
  const ticks = useEditorState((state) => barAt(state.draft, state.caret).bar.ticks)
  const hasClip = useEditorState((state) => state.clip !== null)
  return (
    <>
      {EDITS.map(([edit, Icon]) => (
        <ToolKey
          key={edit}
          label={t(`bars.${edit}`)}
          disabled={edit === 'paste' && !hasClip}
          onClick={() => actions.dispatch({ type: 'bars', edit })}
        >
          <Icon aria-hidden />
        </ToolKey>
      ))}
      <div className="col-span-full">
        <Dropdown<number>
          label={t('bars.length')}
          value={ticks}
          options={barLengths(meter).map((length) => ({
            value: length,
            label: timeSignatureText(timeSignature(length / TICKS_PER_BEAT, meter)),
          }))}
          onChange={(length) => actions.dispatch({ type: 'barLength', ticks: length })}
        />
      </div>
    </>
  )
}
