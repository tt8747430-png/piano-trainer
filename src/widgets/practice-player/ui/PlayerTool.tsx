import type { LucideIcon } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { Button } from '@/shared/ui/primitives/button'

/**
 * A tool of the Player's tools row (ADR 0102, 0104): a quiet text button, its icon in soft ink then
 * its name, cut short where the row has no room for it, then what it is set to (`value`: Transpose's
 * key), whole, and what follows (`children`: the View's chevron, turning while its menu is open).
 * Named for a screen reader by `label`, which holds the name it prints; `tip`, what it does or why it
 * is greyed, is its tooltip and a screen reader's description (ADR 0096), else its label is. A greyed
 * tool keeps the pointer, so its tooltip still says why. An equal share of the row on a phone held
 * upright, as wide as its words from a tablet's width; open or pressed (a switch, `aria-pressed`), it
 * wears the muted fill a pressed button does. On a phone held upright its padding and gaps are
 * narrower, so a name cut short keeps what letters it can; on a phone on its side, where the row
 * stands in the bar's, the tools share what room the bar leaves them, each cut short in proportion.
 */
export function PlayerTool({
  icon: Icon,
  label,
  name,
  value,
  tip,
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
  children?: ReactNode
} & Omit<
  ComponentProps<typeof Button>,
  'variant' | 'size' | 'aria-label' | 'title' | 'children' | 'value'
>) {
  return (
    <Button
      variant="ghost"
      aria-label={label}
      title={tip ?? label}
      className={cn(
        'h-11 min-w-0 flex-1 basis-0 gap-1.5 rounded-xl px-3 aria-pressed:bg-muted max-sm:gap-1 max-sm:px-2 narrow-phone:px-1.5 sm:flex-none sm:basis-auto landscape-phone:h-10 landscape-phone:shrink',
        tip && 'disabled:pointer-events-auto disabled:hover:bg-transparent',
        className,
      )}
      {...props}
    >
      <Icon aria-hidden className="text-muted-foreground" />
      <span className="min-w-0 truncate">{name}</span>
      {value === undefined ? null : <span className="shrink-0">{value}</span>}
      {children}
    </Button>
  )
}
