import { useDraggable, useDroppable } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Check, GripVertical } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import { CARRY, INTO, useLibraryDnd } from '../model/library-dnd'
import { ROW_BODY, ROW_CARD, ROW_CONTROL, ROW_FLAT, ROW_LIBRARY_FACE } from '@/shared/ui'
import { useCardLook } from './card-look'

/**
 * The check a chosen row wears (R72's CHECKBOX, 24): filled while chosen, a ring while not, fading in
 * before the row's picture as Select starts.
 */
export function SelectCheck({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        'grid size-6 shrink-0 place-items-center rounded-pill border-2 transition-colors duration-200 ease-out motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-90 motion-safe:duration-200',
        checked ? 'border-transparent bg-selected text-selected-foreground' : 'border-input',
      )}
    >
      {checked ? <Check className="size-3.5" strokeWidth={3} /> : null}
    </span>
  )
}

/**
 * A row while Select is on (R72's SONGROW in Select, Flat's): the same card, a tap choosing it or
 * letting it go, its check before its picture; where the order is the learner's (`sortable`, the
 * folders), its handle at its end moves it by a finger, a mouse or the keyboard. In the hand, its place is an empty slot, where it would land. Its face carries it
 * (`carry`, its key: held a moment by a finger, or dragged by a mouse), with every row chosen where
 * it is chosen, into a folder or onto the bar's places; a folder's row (`into`, its id) takes what is
 * carried, lit while it is over it, and greys while it is carried itself.
 */
export function SelectRow({
  id,
  name,
  checked,
  onToggle,
  sortable,
  carry,
  into,
  face,
  tall = false,
  children,
}: {
  id: string
  /** What the row is, for its check's and its handle's names. */
  name: string
  checked: boolean
  onToggle: () => void
  sortable: boolean
  /** Its key, as its face carries it. */
  carry: string
  /** A folder's id: what is carried drops into it. */
  into?: string | undefined
  /** How its face is laid out, as the row's when read (`SONG_FACE`). */
  face?: string
  /** A song's card, 88 tall as when read. */
  tall?: boolean
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
  const { carrying } = useLibraryDnd()
  const grouped = useCardLook().style.layout === 'list'
  const carried = carrying?.has(carry) === true
  const { setNodeRef: setCarrierRef, listeners: carrierListeners } = useDraggable({
    id: `${CARRY}${carry}`,
  })
  const target = useDroppable({ id: `${INTO}${into ?? ''}`, disabled: !into || carried })
  const lit = target.isOver && carrying !== null
  return (
    <li
      ref={(node) => {
        setNodeRef(node)
        target.setNodeRef(node)
      }}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      data-dragging={isDragging ? '' : undefined}
      data-carried={carried ? '' : undefined}
      className="data-carried:opacity-50 data-dragging:*:border-dashed data-dragging:*:bg-muted data-dragging:*:*:invisible"
    >
      <div
        data-drop={lit ? '' : undefined}
        className={cn(
          grouped ? ROW_FLAT : cn(ROW_CARD, tall && 'min-h-22'),
          'hover:bg-muted data-drop:bg-selected/15 data-drop:ring-2 data-drop:ring-selected data-drop:ring-inset',
        )}
      >
        <button
          type="button"
          role="checkbox"
          aria-checked={checked}
          aria-label={t('select.toggle', { name })}
          onClick={onToggle}
          className={cn(ROW_CONTROL, '-mr-3 ml-1')}
        >
          <SelectCheck checked={checked} />
        </button>
        {/* The row's face chooses it too, as the check does: one stop for a keyboard, the check's.
            Held or dragged, it carries the row. */}
        <div
          ref={setCarrierRef}
          aria-hidden
          onClick={onToggle}
          {...carrierListeners}
          className={cn(
            ROW_BODY,
            ROW_LIBRARY_FACE,
            face,
            'cursor-pointer touch-manipulation select-none',
          )}
        >
          {children}
        </div>
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

/**
 * The row in the hand, over the list (the drag's overlay): the row it came from, lifted a shade;
 * carrying more than one (`count`), how many on a badge at its corner, as iOS Files' stack says;
 * carried by its face (`carried`), the face alone.
 */
export function RowInHand({
  checked,
  count = 1,
  carried = false,
  children,
}: {
  checked: boolean
  count?: number
  /** Carried by its face: the face alone, as wide as the face it was lifted from. */
  carried?: boolean
  children: ReactNode
}) {
  return (
    <div aria-hidden className={cn(ROW_CARD, 'relative cursor-grabbing elevation-3')}>
      {carried ? null : (
        <span className={cn(ROW_CONTROL, '-mr-3 ml-1')}>
          <SelectCheck checked={checked} />
        </span>
      )}
      <div className={ROW_BODY}>{children}</div>
      {count > 1 ? (
        <span
          data-slot="carried-count"
          className="absolute -top-2 -right-2 grid h-6 min-w-6 place-items-center rounded-pill bg-selected px-1.5 text-xs font-semibold text-selected-foreground tabular-nums"
        >
          {count}
        </span>
      ) : null}
    </div>
  )
}
