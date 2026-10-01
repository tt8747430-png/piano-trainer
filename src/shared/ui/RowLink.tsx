import { useRender } from '@base-ui/react/use-render'
import { ChevronRight, type LucideIcon } from 'lucide-react'
import { cn } from '@/shared/lib'
import { PAINT, type Paint } from './paint'

/** A row's tile: an icon on its paint's wash. */
type RowTile = { icon: LucideIcon; paint: Paint } | { icon?: undefined; paint?: undefined }

/**
 * A list row that leads to a page: a tile in its paint with an icon (a list of one kind goes without,
 * every row's tile alike), a title, an optional detail of up to two lines, and a chevron (Apple's
 * disclosure indicator). `render` is the link (a router `Link`).
 */
export function RowLink({
  title,
  detail,
  icon: Icon,
  paint,
  render,
}: {
  title: string
  detail?: string | undefined
  render: useRender.RenderProp
} & RowTile) {
  return useRender({
    defaultTagName: 'a',
    render,
    props: {
      className: cn(
        'flex min-h-16 min-w-0 items-center gap-4 rounded-2xl py-1.5 transition-colors duration-200 ease-out outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring',
        // A row without a tile keeps its text off the card's edge.
        Icon ? 'px-1' : 'px-3',
      ),
      children: (
        <>
          {Icon && paint ? (
            <span
              data-slot="row-tile"
              className={cn(
                'grid size-12 shrink-0 place-items-center rounded-2xl',
                PAINT[paint].fill,
                PAINT[paint].ink,
              )}
            >
              <Icon aria-hidden className="size-5" />
            </span>
          ) : null}
          <span className="min-w-0 flex-1">
            <span className="block truncate text-lg font-semibold">{title}</span>
            {detail ? (
              <>
                {' '}
                <span className="line-clamp-2 text-sm text-muted-foreground">{detail}</span>
              </>
            ) : null}
          </span>
          <ChevronRight aria-hidden className="size-5 shrink-0 text-muted-foreground" />
        </>
      ),
    },
  })
}
