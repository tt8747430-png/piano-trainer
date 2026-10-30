import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  ArrowDown,
  ArrowUp,
  CornerDownRight,
  Ellipsis,
  GripVertical,
  Trash2,
  type LucideIcon,
} from 'lucide-react'
import { useState, type ReactElement, type ReactNode } from 'react'
import { useRender } from '@base-ui/react/use-render'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import { ActionMenu, say, type MenuAction } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import {
  rowPlace,
  withRowAt,
  withRowMoved,
  withRowRemoved,
  type RowOrder,
} from '../model/row-order'

/** A row of a document's list: its name, a line under it, and where it opens. */
export interface DocRow {
  readonly key: string
  readonly title: string
  readonly detail?: string | undefined
  /** A router `Link` to the item's editor; a row without one is named alone. */
  readonly link?: ReactElement | undefined
  /** Its tile's paint (`PAINT[…]`'s fill and ink), as the learner's row has it; muted without one. */
  readonly paint?: string | undefined
  /** A row that is not a lesson (a chapter's Check): its tile's picture in place of its number. */
  readonly icon?: LucideIcon | undefined
}

/** A group of rows: a course's lessons, a chapter's steps; what stands over it and under it. */
export interface RowGroup {
  readonly key: string
  /** The list's name, for a screen reader. */
  readonly label: string
  readonly rows: readonly DocRow[]
  readonly head?: ReactNode
  readonly foot?: ReactNode
  /** Said where the group has no rows. */
  readonly empty?: string
  /** A group that is a part of the page (a chapter): its region's name. */
  readonly region?: string
}

function RowName({ title, detail, link }: Pick<DocRow, 'title' | 'detail' | 'link'>) {
  const face = (
    <>
      <span className="line-clamp-2 font-semibold text-pretty">{title}</span>
      {detail ? <span className="text-sm text-muted-foreground">{detail}</span> : null}
    </>
  )
  return useRender({
    defaultTagName: 'span',
    render: link,
    props: {
      className: `flex min-h-11 min-w-0 flex-1 flex-col justify-center py-2${link ? ' hover:underline' : ''}`,
      children: face,
    },
  })
}

function SortableRow({
  row,
  number,
  canMove,
  onMove,
  moves,
  onRemove,
}: {
  row: DocRow
  number: number
  canMove: { up: boolean; down: boolean }
  onMove: (by: -1 | 1) => void
  /** Onto another group's end (another chapter), one action each. */
  moves: readonly MenuAction[]
  onRemove: () => void
}) {
  const { t } = useTranslation('learn')
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.key })
  const Icon = row.icon
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      data-dragging={isDragging ? '' : undefined}
      className="group/row relative flex min-h-16 items-center gap-2 bg-card py-1 pr-1 data-dragging:z-10 data-dragging:rounded-xl data-dragging:shadow-lg"
    >
      <button
        ref={setActivatorNodeRef}
        type="button"
        aria-label={t('edit.doc.drag', { title: row.title })}
        title={t('edit.doc.drag', { title: row.title })}
        className="grid size-11 shrink-0 cursor-grab touch-none place-items-center rounded-xl text-muted-foreground transition-colors duration-150 ease-out hover:bg-muted active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical aria-hidden className="size-4" />
      </button>
      {/* Its tile, as the learner's row: the lesson's number in its level's paint, a Check's picture. */}
      <span
        aria-hidden
        className={cn(
          'grid size-10 shrink-0 place-items-center rounded-full font-semibold tabular-nums',
          row.paint ?? 'bg-muted text-muted-foreground',
          Icon && 'rounded-xl',
        )}
      >
        {Icon ? <Icon className="size-5" strokeWidth={1.75} /> : number}
      </span>
      <RowName title={row.title} detail={row.detail} link={row.link} />
      <ActionMenu
        label={t('edit.doc.rowMenu', { title: row.title })}
        align="end"
        trigger={<Ellipsis aria-hidden />}
        render={
          <Button
            variant="ghost"
            size="icon"
            className="size-11 shrink-0"
            aria-label={t('edit.doc.rowMenu', { title: row.title })}
            title={t('edit.doc.rowMenu', { title: row.title })}
          />
        }
        actions={[
          {
            key: 'up',
            label: t('edit.order.moveUp', { title: row.title }),
            icon: ArrowUp,
            disabled: !canMove.up,
            onSelect: () => onMove(-1),
          },
          {
            key: 'down',
            label: t('edit.order.moveDown', { title: row.title }),
            icon: ArrowDown,
            disabled: !canMove.down,
            onSelect: () => onMove(1),
          },
          {
            key: 'remove',
            label: t('edit.order.remove', { title: row.title }),
            icon: Trash2,
            destructive: true,
            onSelect: onRemove,
          },
          ...moves,
        ]}
      />
    </li>
  )
}

