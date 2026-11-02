import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  pointerWithin,
  rectIntersection,
  TouchSensor,
  useSensor,
  useSensors,
  type Announcements,
  type CollisionDetection,
  type DragCancelEvent,
  type DragEndEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from '@/shared/lib'
import {
  CARRY,
  DndContextOf,
  INTO,
  ZONE,
  type CarryTarget,
  type SortedList,
} from '../model/library-dnd'

const DROP_ANIMATION = { duration: 200, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

/**
 * The library's one drag while Select is on (Mindscape's `LibrarySelectList`), over every list in it:
 * a row's handle sorts it among its own list (`SortableRows`, the Manual order), and a row's body
 * carries it, with every row chosen where it is chosen (`carried`), into a folder (the folder lit as
 * the drop's target) or onto a place on the bar (Archive, Move out); the drop goes to `onCarry`.
 * A mouse lifts a row once it has gone 8px, a finger once it has held it a quarter of a second, so a
 * tap still chooses and a swipe still scrolls; the keyboard sorts by the handles, and Move to… moves.
 */
export function LibraryDnd({
  carried,
  nameOf,
  targetName,
  inHand,
  onCarry,
  children,
}: {
  /** The rows' keys a row's body carries: every row chosen where it is chosen, else itself. */
  carried: (key: string) => readonly string[]
  /** A row's name by its key, as a screen reader hears what is carried. */
  nameOf: (key: string) => string
  /** A drop's target by name: a folder's, or a place's. */
  targetName: (target: CarryTarget) => string
  /** The rows carried, as the hand holds them. */
  inHand: (keys: readonly string[]) => ReactNode
  onCarry: (keys: readonly string[], target: CarryTarget) => void
  children: ReactNode
}) {
  const { t } = useTranslation('songs')
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )
  const reduced = useMediaQuery(REDUCED_MOTION)
  const lists = useRef(new Map<string, () => SortedList>())
  const [carrying, setCarrying] = useState<readonly string[] | null>(null)
  // The row a handle lifted, as the hand holds it.
  const [sorted, setSorted] = useState<ReactNode>(null)
  // A row carried into a folder or onto a place has gone from where it was: it settles at once.
  const [lastCarried, setLastCarried] = useState(false)

  const join = useCallback((key: string, list: () => SortedList) => {
    lists.current.set(key, list)
    return () => void lists.current.delete(key)
  }, [])
  const listOf = (id: string) => [...lists.current.values()].find((list) => list().owns(id))?.()
  const every = () => [...lists.current.values()].map((list) => list())

  const targetOf = (id: UniqueIdentifier | undefined): CarryTarget | null => {
    const text = id === undefined ? '' : String(id)
    if (text.startsWith(INTO)) return { into: text.slice(INTO.length) }
    if (text.startsWith(ZONE)) return { zone: text.slice(ZONE.length) }
    return null
  }

  // A carried row finds the folder or place under the pointer; a sorted one its own list's rows.
  const collision: CollisionDetection = (args) => {
    const active = String(args.active.id)
    if (active.startsWith(CARRY)) {
      const targets = args.droppableContainers.filter((each) => targetOf(each.id) !== null)
      const scoped = { ...args, droppableContainers: targets }
      return args.pointerCoordinates ? pointerWithin(scoped) : rectIntersection(scoped)
    }
    const list = listOf(active)
    return closestCenter({
      ...args,
      droppableContainers: args.droppableContainers.filter((each) =>
        list ? list.owns(String(each.id)) : false,
      ),
    })
  }

  const finish = () => {
    setCarrying(null)
    setSorted(null)
  }
  const onDragStart = (event: DragStartEvent) => {
    const active = String(event.active.id)
    setLastCarried(active.startsWith(CARRY))
    if (active.startsWith(CARRY)) return setCarrying(carried(active.slice(CARRY.length)))
    setSorted(listOf(active)?.inHand(active) ?? null)
    for (const list of every()) list.onDragStart(event)
  }
  const onDragEnd = (event: DragEndEvent) => {
    const active = String(event.active.id)
    const keys = carrying
    finish()
    if (active.startsWith(CARRY)) {
      const target = targetOf(event.over?.id)
      if (keys && target) onCarry(keys, target)
      return
    }
    for (const list of every()) list.onDragEnd(event)
  }
  const onDragCancel = (event: DragCancelEvent) => {
    finish()
    for (const list of every()) list.onDragCancel(event)
  }

  const carriedName = (keys: readonly string[]) => {
    const [only] = keys
    return keys.length === 1 && only ? nameOf(only) : t('select.count', { count: keys.length })
  }
  const announcements: Announcements = {
    onDragStart: ({ active }) => {
      const id = String(active.id)
      if (id.startsWith(CARRY))
        return t('drag.picked', { name: carriedName(carried(id.slice(CARRY.length))) })
      const list = listOf(id)
      return list ? t('drag.picked', { name: list.name(id) }) : undefined
    },
    onDragOver: ({ active, over }) => {
      const id = String(active.id)
      if (id.startsWith(CARRY)) {
        const target = targetOf(over?.id)
        return target ? t('drag.overTarget', { target: targetName(target) }) : undefined
      }
      const list = listOf(id)
      return list && over
        ? t('drag.over', { name: list.name(id), ...list.at(String(over.id)) })
        : undefined
    },
    onDragEnd: ({ active, over }) => {
      const id = String(active.id)
      if (id.startsWith(CARRY)) {
        const target = targetOf(over?.id)
        const name = carriedName(carried(id.slice(CARRY.length)))
        return target
          ? t('drag.droppedOn', { name, target: targetName(target) })
          : t('drag.cancelled', { name })
      }
      const list = listOf(id)
      if (!list) return undefined
      return over
        ? t('drag.dropped', { name: list.name(id), ...list.at(String(over.id)) })
        : t('drag.cancelled', { name: list.name(id) })
    },
    onDragCancel: ({ active }) => {
      const id = String(active.id)
      const name = id.startsWith(CARRY)
        ? carriedName(carried(id.slice(CARRY.length)))
        : (listOf(id)?.name(id) ?? '')
      return t('drag.cancelled', { name })
    },
  }

  const carryingSet = useMemo(() => (carrying ? new Set(carrying) : null), [carrying])
  const value = useMemo(() => ({ join, carrying: carryingSet }), [join, carryingSet])
  const held = carrying ? inHand(carrying) : sorted
  return (
    <DndContextOf value={value}>
      <DndContext
        sensors={sensors}
        collisionDetection={collision}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragCancel={onDragCancel}
        accessibility={{
          announcements,
          screenReaderInstructions: { draggable: t('drag.instructions') },
        }}
      >
        {children}
        <DragOverlay dropAnimation={reduced || lastCarried ? null : DROP_ANIMATION}>
          {held}
        </DragOverlay>
      </DndContext>
    </DndContextOf>
  )
}
