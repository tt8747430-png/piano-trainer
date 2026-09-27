import { useRender } from '@base-ui/react/use-render'
import { ChevronRight, type LucideIcon } from 'lucide-react'
import { cn } from '@/shared/lib'
import { PAINT, type Paint } from './paint'

/**
 * A list row that leads to a page: a tile in its paint with an icon, a title, an optional detail,
 * and a chevron (Apple's disclosure indicator). `render` is the link (a router `Link`).
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
  icon: LucideIcon
  paint: Paint
  render: useRender.RenderProp
}) {
  return useRender({
    defaultTagName: 'a',
    render,
    props: {
      className:
        'flex min-h-16 min-w-0 items-center gap-4 rounded-2xl px-1 py-1.5 transition-colors duration-200 ease-out outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring',
      children: (
        <>
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
          <span className="min-w-0 flex-1">
            <span className="block truncate text-lg font-semibold">{title}</span>
            {detail ? (
              <>
                {' '}
                <span className="block truncate text-sm text-muted-foreground">{detail}</span>
              </>
            ) : null}
          </span>
          <ChevronRight aria-hidden className="size-5 shrink-0 text-muted-foreground" />
        </>
      ),
    },
  })
}
