import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { ExitFocus } from '@/shared/ui'

/**
 * The column a laptop's Songs place stands in (the boards' 56): its bar and its content end 56 from
 * the window's edges, whatever the screen's own gutter (canvas v551, "a laptop place's bar ends on
 * its column").
 */
export const PLACE_COLUMN = 'px-[calc(3.5rem-var(--gutter))]'

/**
 * One bar for every Songs place on a laptop (the boards' LPLACEBAR, owner 2026-11-17: "the pages
 * change to much from the all songs to explore"): the place's name at 30 bold with its count, then
 * its acts (···, Select), then the place's search 320 wide at the trailing edge, 88 tall, so stepping
 * between All songs, a playlist, Explore, Archive and Trash moves nothing of the frame (Finder, Apple
 * Music). While Select is on, the count chosen is the title and its acts are Select all and Done.
 */
export function PlaceBar({
  title,
  count,
  acts,
  search,
  className,
}: {
  title: string
  count?: string | undefined
  acts?: ReactNode
  search?: ReactNode
  className?: string
}) {
  return (
    // Its row 56 under the screen's top inset (the screen bar's), so the name stands at 44 and what
    // follows 88 down, as on the boards; the page's paper under it as it stays at the top.
    <header
      data-slot="screen-bar"
      className={cn('sticky top-0 z-30 -mt-safe shrink-0 bg-background pt-safe', className)}
    >
      <div className="flex h-14 items-center gap-3">
        <ExitFocus className="me-0 ms-0" />
        <h1 className="min-w-0 truncate font-sans text-[1.875rem] leading-tight font-bold tracking-title">
          {title}
        </h1>
        {count ? (
          <span className="shrink-0 text-lg whitespace-nowrap text-muted-foreground tabular-nums">
            {count}
          </span>
        ) : null}
        <span className="flex-1" />
        {acts ? <div className="flex shrink-0 items-center gap-2">{acts}</div> : null}
        {search ? <div className="w-80 shrink-0">{search}</div> : null}
      </div>
    </header>
  )
}
