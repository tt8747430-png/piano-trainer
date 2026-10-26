import { DndContext, DragOverlay, type Announcements, type UniqueIdentifier } from '@dnd-kit/core'
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useSortableList } from '@/shared/lib'

/**
 * One list of Select's rows sorted by drag (Mindscape's engine, `useSortableList`): dragged by a
 * finger or a mouse, or picked up by Space or Enter and moved by the arrows; the order dropped goes
 * to `onMove`. A screen reader hears where the row is, by its name and its place.
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
  const { t } = useTranslation('songs')
  const list = useSortableList({ ids, onDrop: onMove })
  const own = (id: UniqueIdentifier) => list.items.find((item) => item === id)
  const name = (id: UniqueIdentifier) => {
    const found = own(id)
    return found === undefined ? '' : nameOf(found)
  }
  const at = (id: UniqueIdentifier) => ({
    place: list.items.indexOf(String(id) as Id) + 1,
    count: list.items.length,
  })
  const announcements: Announcements = {
    onDragStart: ({ active }) => t('drag.picked', { name: name(active.id) }),
    onDragOver: ({ active, over }) =>
      over ? t('drag.over', { name: name(active.id), ...at(over.id) }) : undefined,
    onDragEnd: ({ active, over }) =>
      over
        ? t('drag.dropped', { name: name(active.id), ...at(over.id) })
        : t('drag.cancelled', { name: name(active.id) }),
    onDragCancel: ({ active }) => t('drag.cancelled', { name: name(active.id) }),
  }
  return (
    <DndContext
      {...list.dnd}
      accessibility={{
        announcements,
        screenReaderInstructions: { draggable: t('drag.instructions') },
      }}
    >
      <SortableContext items={[...list.items]} strategy={rectSortingStrategy}>
        <ul aria-label={label} className="grid-cards gap-2">
          {list.items.map((id) => row(id))}
        </ul>
      </SortableContext>
      <DragOverlay {...list.overlay}>
        {list.activeId === null ? null : inHand(list.activeId)}
      </DragOverlay>
    </DndContext>
  )
}
