import type { LucideIcon } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { Button } from '@/shared/ui/primitives/button'

/**
 * A tool of the Player's tools row (ADR 0102): a quiet text button, its icon in soft ink then its
 * name, cut short where the row has no room for it, and what follows the name (`children`: the
 * View's chevron, turning while its menu is open). Named for a screen reader and a pointer by
 * `label`, which holds the name it prints. An equal share of the row on a phone held upright, as wide
 * as its words from a tablet's width; open, it wears the muted fill a pressed button does.
 */
export function PlayerTool({
  icon: Icon,
  label,
  name,
  className,
  children,
  ...props
}: {
  icon: LucideIcon
  label: string
  /** What it prints: the View's the view shown. */
  name: string
  children?: ReactNode
} & Omit<ComponentProps<typeof Button>, 'variant' | 'size' | 'aria-label' | 'title' | 'children'>) {
  return (
    <Button
      variant="ghost"
      aria-label={label}
      title={label}
      className={cn(
        'h-11 min-w-0 flex-1 basis-0 gap-1.5 rounded-xl px-3 sm:flex-none sm:basis-auto landscape-phone:h-10',
        className,
      )}
      {...props}
    >
      <Icon aria-hidden className="text-muted-foreground" />
      <span className="min-w-0 truncate">{name}</span>
      {children}
    </Button>
  )
}
