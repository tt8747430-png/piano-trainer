import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'

/**
 * A state with nothing to list, as the canvas's EMPTY draws it: a 64 round sand mark with its icon,
 * what is empty in 18 bold, a 15 line where it teaches what to try, and its way on, 44 sand pills;
 * a way back from a failure (Try again) the screen's one honey pill, as the boards' failed states.
 */
export function Said({
  icon: Icon,
  title,
  description,
  action,
  primary = false,
}: {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
  /** Its way on is the screen's one action (Try again after a failure): honey, not sand. */
  primary?: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-2 px-5 py-14 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon aria-hidden className="size-6.5" />
      </span>
      {/* A long query breaks rather than run off the screen. */}
      <p role="status" className="text-lg font-bold text-balance wrap-break-word">
        {title}
      </p>
      {description ? (
        <p className="max-w-[340px] text-[0.9375rem]/[1.45] text-pretty text-muted-foreground">
          {description}
        </p>
      ) : null}
      {action ? (
        <div
          className={cn(
            'mt-1.5 flex flex-wrap justify-center gap-2 *:h-11 *:rounded-full *:border-0 *:px-5 *:font-bold',
            primary
              ? '*:bg-primary *:text-primary-foreground *:hover:brightness-95'
              : '*:bg-muted *:hover:bg-muted/80',
          )}
        >
          {action}
        </div>
      ) : null}
    </div>
  )
}
