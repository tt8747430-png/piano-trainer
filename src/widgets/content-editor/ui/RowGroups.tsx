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
import { Ellipsis, GripVertical, Trash2, type LucideIcon } from 'lucide-react'
import { useState, type ReactElement, type ReactNode } from 'react'
import { useRender } from '@base-ui/react/use-render'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import { ActionMenu, say } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { rowPlace, withGroupAt, withRowAt, withRowRemoved, type RowOrder } from '../model/row-order'

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
  /** What else its heading's menu holds after Remove (a chapter's). */
  readonly onRemove?: () => void
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

/** A row's drag handle and a group's: held and moved (a mouse, a finger held, or Space and the arrows). */
function Handle({
  label,
  handle,
}: {
  label: string
  handle: Pick<ReturnType<typeof useSortable>, 'attributes' | 'listeners' | 'setActivatorNodeRef'>
}) {
  const { attributes, listeners, setActivatorNodeRef } = handle
  return (
    <button
      ref={setActivatorNodeRef}
      type="button"
      aria-label={label}
      title={label}
      className="grid size-11 shrink-0 cursor-grab touch-none place-items-center rounded-xl text-muted-foreground transition-colors duration-150 ease-out hover:bg-muted active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      <GripVertical aria-hidden className="size-4" />
    </button>
  )
}

/** A row's menu, named for the row: what is not done by dragging it (Remove). */
function RowMenu({ title, onRemove }: { title: string; onRemove: () => void }) {
  const { t } = useTranslation('learn')
  const label = t('edit.doc.rowMenu', { title })
  return (
    <ActionMenu
      label={label}
      align="end"
      trigger={<Ellipsis aria-hidden />}
      render={
        <Button
          variant="ghost"
          size="icon"
          className="size-11 shrink-0"
          aria-label={label}
          title={label}
        />
      }
      actions={[
        {
          key: 'remove',
          label: t('edit.order.remove'),
          icon: Trash2,
          destructive: true,
          onSelect: onRemove,
        },
      ]}
    />
  )
}

function SortableRow({
  row,
  number,
  onRemove,
}: {
  row: DocRow
  number: number
  /** Its menu's Remove; none where the rows are only put in order. */
  onRemove: (() => void) | undefined
}) {
  const { t } = useTranslation('learn')
  const sortable = useSortable({ id: row.key })
  const { setNodeRef, transform, transition, isDragging } = sortable
  const Icon = row.icon
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      data-dragging={isDragging ? '' : undefined}
      className="group/row relative flex min-h-16 items-center gap-2 bg-card py-1 pr-1 first:rounded-t-3xl last:rounded-b-3xl data-dragging:z-10 data-dragging:rounded-xl data-dragging:shadow-lg"
    >
      <Handle label={t('edit.doc.drag', { title: row.title })} handle={sortable} />
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
      {onRemove ? <RowMenu title={row.title} onRemove={onRemove} /> : null}
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
        className="flex min-h-16 flex-col divide-y divide-hairline card transition-colors duration-150 ease-out data-over:ring-2 data-over:ring-primary/60"
      >
        {children}
      </ol>
    </SortableContext>
  )
}

/** A group's own place among the groups, dragged by the handle beside its heading (a chapter). */
function SortableGroup({
  group,
  sortable: sorts,
  children,
}: {
  group: RowGroup
  sortable: boolean
  children: (handle: ReactNode) => ReactNode
}) {
  const { t } = useTranslation('learn')
  const sortable = useSortable({ id: groupId(group.key), disabled: !sorts })
  const { setNodeRef, transform, transition, isDragging } = sortable
  const Part = group.region ? 'section' : 'div'
  return (
    <Part
      ref={setNodeRef}
      aria-label={group.region}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      data-dragging={isDragging ? '' : undefined}
      className="flex flex-col gap-2 rounded-2xl data-dragging:z-10 data-dragging:bg-background data-dragging:shadow-lg"
    >
      {children(
        sorts ? (
          <Handle
            label={t('edit.doc.drag', { title: group.region ?? group.label })}
            handle={sortable}
          />
        ) : null,
      )}
    </Part>
  )
}

