import { GROUPED_LIST } from '@/shared/ui'
import { useCardLook } from './card-look'
import type { DragCancelEvent, DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react'
import { cn, useSortableList } from '@/shared/lib'
import { useLibraryDnd, type SortedList } from '../model/library-dnd'

/**
 * One list of Select's rows sorted by their handles (Mindscape's engine, `useSortableList`), in the
 * library's one drag (`LibraryDnd`): dragged by a finger or a mouse, or picked up by Space or Enter
 * and moved by the arrows; the order dropped goes to `onMove`. A screen reader hears where the row
 * is, by its name and its place.
 */
export function SortableRows<Id extends string>({
  label,
  ids,
  nameOf,
  onMove,
  row,
  inHand,
}: {
  /** The list's name. */
  label: string
  ids: readonly Id[]
  nameOf: (id: Id) => string
  onMove: (order: Id[]) => void
  row: (id: Id) => ReactNode
  inHand: (id: Id) => ReactNode
}) {
  const list = useSortableList({ ids, onDrop: onMove })
  const { join } = useLibraryDnd()
  const own = (id: string) => list.items.find((item) => item === id)
  // The list as it stands now, read by the drag at each of its moments.
  const latest = useRef<SortedList | null>(null)
  useLayoutEffect(() => {
    latest.current = {
      owns: (id) => own(id) !== undefined,
      onDragStart: (event: DragStartEvent) => list.dnd.onDragStart?.(event),
      onDragEnd: (event: DragEndEvent) => list.dnd.onDragEnd?.(event),
      onDragCancel: (event: DragCancelEvent) => list.dnd.onDragCancel?.(event),
      inHand: (id) => {
        const found = own(id)
        return found === undefined ? null : inHand(found)
      },
      name: (id) => {
        const found = own(id)
        return found === undefined ? '' : nameOf(found)
      },
      at: (id) => ({ place: list.items.indexOf(id as Id) + 1, count: list.items.length }),
    }
  })
  useEffect(
    () =>
      join(label, () => {
        if (!latest.current) throw new Error('a list joins once drawn')
        return latest.current
      }),
    [join, label],
  )
  // In Select as out of it (`LibraryRows`): a List's rows in one card (canvas 133), Cards' each its
  // own, 12 apart and two across on a laptop, Grid's in its grid.
  const { layout } = useCardLook().style
  return (
    <SortableContext items={[...list.items]} strategy={rectSortingStrategy}>
      <ul
        aria-label={label}
        className={
          layout === 'list'
            ? GROUPED_LIST
            : cn('grid gap-3', layout === 'grid' ? 'grid-cards auto-rows-fr' : 'lg:grid-cols-2')
        }
      >
        {list.items.map((id) => row(id))}
      </ul>
    </SortableContext>
  )
}
