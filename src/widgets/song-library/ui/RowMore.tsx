import { Ellipsis } from 'lucide-react'
import { ActionMenu, type MenuAction } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { ROW_CONTROL } from './row-class'

/**
 * A row's More (⋯): every action of the row, at every size, named for what it is the More of; none
 * where the row has no action (rule 16: only what can be done here).
 */
export function RowMore({ label, actions }: { label: string; actions: readonly MenuAction[] }) {
  if (actions.length === 0) return null
  return (
    <ActionMenu
      label={label}
      align="end"
      trigger={<Ellipsis aria-hidden />}
      render={
        <Button
          variant="ghost"
          size="icon"
          aria-label={label}
          title={label}
          className={ROW_CONTROL}
        />
      }
      actions={actions}
    />
  )
}
