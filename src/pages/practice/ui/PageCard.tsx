import { useRender } from '@base-ui/react/use-render'
import type { ReactElement } from 'react'
import { cn } from '@/shared/lib'
import { PAINT, type Tile } from '@/shared/ui'

/** A place of Practice as a card on a laptop: its picture, its name and its line (canvas 160). */
export function PageCard({
  title,
  detail,
  tile,
  link,
}: {
  title: string
  detail: string
  tile: Tile
  /** The router `Link` it opens. */
  link: ReactElement
}) {
  const Icon = tile.icon
  return useRender({
    defaultTagName: 'a',
    render: link,
    props: {
      className:
        'flex min-h-32 flex-col gap-3 card p-4 transition-colors duration-200 ease-out hover:border-input focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
      children: (
        <>
          <span
            aria-hidden
            className={cn(
              'grid size-11 place-items-center rounded-control',
              PAINT[tile.paint].fill,
              PAINT[tile.paint].ink,
            )}
          >
            <Icon className="size-6" />
          </span>
          <span className="flex flex-col gap-0.5">
            <span className="font-semibold text-balance">{title}</span>
            <span className="text-sm text-pretty text-muted-foreground tabular-nums">{detail}</span>
          </span>
        </>
      ),
    },
  })
}
