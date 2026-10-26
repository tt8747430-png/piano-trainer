import {
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DndContextProps,
  type DragEndEvent,
  type DragStartEvent,
  type DropAnimation,
  type UniqueIdentifier,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useState } from 'react'
import { moveBlock } from './move-block'
import { useHeldOrder } from './use-held-order'
import { useMediaQuery } from './use-media-query'

/** How a dropped row settles into its place: the app's one ease-out (DESIGN.md, Motion). */
const DROP_ANIMATION: DropAnimation = { duration: 200, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

/** A list sorted by drag, as `useSortableList` keeps it. */
export interface SortableList<T extends UniqueIdentifier> {
  /** The order to draw: the one the last drop asked for, until the list says the same. */
  readonly items: readonly T[]
  /** The row in hand, for the drag's overlay. */
  readonly activeId: T | null
  /** Spread on the `DndContext`: its sensors, how a drop finds its row, and the drag's handlers. */
  readonly dnd: Pick<
    DndContextProps,
    'sensors' | 'collisionDetection' | 'onDragStart' | 'onDragEnd' | 'onDragCancel'
  >
  /** Spread on the `DragOverlay`: how the row settles, at once under reduced motion. */
  readonly overlay: { readonly dropAnimation: DropAnimation | null }
}

/**
 * One list sorted by drag (Mindscape's engine over dnd-kit): a mouse moves a row once it has gone
 * 8px, a finger once it has held it a quarter of a second, the keyboard's arrows once Space or Enter
 * picked it up; the row lands where `moveBlock` says; the order dropped goes to `onDrop`, which may
 * refuse it (`false`: the rows snap back), and is held on screen until `ids` say the same, so the
 * rows never snap back under the finger while the list catches up.
 */
export function useSortableList<T extends UniqueIdentifier>({
  ids,
  onDrop,
}: {
  ids: readonly T[]
  onDrop: (next: T[]) => boolean | void
}): SortableList<T> {
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )
  const reduced = useMediaQuery(REDUCED_MOTION)
  const [activeId, setActiveId] = useState<T | null>(null)
  const { order: items, hold } = useHeldOrder(ids)
  // dnd-kit hands back the ids its rows were given: these rows'.
  const own = (id: UniqueIdentifier) => items.find((item) => item === id)

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null)
    const moved = own(active.id)
    const onto = over ? own(over.id) : undefined
    if (moved === undefined || onto === undefined || moved === onto) return
    const next = moveBlock(items, new Set([moved]), onto)
    if (onDrop(next) === false) return
    hold(next)
  }

  return {
    items,
    activeId,
    dnd: {
      sensors,
      collisionDetection: closestCenter,
      onDragStart: ({ active }: DragStartEvent) => setActiveId(own(active.id) ?? null),
      onDragEnd,
      onDragCancel: () => setActiveId(null),
    },
    overlay: { dropAnimation: reduced ? null : DROP_ANIMATION },
  }
}
