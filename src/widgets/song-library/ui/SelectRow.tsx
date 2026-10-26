import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Check, GripVertical } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import { ROW_BODY, ROW_CARD, ROW_CONTROL } from './row-class'

/** The check a chosen row wears, umber while chosen (the neutral chosen), a ring while not. */
export function SelectCheck({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        'grid size-7 shrink-0 place-items-center rounded-full border transition-colors duration-200 ease-out',
        checked ? 'border-transparent bg-selected text-selected-foreground' : 'border-input',
      )}
    >
      {checked ? <Check className="size-4" strokeWidth={3} /> : null}
    </span>
  )
}

/**
 * A row while Select is on (Mindscape's `SelectRow`): a tap chooses it or lets it go, its check at
 * its start; in the Manual order, its handle at its end moves it by a finger, a mouse or the keyboard
 * (`sortable`). In the hand, its place is an empty slot, where it would land.
 */
export function SelectRow({
  id,
  name,
  checked,
  onToggle,
  sortable,
  children,
}: {
  id: string
  /** What the row is, for its check's and its handle's names. */
  name: string
  checked: boolean
  onToggle: () => void
  sortable: boolean
  /** Its face. */
  children: ReactNode
}) {
  const { t } = useTranslation('songs')
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !sortable, attributes: { roleDescription: t('drag.role') } })
  const move = t('drag.move', { name })
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      data-dragging={isDragging ? '' : undefined}
      className="data-dragging:*:border-dashed data-dragging:*:bg-muted data-dragging:*:*:invisible"
    >
      <div className={cn(ROW_CARD, 'hover:bg-muted', checked && 'ring-2 ring-selected ring-inset')}>
        <button
          type="button"
          role="checkbox"
          aria-checked={checked}
          aria-label={t('select.toggle', { name })}
          onClick={onToggle}
          className={ROW_BODY}
        >
          <SelectCheck checked={checked} />
          {children}
        </button>
        {sortable ? (
          <button
            ref={setActivatorNodeRef}
            type="button"
            {...attributes}
            {...listeners}
            aria-label={move}
            title={move}
            className={cn(ROW_CONTROL, 'cursor-grab touch-none active:cursor-grabbing')}
          >
            <GripVertical aria-hidden />
          </button>
        ) : null}
      </div>
    </li>
  )
}

/** The row in the hand, over the list (the drag's overlay): the row it came from, lifted a shade. */
export function RowInHand({ checked, children }: { checked: boolean; children: ReactNode }) {
  return (
    <div
      aria-hidden
      className={cn(
        ROW_CARD,
        'cursor-grabbing elevation-3',
        checked && 'ring-2 ring-selected ring-inset',
      )}
    >
      <div className={ROW_BODY}>
        <SelectCheck checked={checked} />
        {children}
      </div>
      <span className={ROW_CONTROL}>
        <GripVertical />
      </span>
    </div>
  )
}
