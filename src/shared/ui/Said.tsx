import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'

/**
 * A state with nothing to list, the kit's one empty state (the canvas's EMPTY, r53): a 72 honey tile
 * of 18 corners with its icon in ink, what is empty in 18 bold, a 15 line where it teaches what to
 * try, 8 apart, 56 above and below, and no box round it. At most one way on: a link, a quiet 48 pill, or,
 * back from a failure (Try again), the screen's one honey pill. The same on a first-run library, an emptied
 * folder, Archive, Trash, Notifications and a search with no result.
 */
export function Said({
  icon: Icon,
  title,
  description,
  action,
  primary = false,
  quiet = false,
  pair = false,
}: {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
  /** Its way on is the screen's one action (Try again after a failure): a honey pill, not a link. */
  primary?: boolean
  /** …or a quiet sand pill, the board's quiet BTN at 48 (Clear search, Join with a link). */
  quiet?: boolean
  /** …or two buttons that carry their own looks, the quiet one then the honey one (Join with a link · New group). */
  pair?: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-2 px-5 py-14 text-center">
      <span className="flex size-18 items-center justify-center rounded-[18px] bg-paint-yellow text-foreground">
        <Icon aria-hidden className="size-6.5" />
      </span>
      {/* A long query breaks rather than run off the screen. */}
      <p role="status" className="text-[1.125rem]/[normal] font-bold text-balance wrap-break-word">
        {title}
      </p>
      {description ? (
        <p className="max-w-85 text-[0.9375rem]/[1.45] text-pretty text-muted-foreground">
          {description}
        </p>
      ) : null}
      {action ? (
        <div
          className={cn(
            'mt-2 flex flex-wrap justify-center gap-3',
            pair
              ? ''
              : primary
                ? '*:h-12.5 *:rounded-pill *:border-0 *:bg-primary *:px-5 *:font-bold *:text-primary-foreground *:hover:brightness-95'
                : quiet
                  ? '*:h-12 *:rounded-pill *:border-0 *:bg-muted *:px-5 *:text-base *:font-bold *:text-foreground *:hover:brightness-95'
                  : '*:min-h-11 *:border-0 *:bg-transparent *:px-2 *:text-base *:font-semibold *:text-link *:shadow-none *:hover:bg-transparent *:hover:underline',
          )}
        >
          {action}
        </div>
      ) : null}
    </div>
  )
}