/** A group's id among the draggables, apart from its rows' and its list's own. */
const groupId = (key: string) => `group:${key}`
const groupKeyOf = (id: UniqueIdentifier) =>
  String(id).startsWith('group:') ? String(id).slice('group:'.length) : null

/**
 * Rows of a document an editor puts in order (a course's lessons, a level's chapters' steps), each
 * dragged by its handle (a mouse, a finger held, or Space and the arrows) within its group or onto
 * another; where there are several groups (chapters), each group dragged by the handle beside its
 * heading. A row's menu removes it (said, with Undo). Nothing is moved by a menu: dragging is the
 * one way.
 */
export function RowGroups({
  groups,
  onChange,
  fixed = false,
}: {
  groups: readonly RowGroup[]
  /** The groups and their rows' keys in their new order. */
  onChange: (order: RowOrder) => void
  /** The groups are given (a course's shelf): they stay where they are, each row in its own, and
   * the rows are only put in order (no Remove). */
  fixed?: boolean
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
  // While something is in the hand, where it would land: a row across groups as it is dragged over them.
  const [dragged, setDragged] = useState<RowOrder | null>(null)
  const order = dragged ?? given
  const sortsGroups = groups.length > 1 && !fixed
  const rows = new Map(groups.flatMap((group) => group.rows.map((row) => [row.key, row])))
  const byKey = new Map(groups.map((group) => [group.key, group]))
  const groupOf = (id: UniqueIdentifier): number => {
    const key = groupKeyOf(id) ?? String(id)
    const byGroup = order.findIndex((group) => group.key === key)
    return byGroup !== -1 ? byGroup : (rowPlace(order, key)?.group ?? -1)
  }
  const over = ({ active, over: target }: DragOverEvent) => {
    if (!target || groupKeyOf(active.id)) return
    const from = groupOf(active.id)
    const to = groupOf(target.id)
    if (from === -1 || to === -1 || from === to || fixed) return
    const at = rowPlace(order, String(target.id))?.at ?? order[to]?.rows.length ?? 0
    setDragged(withRowAt(order, String(active.id), to, at))
  }
  const end = ({ active, over: target }: DragEndEvent) => {
    const now = order
    setDragged(null)
    if (!target) return
    const to = groupOf(target.id)
    const moving = groupKeyOf(active.id)
    const next = moving
      ? to === -1
        ? now
        : withGroupAt(now, moving, to)
      : to === -1 || (fixed && to !== groupOf(active.id))
        ? now
        : withRowAt(
            now,
            String(active.id),
            to,
            rowPlace(now, String(target.id))?.at ?? now[to]?.rows.length ?? 0,
          )
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
      <SortableContext
        items={order.map((group) => groupId(group.key))}
        strategy={verticalListSortingStrategy}
      >
        {order.map(({ key, rows: keys }, g) => {
          const group = byKey.get(key)
          if (!group) return null
          return (
            <SortableGroup key={key} group={group} sortable={sortsGroups}>
              {(handle) => (
                <>
                  {handle || group.head ? (
                    <div className="flex items-end gap-1">
                      {handle}
                      <div className="min-w-0 flex-1">{group.head}</div>
                    </div>
                  ) : null}
                  <GroupList group={group} rows={keys}>
                    {keys.length === 0 && group.empty ? (
                      <li className="flex min-h-16 items-center px-4 text-sm text-muted-foreground">
                        {group.empty}
                      </li>
                    ) : null}
                    {keys.map((rowKey, at) => {
                      const row = rows.get(rowKey)
                      if (!row) return null
                      return (
                        <SortableRow
                          key={rowKey}
                          row={row}
                          number={(firsts[g] ?? 0) + at + 1}
                          onRemove={fixed ? undefined : () => remove(row)}
                        />
                      )
                    })}
                  </GroupList>
                  {group.foot}
                </>
              )}
            </SortableGroup>
          )
        })}
      </SortableContext>
    </DndContext>
  )
}
