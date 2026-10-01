import { ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { barAt, barLengths, type BarEdit } from '@/features/score-editor'
import { TICKS_PER_BEAT, timeSignature, timeSignatureText } from '@/shared/lib/music'
import { Dropdown } from '@/shared/ui'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { ActionMenu } from './ActionMenu'

const EDITS: readonly BarEdit[] = [
  'insert',
  'delete',
  'copy',
  'cut',
  'paste',
  'newLine',
  'joinLine',
  'newSection',
]

/** The bars' pull-down: add, delete, copy, cut and paste bars, lines and sections, and a bar's length. */
export function BarMenu() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const meter = useEditorState((state) => state.draft.meter)
  const ticks = useEditorState((state) => barAt(state.draft, state.caret).bar.ticks)
  const hasClip = useEditorState((state) => state.clip !== null)
  return (
    <ActionMenu
      label={t('bars.label')}
      trigger={
        <>
          {t('bars.label')}
          <ChevronDown data-icon="inline-end" />
        </>
      }
      actions={EDITS.map((edit) => ({
        key: edit,
        label: t(`bars.${edit}`),
        disabled: edit === 'paste' && !hasClip,
        onSelect: () => actions.dispatch({ type: 'bars', edit }),
      }))}
    >
      <Dropdown<number>
        label={t('bars.length')}
        value={ticks}
        options={barLengths(meter).map((length) => ({
          value: length,
          label: timeSignatureText(timeSignature(length / TICKS_PER_BEAT, meter)),
        }))}
        onChange={(length) => actions.dispatch({ type: 'barLength', ticks: length })}
      />
    </ActionMenu>
  )
}
