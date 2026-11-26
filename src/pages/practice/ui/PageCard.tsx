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
  const Picture = tile.picture
  return useRender({
    defaultTagName: 'a',
    render: link,
    props: {
      className:
        'flex min-h-44 flex-col gap-3 card p-4 transition-colors duration-200 ease-out hover:ring-input',
      children: (
        <>
          <span
            aria-hidden
            className={cn(
              'grid size-24 place-items-center overflow-hidden rounded-sheet',
              PAINT[tile.paint].fill,
              PAINT[tile.paint].ink,
            )}
          >
            {Picture ? (
              <Picture className="size-full" />
            ) : (
              <Icon className="size-9" strokeWidth={1.75} />
            )}
          </span>
          <span className="flex flex-col gap-0.5">
            <span className="text-lg leading-[normal] font-bold text-balance">{title}</span>
            <span className="text-sm leading-[normal] text-pretty text-muted-foreground tabular-nums">
              {detail}
            </span>
          </span>
        </>
      ),
    },
  })
}
