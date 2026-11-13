import type { LucideIcon } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/shared/lib'

/**
 * A tool of the Player's foot bar (R29 B8): its icon, or a picture of its own (the hands' swatches), over
 * its name, the reference's labelled bar. A switch (`aria-pressed`) or an open menu wears the primary's ink while it is on.
 */
export function FootTool({
  icon,
  label,
  className,
  ...props
}: {
  /** A Lucide icon, or a picture drawn 20px square. */
  icon: LucideIcon | { readonly picture: ReactNode }
  label: string
} & Omit<ComponentProps<'button'>, 'children'>) {
  const Icon = 'picture' in icon ? null : icon
  return (
    <button
      type="button"
      className={cn(
        'flex min-h-12 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-control px-0.5 py-1 text-[0.6875rem] text-muted-foreground transition-colors xl:min-w-16 xl:flex-none xl:px-3 hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50 aria-pressed:text-primary aria-expanded:text-foreground landscape-phone:min-h-10 landscape-phone:flex-row landscape-phone:gap-1.5',
        className,
      )}
      {...props}
    >
      {Icon ? (
        <Icon aria-hidden className="size-5 shrink-0" />
      ) : (
        <span aria-hidden className="grid size-5 shrink-0 place-items-center">
          {'picture' in icon ? icon.picture : null}
        </span>
      )}
      <span className="max-w-full text-center leading-tight">{label}</span>
    </button>
  )
}
