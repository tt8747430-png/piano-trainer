import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

/**
 * A list with nothing to show, as the canvas's EMPTY draws it: a 64 round sand mark with its icon,
 * what is empty in 18 bold, a 15 line saying what to do, and its one way on, a 44 sand pill.
 */
export function EmptyState({
  icon: Icon,
  title,
  line,
  children,
}: {
  icon: LucideIcon
  title: string
  line?: string
  children?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-2 px-5 py-14 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon aria-hidden className="size-6.5" />
      </span>
      {/* A long query breaks rather than run off the screen. */}
      <p className="text-lg font-bold text-balance wrap-break-word">{title}</p>
      {line ? (
        <p className="max-w-[340px] text-[0.9375rem]/[1.45] text-pretty text-muted-foreground">
          {line}
        </p>
      ) : null}
      {children ? (
        <div className="mt-1.5 flex flex-wrap justify-center gap-2 *:h-11 *:rounded-full *:border-0 *:bg-muted *:px-5 *:font-bold *:hover:bg-muted/80">
          {children}
        </div>
      ) : null}
    </div>
  )
}
