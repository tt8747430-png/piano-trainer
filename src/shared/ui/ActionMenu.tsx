import type { LucideIcon } from 'lucide-react'
import { useState, type ReactElement, type ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { Button } from './primitives/button'
import { Popover, PopoverContent, PopoverTrigger } from './primitives/popover'

/** One action of a pull-down: a row that acts and closes it. */
interface MenuAction {
  readonly key: string
  readonly label: string
  readonly onSelect: () => void
  readonly disabled?: boolean
  /** Its picture, before its name. */
  readonly icon?: LucideIcon
  /** An action that destroys (Delete): its row in the warning colour. */
  readonly destructive?: boolean
}

/**
 * A pull-down button (Apple's): a button that opens a popover of actions, each a 44px row; what it
 * holds besides (a length to choose, tools) is its children. Its button is an outline one holding
 * `trigger`, or `render` in its place (a round icon named for a screen reader).
 */
export function ActionMenu({
  label,
  trigger,
  render = <Button variant="outline" />,
  align = 'start',
  actions = [],
  children,
}: {
  label: string
  trigger: ReactNode
  render?: ReactElement
  /** Which edge of its button the popover lines up with: the end for a button at a row's end. */
  align?: 'start' | 'end'
  actions?: readonly MenuAction[]
  children?: ReactNode
}) {
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={render}>{trigger}</PopoverTrigger>
      <PopoverContent aria-label={label} align={align} className="w-72 gap-1 p-2">
        {actions.map((action) => (
          <Button
            key={action.key}
            variant="ghost"
            disabled={action.disabled}
            className={cn('w-full justify-start', action.destructive && 'text-destructive')}
            onClick={() => {
              action.onSelect()
              setOpen(false)
            }}
          >
            {action.icon ? <action.icon data-icon="inline-start" aria-hidden /> : null}
            {action.label}
          </Button>
        ))}
        {children}
      </PopoverContent>
    </Popover>
  )
}
