import { useRender } from '@base-ui/react/use-render'
import type { LucideIcon } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { PAINT, type Paint } from './paint'

/**
 * A tree row's look, the board's library pane (`r41_lib`): 40 tall, 15 in ink, 9 corners, 12 in; the
 * place open marked by `aria-current` in the one selected style (`choice`) and in bold.
 */
export const TREE_ITEM =
  'flex min-h-10 min-w-0 flex-1 items-center gap-2.5 rounded-[9px] px-3 text-[0.9375rem] font-medium text-foreground choice focus-visible:-outline-offset-3 aria-[current=page]:font-bold'

/** A count at a tree row's end, in soft ink. */
export const TreeCount = ({ n }: { n: number }) => (
  <span className="ms-auto ps-2 text-sm font-normal text-muted-foreground">{n}</span>
)

/** A tree row's painted picture: its icon on its paint's wash, the tree's size (a folder, a Settings page). */
export const TreeSwatch = ({ icon: Icon, paint }: { icon: LucideIcon; paint: Paint }) => (
  <span
    aria-hidden
    className={cn(
      'grid size-6 shrink-0 place-items-center rounded-pill',
      PAINT[paint].fill,
      PAINT[paint].ink,
    )}
  >
    <Icon className="size-3.5" />
  </span>
)

/** A run of a tree's rows. */
export const TreeList = ({ className, ...props }: ComponentProps<'ul'>) => (
  <ul className={cn('flex flex-col gap-0.5', className)} {...props} />
)

/** A heading over a run of a tree's rows (Places, Folders, Books), in the soft caps every group wears. */
export const TreeHeading = ({ children, first }: { children: ReactNode; first?: boolean }) => (
  <h2 className={cn('caps px-1 pb-1.5', !first && 'pt-4')}>{children}</h2>
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
