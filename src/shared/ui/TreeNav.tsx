import { useRender } from '@base-ui/react/use-render'
import type { LucideIcon } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/shared/lib'

/** A tree row's look: a link or button the width of the pane, the place open marked by `aria-current`. */
export const TREE_ITEM =
  'flex min-h-11 min-w-0 flex-1 items-center gap-2.5 rounded-control px-2 text-[0.9375rem] font-medium text-foreground transition-colors duration-200 hover:bg-muted focus-visible:-outline-offset-3 aria-[current=page]:bg-chosen aria-[current=page]:font-semibold'

/** A count at a tree row's end, in soft ink. */
export const TreeCount = ({ n }: { n: number }) => (
  <span className="ms-auto ps-2 text-sm font-normal text-muted-foreground tabular-nums">{n}</span>
)

/** A run of a tree's rows. */
export const TreeList = ({ className, ...props }: ComponentProps<'ul'>) => (
  <ul className={cn('flex flex-col gap-0.5', className)} {...props} />
)

/** A heading over a run of a tree's rows (Folders, Books). */
export const TreeHeading = ({ children }: { children: ReactNode }) => (
  <h2 className="px-2 pt-4 pb-1 font-sans text-xs font-semibold text-muted-foreground">
    {children}
  </h2>
)

/**
 * One place in a library's tree (the laptop's left pane, R30 S2): its picture, its name and its
 * count, as the link `render` gives, marked while open.
 */
export function TreeItem({
  icon: Icon,
  picture,
  label,
  count,
  current,
  render,
}: {
  /** A plain picture in soft ink, or `picture` for a painted one of the row's own. */
  icon?: LucideIcon
  picture?: ReactNode
  label: string
  count?: number
  current: boolean
  /** The link (or button) the row is. */
  render: useRender.RenderProp
}) {
  const row = useRender({
    defaultTagName: 'a',
    render,
    props: {
      'aria-current': current ? 'page' : undefined,
      className: TREE_ITEM,
      children: (
        <>
          {picture ??
            (Icon ? (
              <Icon aria-hidden className="size-4.5 shrink-0 text-muted-foreground" />
            ) : null)}
          <span className="min-w-0 truncate">{label}</span>
          {count === undefined ? null : <TreeCount n={count} />}
        </>
      ),
    },
  })
  return <li className="flex">{row}</li>
}
