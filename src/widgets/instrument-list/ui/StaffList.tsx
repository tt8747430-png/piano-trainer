import { DndContext } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Ellipsis, Eye, EyeOff, GripVertical, PencilLine, Plus } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn, useSortableList } from '@/shared/lib'
import { ActionMenu, type MenuAction } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Input } from '@/shared/ui/primitives/input'
import { Switch } from '@/shared/ui/primitives/switch'

/** One instrument of the score (A40, Flat's Instruments): its staves heard, shown, and its ⋯. */
export interface StaffRow {
  readonly key: string
  readonly name: string
  /** Dragged by its handle to another place among the others that move; the piano stays put. */
  readonly movable: boolean
  /** It alone is heard (Flat's S). */
  readonly solo: boolean
  readonly shown: boolean
  readonly onSolo: () => void
  readonly onShow: (shown: boolean) => void
  /** Renamed in place, from its ⋯; none where it has no name of its own to give (the piano). */
  readonly onRename?: ((name: string) => void) | undefined
  /** The rest of its ⋯: Change instrument's choices, Delete. */
  readonly actions: readonly MenuAction[]
}

const ROW = 'flex min-h-14 items-center gap-1 border-b border-hairline py-1 pr-1 last:border-b-0'

/** A row's name, or the field it is renamed in: Enter or leaving it keeps the name, Escape drops it. */
function RowName({
  name,
  renaming,
  onRename,
  onDone,
}: {
  name: string
  renaming: boolean
  onRename?: ((name: string) => void) | undefined
  onDone: () => void
}) {
  const { t } = useTranslation('editor')
  const [text, setText] = useState(name)
  if (!renaming || !onRename) return <span className="min-w-0 flex-1 truncate">{name}</span>
  const keep = () => {
    if (text.trim() !== name) onRename(text)
    onDone()
  }
  return (
    <Input
      autoFocus
      aria-label={t('instruments.name')}
      value={text}
      onChange={(event) => setText(event.target.value)}
      onBlur={keep}
      onKeyDown={(event) => {
        if (event.key === 'Enter') keep()
        if (event.key === 'Escape') onDone()
      }}
      className="h-10 min-w-0 flex-1"
    />
  )
}

/** A row's S, eye and ⋯, after its name. */
function RowTools({ row, onRename }: { row: StaffRow; onRename: () => void }) {
  const { t } = useTranslation('editor')
  const more = t('instruments.more', { staff: row.name })
  const show = t(row.shown ? 'instruments.hide' : 'instruments.show', { staff: row.name })
  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-pressed={row.solo}
        aria-label={t('instruments.solo', { staff: row.name })}
        title={t('instruments.solo', { staff: row.name })}
        onClick={row.onSolo}
        className={cn(
          'size-11 rounded-pill text-sm font-bold text-muted-foreground',
          row.solo && 'bg-chosen text-foreground',
        )}
      >
        S
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-pressed={row.shown}
        aria-label={show}
        title={show}
        onClick={() => row.onShow(!row.shown)}
        className={cn('size-11 rounded-pill', !row.shown && 'text-muted-foreground')}
      >
        {row.shown ? <Eye aria-hidden /> : <EyeOff aria-hidden />}
      </Button>
      <ActionMenu
        label={more}
        align="end"
        trigger={<Ellipsis aria-hidden />}
        render={
          <Button
            variant="ghost"
            size="icon"
            className="size-11 rounded-pill"
            aria-label={more}
            title={more}
          />
        }
        actions={[
          ...(row.onRename
            ? [
                {
                  key: 'rename',
                  label: t('instruments.rename'),
                  icon: PencilLine,
                  onSelect: onRename,
                },
              ]
            : []),
          ...row.actions,
        ]}
      />
    </>
  )
}

/** A staff's row dragged by its handle (held a moment on a phone, Space and the arrows on a keyboard). */
function SortableRow({ row, children }: { row: StaffRow; children: ReactNode }) {
  const { t } = useTranslation('editor')
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: row.key,
  })
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn(ROW, 'bg-card', isDragging && 'relative z-10 shadow-md')}
    >
      <button
        type="button"
        aria-label={t('instruments.move', { staff: row.name })}
        title={t('instruments.move', { staff: row.name })}
        className="grid size-11 shrink-0 cursor-grab touch-none place-items-center text-muted-foreground"
        {...attributes}
        {...listeners}
      >
        <GripVertical aria-hidden className="size-5" />
      </button>
      {children}
    </li>
  )
}

/**
 * A score's instruments as Flat lists them (A40): All over them (every staff heard, or none) beside
 * the sort; each instrument a row with its drag handle, name, S (solo), eye (shown) and ⋯ (Rename,
 * Change instrument, Delete); New instrument under them. The single staves move by their handles,
 * the piano's grand staff stays under them.
 */
export function StaffList({
  label,
  rows,
  all,
  onAll,
  onMove,
  sort,
  onNew,
}: {
  /** The list's name, for a screen reader. */
  label: string
  rows: readonly StaffRow[]
  all: boolean
  onAll: (all: boolean) => void
  /** The movable rows' keys in their new order. */
  onMove: (order: string[]) => void
  sort: ReactNode
  /** New instrument's menu of what can be added. */
  onNew: readonly MenuAction[]
}) {
  const { t } = useTranslation('editor')
  const [renaming, setRenaming] = useState<string | null>(null)
  const movable = rows.filter((row) => row.movable)
  const fixed = rows.filter((row) => !row.movable)
  const sortable = useSortableList({
    ids: movable.map((row) => row.key),
    onDrop: (next) => onMove(next),
  })
  const byKey = new Map(rows.map((row) => [row.key, row]))
  const body = (row: StaffRow) => (
    <>
      <RowName
        key={renaming === row.key ? 'renaming' : 'name'}
        name={row.name}
        renaming={renaming === row.key}
        onRename={row.onRename}
        onDone={() => setRenaming(null)}
      />
      <RowTools row={row} onRename={() => setRenaming(row.key)} />
    </>
  )
  return (
    <div className="flex flex-col gap-3">
      <div className="flex min-h-12 items-center gap-3">
        <label className="flex flex-1 items-center gap-3 font-semibold">
          <Switch
            checked={all}
            onCheckedChange={(on) => onAll(on)}
            aria-label={t('instruments.playAll')}
          />
          <span aria-hidden>{t('instruments.all')}</span>
        </label>
        {sort}
      </div>
      <DndContext {...sortable.dnd} modifiers={[restrictToVerticalAxis]}>
        <SortableContext items={[...sortable.items]} strategy={verticalListSortingStrategy}>
          <ul aria-label={label} className="flex flex-col card pl-1">
            {sortable.items.map((key) => {
              const row = byKey.get(key)
              return row ? (
                <SortableRow key={key} row={row}>
                  {body(row)}
                </SortableRow>
              ) : null
            })}
            {fixed.map((row) => (
              <li key={row.key} className={cn(ROW, 'pl-3')}>
                {body(row)}
              </li>
            ))}
          </ul>
        </SortableContext>
      </DndContext>
      <ActionMenu
        label={t('instruments.new')}
        trigger={
          <>
            <Plus aria-hidden />
            {t('instruments.new')}
          </>
        }
        actions={onNew}
      />
    </div>
  )
}
