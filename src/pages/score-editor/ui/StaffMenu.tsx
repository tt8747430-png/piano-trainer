import { EyeOff, Piano, Plus, Trash2 } from 'lucide-react'
import type { ComponentProps, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'
import { rowShown } from '@/features/score-editor'
import { ActionMenu } from '@/shared/ui'
import type { Printed } from '@/widgets/score-sheet'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'

/**
 * A staff's menu, opened from its name at the first line's head (ADR 0094): the tune's Show the piano
 * where the score is a lead sheet, and Remove the melody staff (its notes go with it; Undo brings
 * them back); the piano's Add a melody staff where there is none, else Hide the piano (a lead sheet,
 * its music kept and played, ADR 0083).
 */
export function StaffMenu({
  staves,
  trigger,
}: {
  staves: Extract<Printed, { kind: 'staff' }>['staves']
  trigger: ReactElement<ComponentProps<'button'>>
}) {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const { melody, piano } = useEditorState(
    useShallow((state) => ({
      melody: state.draft.melodyStaff,
      piano: rowShown(state.draft, 'piano'),
    })),
  )
  const { dispatch } = actions
  const showPiano = {
    key: 'showPiano',
    label: t('printed.showPiano'),
    icon: Piano,
    onSelect: () => dispatch({ type: 'piano', hidden: false }),
  }
  const removeMelody = {
    key: 'removeMelody',
    label: t('printed.removeMelody'),
    icon: Trash2,
    destructive: true,
    onSelect: () => dispatch({ type: 'melodyStaff', on: false }),
  }
  const addMelody = {
    key: 'addMelody',
    label: t('printed.addMelody'),
    icon: Plus,
    onSelect: () => dispatch({ type: 'melodyStaff', on: true }),
  }
  const hidePiano = {
    key: 'hidePiano',
    label: t('printed.hidePiano'),
    icon: EyeOff,
    onSelect: () => dispatch({ type: 'piano', hidden: true }),
  }
  const items =
    staves === 'melody'
      ? [...(piano ? [] : [showPiano]), removeMelody]
      : [melody ? hidePiano : addMelody]
  return (
    <ActionMenu
      label={t(`printed.staves.${staves}`)}
      render={trigger}
      trigger={null}
      actions={items}
    />
  )
}
