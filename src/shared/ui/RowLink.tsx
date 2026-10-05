import { useRender } from '@base-ui/react/use-render'
import { ChevronRight, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { PAINT, type Paint } from './paint'

/** A row's tile on its paint's wash: an icon, or the row's number where the rows are a sequence; or none. */
type RowTile =
  | { icon: LucideIcon; numeral?: undefined; paint: Paint }
  | { icon?: undefined; numeral: number; paint: Paint }
  | { icon?: undefined; numeral?: undefined; paint?: undefined }

/**
 * A list row that leads to a page: a tile in its paint with an icon, or its number in a sequence (a
 * list of one kind goes without, every row's tile alike), a title, an optional detail of one line, what it carries at its end (a level,
 * a mark) and a chevron (Apple's disclosure indicator). `render` is the link (a router `Link`).
 */
export function RowLink({
  title,
  detail,
  icon: Icon,
  numeral,
  paint,
  trailing,
  render,
}: {
  title: string
  detail?: string | undefined
  trailing?: ReactNode
  render: useRender.RenderProp
} & RowTile) {
  return useRender({
    defaultTagName: 'a',
    render,
    props: {
      className: cn(
        'flex min-h-16 min-w-0 items-center gap-3 rounded-2xl py-1.5 transition-colors duration-200 ease-out hover:bg-muted focus-visible:-outline-offset-3',
        // A row without a tile keeps its text off the card's edge.
        paint ? 'px-1' : 'px-3',
      ),
      children: (
        <>
          {paint ? (
            <span
              data-slot="row-tile"
              aria-hidden
              className={cn(
                'grid size-12 shrink-0 place-items-center rounded-2xl font-display text-xl font-semibold tabular-nums',
                PAINT[paint].fill,
                PAINT[paint].ink,
              )}
            >
              {Icon ? <Icon className="size-5" /> : numeral}
            </span>
          ) : null}
          <span className="min-w-0 flex-1">
            <span className="block truncate text-lg font-semibold">{title}</span>
            {detail ? (
              <>
                {' '}
                <span className="block truncate text-sm text-muted-foreground">{detail}</span>
              </>
            ) : null}
          </span>
          {trailing ? <> {trailing}</> : null}
          <ChevronRight aria-hidden className="size-5 shrink-0 text-muted-foreground" />
        </>
      ),
    },
  })
}
