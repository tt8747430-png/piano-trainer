import { LibraryTile } from './LibraryTile'
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  pointerWithin,
  TouchSensor,
  useSensor,
  useSensors,
  type CollisionDetection,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Ellipsis, Eye, EyeOff, GripVertical, PencilLine, Trash2 } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  deleteFolder,
  isLibraryFolderId,
  orderItems,
  orderPlaces,
  setPlaceHidden,
  usePracticeLibraryStoreApi,
  type ArrangedPlace,
} from '@/entities/practice-library'
import { arrangeLibrary } from '@/features/manage-practice-library'
import { cn, useMediaQuery } from '@/shared/lib'
import { ActionMenu, confirm } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import {
  arrangeDrop,
  arrangeLandsOn,
  placeDragId,
  readArrangeId,
  rowDragId,
} from '../model/arrange-dnd'
import type { LibraryItem } from '../model/library-view'
import type { LibraryKind } from '../model/library-words'
import type { ArrangeSheet } from '../model/use-arranged-library'

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'
const DROP_ANIMATION = { duration: 200, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }

/** Only what the thing in hand may land among, the one under the pointer first (memory-palaces'). */
const scoped: CollisionDetection = (args) => {
  const active = readArrangeId(args.active.id)
  const within = {
    ...args,
    droppableContainers: args.droppableContainers.filter((container) => {
      const over = readArrangeId(container.id)
      return active !== null && over !== null && arrangeLandsOn(active, over)
    }),
  }
  const under = pointerWithin(within)
  return under.length > 0 ? under : closestCenter(within)
}

const HANDLE =
  'grid size-11 shrink-0 cursor-grab touch-none place-items-center rounded-control text-muted-foreground transition-colors duration-200 ease-out hover:bg-muted active:cursor-grabbing'

/**
 * A place in Edit: its handle (the one thing its drag starts from), its head beside it, its rows
 * under it; its box moves aside while another is dragged, and in hand its slot stays empty.
 */
function SortablePlace({
  id,
  label,
  head,
  children,
}: {
  id: string
  label: string
  head: ReactNode
  children: ReactNode
}) {
  const {
    attributes,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn('flex min-w-0 flex-col gap-2', isDragging && 'opacity-0')}
    >
      <div className="flex items-center gap-1">
        <button
          ref={setActivatorNodeRef}
          type="button"
          aria-label={label}
          title={label}
          className={HANDLE}
          {...attributes}
          {...listeners}
        >
          <GripVertical aria-hidden className="size-5" />
        </button>
        {head}
      </div>
      {children}
    </li>
  )
}

/** A row in Edit: its picture and name, its handle where its More stood, so nothing else moves. */
function SortableRow({ id, item }: { id: string; item: LibraryItem }) {
  const { t } = useTranslation('practice')
  const {
    attributes,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })
  const label = t('library.edit.moveRow', { name: item.name })
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn('min-w-0', isDragging && 'opacity-0')}
    >
      <div className="flex min-h-14 items-center gap-1 rounded-card bg-card pe-1">
        <EditRowFace item={item} />
        <button
          ref={setActivatorNodeRef}
          type="button"
          aria-label={label}
          title={label}
          className={HANDLE}
          {...attributes}
          {...listeners}
        >
          <GripVertical aria-hidden className="size-5" />
        </button>
      </div>
    </li>
  )
}

/**
 * A library in Edit (R32, Songs' Select and Apple's lists): each place (a book, a style, the
 * learner's folder, a hidden one marked) with its handle and its More (Rename…, Hide or Show, and for
 * a folder of the learner's Delete folder…, asking first), its rows under it each with its handle;
 * New folder at the foot. One drag context: a place lands among places, a row within its place.
 */
