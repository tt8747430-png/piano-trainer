import type { LucideIcon } from 'lucide-react'
import { useId, useState, type ReactElement, type ReactNode, type Ref } from 'react'
import { cn } from '@/shared/lib'
import { Button } from './primitives/button'
import { Popover, PopoverContent, PopoverTrigger } from './primitives/popover'

/** One action of a pull-down: a row that acts and closes it. */
interface MenuAction {
  readonly key: string
  readonly label: string
  readonly onSelect: () => void
  readonly disabled?: boolean
  /** Why it is greyed, said while it is: the browser's tooltip, and to a screen reader. */
  readonly reason?: string | undefined
  /** Its picture, before its name. */
  readonly icon?: LucideIcon
  /** An action that destroys (Delete): its row in the warning colour. */
  readonly destructive?: boolean
}

/**
 * A pull-down button (Apple's): a button that opens a popover of actions, each a 44px row, a greyed
 * one saying why (`reason`); what it holds besides (a length to choose, tools) is its children. Its
 * button is an outline one holding `trigger`, or `render` in its place (a round icon named for a
 * screen reader); `ref` is that button.
 */
export function ActionMenu({
  label,
  trigger,
  render = <Button variant="outline" />,
  align = 'start',
  actions = [],
  ref,
  children,
}: {
  label: string
  trigger: ReactNode
  render?: ReactElement
  /** Which edge of its button the popover lines up with: the end for a button at a row's end. */
  align?: 'start' | 'end'
  actions?: readonly MenuAction[]
  ref?: Ref<HTMLButtonElement>
  children?: ReactNode
}) {
  const id = useId()
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger ref={ref} render={render}>
        {trigger}
      </PopoverTrigger>
      <PopoverContent aria-label={label} align={align} className="w-72 gap-1 p-2">
        {actions.map((action) => {
          const why = action.disabled ? action.reason : undefined
          const whyId = `${id}-${action.key}-why`
          return (
            <Button
              key={action.key}
              variant="ghost"
              disabled={action.disabled}
              title={why}
              aria-describedby={why ? whyId : undefined}
              className={cn(
                'w-full justify-start',
                action.destructive && 'text-destructive',
                // Greyed with a reason, the pointer kept on it so the tooltip says it.
                why && 'disabled:pointer-events-auto disabled:hover:bg-transparent',
              )}
              onClick={() => {
                action.onSelect()
                setOpen(false)
              }}
            >
              {action.icon ? <action.icon data-icon="inline-start" aria-hidden /> : null}
              {action.label}
              {why ? (
                <span id={whyId} hidden>
                  {why}
                </span>
              ) : null}
            </Button>
          )
        })}
        {children}
      </PopoverContent>
    </Popover>
  )
}
