import { ArrowDownToLine, ArrowUpToLine, EyeOff, PenLine, Piano, Plus, Trash2 } from 'lucide-react'
import { useState, type ComponentProps, type ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { selectScoreView, useSettings } from '@/entities/settings'
import { isSingleStaff, staffPlace } from '@/shared/lib/notation'
import { ActionMenu } from '@/shared/ui'
import { useLayerName, type Printed } from '@/widgets/score-sheet'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { rowsInSight } from '../model/rows-in-sight'
import { useStaffHeads } from '../model/use-staff-heads'
import { StaffNameField } from './StaffNameField'

/**
 * A staff's menu, opened from its name at the first line's head (ADR 0094, 0097, Flat's instruments):
 * a single staff's Rename (its name typed where it is printed), Add a staff over or under it (single
 * staves stand over the piano), Show the piano where the score hides it, and Remove (its notes go
 * with it; Undo brings them back); the piano's Add a staff over the piano and Hide the piano (a lead
 * sheet, its music kept and played, ADR 0083). The last staff in sight is never removed or hidden.
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
  const heads = useStaffHeads()
  const layerName = useLayerName(heads)
  const leadSheet = useEditorState((state) => state.draft.leadSheet)
  const hidden = useSettings((state) => selectScoreView(state).hidden)
  // The staves the View shows of the score's: the last of them stays.
  const inSight = rowsInSight({ staves: heads, leadSheet }, { chordNames: false, hidden })
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null)
  const [renaming, setRenaming] = useState(false)
  const { dispatch } = actions
  const kept = t('printed.lastInSight')
  if (staves === 'piano')
    return (
      <ActionMenu
        label={t('printed.pianoStaves')}
        render={trigger}
        trigger={null}
        actions={[
          {
            key: 'add',
            label: t('printed.addStaffOverPiano'),
            icon: Plus,
            onSelect: () => dispatch({ type: 'addStaff', place: heads.length }),
          },
          {
            key: 'hide',
            label: t('printed.hidePiano'),
            icon: EyeOff,
            disabled: !inSight.some(isSingleStaff),
            reason: kept,
            onSelect: () => dispatch({ type: 'piano', hidden: true }),
          },
        ]}
      />
    )
  const place = staffPlace(staves)
  return (
    <>
      <ActionMenu
        ref={setAnchor}
        label={layerName(staves)}
        render={trigger}
        trigger={null}
        actions={[
          {
            key: 'rename',
            label: t('printed.renameStaff'),
            icon: PenLine,
            onSelect: () => setRenaming(true),
          },
          {
            key: 'over',
            label: t('printed.addStaffOver'),
            icon: ArrowUpToLine,
            onSelect: () => dispatch({ type: 'addStaff', place }),
          },
          {
            key: 'under',
            label: t('printed.addStaffUnder'),
            icon: ArrowDownToLine,
            onSelect: () => dispatch({ type: 'addStaff', place: place + 1 }),
          },
          ...(leadSheet
            ? [
                {
                  key: 'showPiano',
                  label: t('printed.showPiano'),
                  icon: Piano,
                  onSelect: () => dispatch({ type: 'piano', hidden: false }),
                },
              ]
            : []),
          {
            key: 'remove',
            label: t('printed.removeStaff'),
            icon: Trash2,
            destructive: true,
            disabled: inSight.length === 1 && inSight[0] === staves,
            reason: kept,
            onSelect: () => dispatch({ type: 'removeStaff', place }),
          },
        ]}
      />
      {renaming ? (
        <StaffNameField place={place} anchor={anchor} onClose={() => setRenaming(false)} />
      ) : null}
    </>
  )
}
