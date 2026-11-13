import { cn } from '@/shared/lib'
import { Ellipsis } from 'lucide-react'
import { ActionMenu, type MenuAction } from './ActionMenu'
import { Button } from './primitives/button'
import { ROW_CONTROL } from './library-row-class'

/**
 * A row's More (⋯): every action of the row, at every size, named for what it is the More of; none
 * where the row has no action (rule 16: only what can be done here).
 */
export function RowMore({
  label,
  actions,
  className,
}: {
  label: string
  actions: readonly MenuAction[]
  /** Where it shows: a library row's only under a mouse (`POINTER_ONLY`). */
  className?: string
}) {
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
          className={cn(ROW_CONTROL, className)}
        />
      }
      actions={actions}
    />
  )
}