/** A group's list: where a row is dropped, its rows sortable, an empty group a place to drop too. */
function GroupList({
  group,
  rows,
  children,
}: {
  group: RowGroup
  rows: readonly string[]
  children: ReactNode
}) {
  const { setNodeRef, isOver } = useDroppable({ id: group.key })
  return (
    <SortableContext id={group.key} items={[...rows]} strategy={verticalListSortingStrategy}>
      <ol
        ref={setNodeRef}
        aria-label={group.label}
        data-over={isOver ? '' : undefined}
        className={cn(
          'flex min-h-16 flex-col divide-y divide-hairline card transition-colors duration-150 ease-out data-over:ring-2 data-over:ring-primary/60',
        )}
      >
        {children}
      </ol>
    </SortableContext>
  )
}

/**
 * Rows of a document an editor puts in order (round 21: a course's lessons, a journey's chapters'
 * steps): each dragged by its handle (a mouse, a finger held, or Space and the arrows), within its
 * group or onto another; its menu moves it up or down (onto the next group from an edge) or removes
 * it (said, with Undo). No up and down buttons: the document reads as a list.
 */
export function RowGroups({
  groups,
  onChange,
}: {
  groups: readonly RowGroup[]
  /** The rows' keys in their new order, group by group. */
  onChange: (order: RowOrder) => void
}) {
  const { t } = useTranslation('learn')
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )
  const given: RowOrder = groups.map((group) => ({
    key: group.key,
    rows: group.rows.map((row) => row.key),
  }))
  // While a row is in the hand, where it would land: across groups as it is dragged over them.
  const [dragged, setDragged] = useState<RowOrder | null>(null)
  const order = dragged ?? given
  const rows = new Map(groups.flatMap((group) => group.rows.map((row) => [row.key, row])))
  const groupOf = (id: UniqueIdentifier): number => {
    const key = String(id)
    const byGroup = order.findIndex((group) => group.key === key)
    return byGroup !== -1 ? byGroup : (rowPlace(order, key)?.group ?? -1)
  }
  const over = ({ active, over: target }: DragOverEvent) => {
    if (!target) return
    const from = groupOf(active.id)
    const to = groupOf(target.id)
    if (from === -1 || to === -1 || from === to) return
    const at = rowPlace(order, String(target.id))?.at ?? order[to]?.rows.length ?? 0
    setDragged(withRowAt(order, String(active.id), to, at))
  }
  const end = ({ active, over: target }: DragEndEvent) => {
    const now = order
    setDragged(null)
    if (!target) return
    const to = groupOf(target.id)
    const place = rowPlace(now, String(target.id))
    const next =
      to === -1
        ? now
        : withRowAt(now, String(active.id), to, place?.at ?? now[to]?.rows.length ?? 0)
    if (JSON.stringify(next) !== JSON.stringify(given)) onChange(next)
  }
  const remove = (row: DocRow) => {
    onChange(withRowRemoved(given, row.key))
    say(t('edit.order.removed', { title: row.title }), {
      label: t('edit.order.undo'),
      onClick: () => onChange(given),
    })
  }
  // Rows numbered through the document, group after group.
  const firsts = order.map((_, g) =>
    order.slice(0, g).reduce((sum, each) => sum + each.rows.length, 0),
  )
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={() => setDragged(given)}
      onDragOver={over}
      onDragEnd={end}
      onDragCancel={() => setDragged(null)}
    >
      {groups.map((group, g) => {
        const keys = order[g]?.rows ?? []
        const Part = group.region ? 'section' : 'div'
        return (
          <Part key={group.key} aria-label={group.region} className="flex flex-col gap-2">
            {group.head}
            <GroupList group={group} rows={keys}>
              {keys.length === 0 && group.empty ? (
                <li className="flex min-h-16 items-center px-4 text-sm text-muted-foreground">
                  {group.empty}
                </li>
              ) : null}
              {keys.map((key, at) => {
                const row = rows.get(key)
                if (!row) return null
                return (
                  <SortableRow
                    key={key}
                    row={row}
                    number={(firsts[g] ?? 0) + at + 1}
                    canMove={{
                      up: withRowMoved(given, key, -1) !== null,
                      down: withRowMoved(given, key, 1) !== null,
                    }}
                    onMove={(by) => {
                      const moved = withRowMoved(given, key, by)
                      if (moved) onChange(moved)
                    }}
                    moves={groups.flatMap((other, o) =>
                      o === g || !other.region
                        ? []
                        : [
                            {
                              key: `to-${other.key}`,
                              group: t('edit.order.moveTo'),
                              label: other.region,
                              icon: CornerDownRight,
                              onSelect: () =>
                                onChange(withRowAt(given, key, o, given[o]?.rows.length ?? 0)),
                            },
                          ],
                    )}
                    onRemove={() => remove(row)}
                  />
                )
              })}
            </GroupList>
            {group.foot}
          </Part>
        )
      })}
    </DndContext>
  )
}
