import { useState, type ReactNode } from 'react'
import { Button } from '@/shared/ui/primitives/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/primitives/popover'

/** One action of a pull-down: a row that acts and closes it. */
export interface MenuAction {
  readonly key: string
  readonly label: string
  readonly onSelect: () => void
  readonly disabled?: boolean
}

/**
 * A pull-down button (Apple's): a button that opens a popover of actions, each a 44px row; what it
 * holds besides (a length to choose) is its children.
 */
export function ActionMenu({
  label,
  trigger,
  actions,
  children,
}: {
  label: string
  trigger: ReactNode
  actions: readonly MenuAction[]
  children?: ReactNode
}) {
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={<Button variant="outline" />}>{trigger}</PopoverTrigger>
      <PopoverContent aria-label={label} align="start" className="w-72 gap-1 p-2">
        {actions.map((action) => (
          <Button
            key={action.key}
            variant="ghost"
            disabled={action.disabled}
            className="w-full justify-start"
            onClick={() => {
              action.onSelect()
              setOpen(false)
            }}
          >
            {action.label}
          </Button>
        ))}
        {children}
      </PopoverContent>
    </Popover>
  )
}
