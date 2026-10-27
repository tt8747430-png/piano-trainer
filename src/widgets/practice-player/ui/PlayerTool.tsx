import type { LucideIcon } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { Button } from '@/shared/ui/primitives/button'

/**
 * A tool of the Player's tools row (ADR 0102, 0104): a toolbar's text button (ADR 0115), its icon, then
 * its name, then what it is set to (`value`: Transpose's key), whole, and what follows (`children`:
 * the View's chevron, turning while its menu is open). On a phone held upright a tool with a value
 * shows that alone after its icon, its name left to its label, so no name is cut short there; a
 * `brief` one, on a phone on its side too.
 * Named for a screen reader by `label`, which holds the name it prints; `tip`, what it does or why it
 * is greyed, is its tooltip and a screen reader's description (ADR 0096), else its label is. A greyed
 * tool keeps the pointer, so its tooltip still says why. As wide as its words, growing into the
 * row's room on a phone held upright, where its words are a size down and its padding narrower;
 * open or pressed (a switch, `aria-pressed`), it wears the muted fill a pressed button does. On a
 * phone on its side, where the row stands in the bar's, the tools share what room the bar leaves.
 */
export function PlayerTool({
  icon: Icon,
  label,
  name,
  value,
  tip,
  brief = false,
  className,
  children,
  ...props
}: {
  icon: LucideIcon
  label: string
  /** What it prints: the View's the view shown, a tool its own name. */
  name: string
  /** What it is set to, after its name and never cut short. */
  value?: ReactNode
  tip?: string | undefined
  /**
   * Its name left to its label on a phone, upright or on its side, its icon (and value) alone there:
   * a tool sharing the row with the edit row's icons (the editor's View and Transpose, ADR 0110).
   */
  brief?: boolean
  children?: ReactNode
} & Omit<
  ComponentProps<typeof Button>,
  'variant' | 'size' | 'aria-label' | 'title' | 'children' | 'value'
>) {
  return (
    <Button
      variant="tool"
      aria-label={label}
      title={tip ?? label}
      className={cn(
        'h-11 min-w-0 flex-auto gap-1.5 px-3 max-sm:gap-1 max-sm:px-2 max-sm:text-sm narrow-phone:px-1.5 sm:flex-none landscape-phone:h-10 landscape-phone:shrink',
        tip && 'disabled:pointer-events-auto disabled:hover:bg-transparent',
        className,
      )}
      {...props}
    >
      <Icon aria-hidden />
      <span
        className={cn(
          'min-w-0 truncate',
          value !== undefined && 'max-sm:hidden',
          brief && 'max-sm:hidden landscape-phone:hidden',
        )}
      >
        {name}
      </span>
      {value === undefined ? null : <span className="shrink-0">{value}</span>}
      {children}
    </Button>
  )
}
