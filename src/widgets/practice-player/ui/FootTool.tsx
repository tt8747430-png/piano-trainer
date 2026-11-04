import type { LucideIcon } from 'lucide-react'
import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib'

/**
 * A tool of the Player's foot bar (R29 B8): its icon over its name, the reference's labelled bar. A
 * switch (`aria-pressed`) or an open menu wears the primary's ink while it is on.
 */
export function FootTool({
  icon: Icon,
  label,
  className,
  ...props
}: {
  icon: LucideIcon
  label: string
} & Omit<ComponentProps<'button'>, 'children'>) {
  return (
    <button
      type="button"
      className={cn(
        'flex min-h-12 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-control px-1 py-1 text-xs text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 aria-pressed:text-primary aria-expanded:text-foreground landscape-phone:min-h-10 landscape-phone:flex-row landscape-phone:gap-1.5',
        className,
      )}
      {...props}
    >
      <Icon aria-hidden className="size-5 shrink-0" />
      <span className="max-w-full truncate">{label}</span>
    </button>
  )
}