export function ArrangeList({
  kind,
  places,
  items,
  onSheet,
}: {
  kind: LibraryKind
  places: readonly ArrangedPlace[]
  items: readonly LibraryItem[]
  onSheet: (sheet: ArrangeSheet) => void
}) {
  const { t } = useTranslation('practice')
  const store = usePracticeLibraryStoreApi()
  const reduced = useMediaQuery(REDUCED_MOTION)
  const [inHand, setInHand] = useState<string | null>(null)
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )
  const rowsOf = (place: string) =>
    items.filter((item) => item.group === place).map((item) => item.id)
  const change = (apply: Parameters<typeof arrangeLibrary>[2]) => arrangeLibrary(store, kind, apply)
  const askDelete = async (place: ArrangedPlace) => {
    if (!isLibraryFolderId(place.id)) return
    const id = place.id
    const yes = await confirm({
      title: t('library.edit.deleteFolder.title', { name: place.name }),
      body: t('library.edit.deleteFolder.body'),
      action: t('library.edit.deleteFolder.action'),
      destructive: true,
    })
    if (yes) change((each) => deleteFolder(each, id))
  }
  const held = readArrangeId(inHand)
  const heldPlace = held?.kind === 'place' ? places.find((place) => place.id === held.place) : null
  const heldRow = held?.kind === 'row' ? items.find((item) => item.id === held.id) : null
  return (
    <div className="flex flex-col gap-4">
      <DndContext
        sensors={sensors}
        collisionDetection={scoped}
        onDragStart={({ active }) => setInHand(String(active.id))}
        onDragCancel={() => setInHand(null)}
        onDragEnd={({ active, over }) => {
          setInHand(null)
          const drop = arrangeDrop(
            active.id,
            over?.id,
            places.map((place) => place.id),
            rowsOf,
          )
          if (drop?.kind === 'places') change((each) => orderPlaces(each, drop.order))
          else if (drop?.kind === 'rows') change((each) => orderItems(each, drop.place, drop.order))
        }}
      >
        <SortableContext
          items={places.map((place) => placeDragId(place.id))}
          strategy={verticalListSortingStrategy}
        >
          <ul aria-label={t('library.edit.places')} className="flex flex-col gap-5">
            {places.map((place) => {
              const rows = items.filter((item) => item.group === place.id)
              return (
                <SortablePlace
                  key={place.id}
                  id={placeDragId(place.id)}
                  label={t('library.edit.movePlace', { name: place.name })}
                  head={
                    <>
                      <h2 className="min-w-0 flex-1 font-sans text-base font-semibold break-words">
                        {place.name}
                        {place.hidden ? (
                          <span className="ms-2 text-sm font-normal text-muted-foreground">
                            {t('library.edit.hiddenPlace')}
                          </span>
                        ) : null}
                      </h2>
                      <ActionMenu
                        label={t('library.edit.placeMenu', { name: place.name })}
                        align="end"
                        trigger={<Ellipsis aria-hidden />}
                        render={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-11"
                            aria-label={t('library.edit.placeMenu', { name: place.name })}
                            title={t('library.edit.placeMenu', { name: place.name })}
                          />
                        }
                        actions={[
                          {
                            key: 'rename',
                            label: t('library.edit.rename'),
                            icon: PencilLine,
                            onSelect: () =>
                              onSheet({ kind: 'renamePlace', id: place.id, name: place.name }),
                          },
                          place.hidden
                            ? {
                                key: 'show',
                                label: t('library.edit.show'),
                                icon: Eye,
                                onSelect: () =>
                                  change((each) => setPlaceHidden(each, place.id, false)),
                              }
                            : {
                                key: 'hide',
                                label: t('library.edit.hide'),
                                icon: EyeOff,
                                onSelect: () =>
                                  change((each) => setPlaceHidden(each, place.id, true)),
                              },
                          ...(place.builtIn
                            ? []
                            : [
                                {
                                  key: 'delete',
                                  label: t('library.edit.deleteFolder.action'),
                                  icon: Trash2,
                                  destructive: true,
                                  onSelect: () => void askDelete(place),
                                },
                              ]),
                        ]}
                      />
                    </>
                  }
                >
                  {rows.length > 0 ? (
                    <SortableContext
                      items={rows.map((row) => rowDragId(place.id, row.id))}
                      strategy={verticalListSortingStrategy}
                    >
                      <ul className="flex flex-col gap-1">
                        {rows.map((row) => (
                          <SortableRow key={row.id} id={rowDragId(place.id, row.id)} item={row} />
                        ))}
                      </ul>
                    </SortableContext>
                  ) : (
                    <p className="px-3 text-sm text-muted-foreground">
                      {t('library.edit.emptyPlace')}
                    </p>
                  )}
                </SortablePlace>
              )
            })}
          </ul>
        </SortableContext>
        <DragOverlay dropAnimation={reduced ? null : DROP_ANIMATION}>
          {heldRow && held?.kind === 'row' ? (
            <div className="elevation-3 rounded-card">
              <EditRowFace item={heldRow} />
            </div>
          ) : heldPlace ? (
            <div className="flex min-h-12 items-center card px-4 font-semibold elevation-3">
              {heldPlace.name}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

/** A row in hand, drawn as itself, lifted. */
function EditRowFace({ item }: { item: LibraryItem }) {
  const { picture } = item
  return (
    <div className="flex min-h-14 min-w-0 flex-1 items-center gap-3 rounded-card bg-card px-3">
      <LibraryTile picture={picture} />
      <span className="min-w-0 flex-1 font-semibold">{item.name}</span>
    </div>
  )
}
