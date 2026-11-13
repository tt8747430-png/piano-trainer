import { DndContext } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Minus, Plus, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  barAvailable,
  barCanShrink,
  barHasRoom,
  type BarAct,
  type BarSurface,
} from '@/entities/settings'
import { cn, useSortableList } from '@/shared/lib'
import { ActionRow, SettingsGroup } from '@/shared/ui'
import { BAR_ICONS } from '../model/bar-icons'

/** The round mark at a row's start: a red − takes the act off, a green + puts it on (iOS's edit list). */
function EditMark({
  kind,
  label,
  disabled,
  title,
  onClick,
}: {
  kind: 'remove' | 'add'
  label: string
  disabled: boolean
  title?: string | undefined
  onClick: () => void
}) {
  const Icon = kind === 'remove' ? Minus : Plus
  return (
    <button
      type="button"
      aria-label={label}
      title={title}
      disabled={disabled}
      onClick={onClick}
      className="grid size-11 flex-none place-items-center disabled:opacity-40"
    >
      <span
        aria-hidden
        className={cn(
          'grid size-5.5 place-items-center rounded-pill text-white',
          kind === 'remove' ? 'bg-destructive' : 'bg-paint-full-grass',
        )}
      >
        <Icon className="size-3.5" strokeWidth={3} />
      </span>
    </button>
  )
}

/** An act's icon and name, the row's middle. */
function ActName({
  icon: Icon,
  label,
  muted,
}: {
  icon: LucideIcon
  label: string
  muted?: boolean
}) {
  return (
    <span
      className={cn('flex min-w-0 flex-1 items-center gap-3', muted && 'text-muted-foreground')}
    >
      <Icon aria-hidden className="size-5 flex-none" />
      <span className="truncate">{label}</span>
    </span>
  )
}

/** An act on the bar: its − at the start, its name, its handle at the end to drag it in order. */
function OnRow({
  act,
  icon,
  label,
  canRemove,
  onRemove,
}: {
  act: BarAct
  icon: LucideIcon
  label: string
  canRemove: boolean
  onRemove: () => void
}) {
  const { t } = useTranslation('settings')
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: act,
  })
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn(
        'relative flex min-h-13 items-center gap-1 bg-card py-1 pl-1 not-last:border-b not-last:border-hairline',
        isDragging && 'z-10 shadow-md',
      )}
    >
      <EditMark
        kind="remove"
        label={t('bars.remove', { act: label })}
        title={canRemove ? undefined : t('bars.keepOne')}
        disabled={!canRemove}
        onClick={onRemove}
      />
      <ActName icon={icon} label={label} />
      <button
        type="button"
        aria-label={t('bars.move', { act: label })}
        className="grid size-11 flex-none touch-none place-items-center text-muted-foreground"
        {...attributes}
        {...listeners}
      >
        <GripVertical aria-hidden className="size-5" />
      </button>
    </li>
  )
}

/**
 * The bar editor (R29 B10; the canvas's Selection toolbar, iOS's edit list): the acts on the bar as
 * rows, each its red − at the start (the last kept where the bar needs one) and its handle at the
 * end, dragged to reorder; under them Available, every act not on the bar with its green +, or
 * saying the bar is full; Restore defaults on its own. Every mark is its own 44px target.
 */
export function BarEditor({
  surface,
  bar,
  label,
  onChange,
}: {
  surface: BarSurface
  bar: readonly BarAct[]
  /** The bar's name: what a screen reader calls the rows. */
  label: string
  /** A new arrangement; null for the defaults. */
  onChange: (acts: readonly BarAct[] | null) => void
}) {
  const { t } = useTranslation('settings')
  const sortable = useSortableList<BarAct>({ ids: bar, onDrop: (next) => onChange(next) })
  const available = barAvailable(surface, bar)
  const room = barHasRoom(surface, bar)
  const name = (act: BarAct) => t(`bars.act.${act}`)
  return (
    <div data-setting={`bars.${surface}`} className="flex flex-col gap-6">
      <div className="card overflow-hidden">
        <DndContext {...sortable.dnd} modifiers={[restrictToVerticalAxis]}>
          <SortableContext items={[...sortable.items]} strategy={verticalListSortingStrategy}>
            <ul aria-label={label}>
              {sortable.items.map((act) => (
                <OnRow
                  key={act}
                  act={act}
                  icon={BAR_ICONS[act]}
                  label={name(act)}
                  canRemove={barCanShrink(surface, bar)}
                  onRemove={() => onChange(bar.filter((each) => each !== act))}
                />
              ))}
              {sortable.items.length === 0 ? (
                <li className="px-4 py-3 text-muted-foreground">{t('bars.none')}</li>
              ) : null}
            </ul>
          </SortableContext>
        </DndContext>
      </div>
      {available.length > 0 ? (
        <SettingsGroup flush title={t('bars.available')}>
          {room ? null : (
            <p className="px-4 pt-3 text-sm text-pretty text-muted-foreground">{t('bars.full')}</p>
          )}
          <ul>
            {available.map((act) => (
              <li
                key={act}
                className="flex min-h-13 items-center gap-1 py-1 pr-4 pl-1 not-last:border-b not-last:border-hairline"
              >
                <EditMark
                  kind="add"
                  label={t('bars.add', { act: name(act) })}
                  disabled={!room}
                  onClick={() => onChange([...bar, act])}
                />
                <ActName icon={BAR_ICONS[act]} label={name(act)} muted={!room} />
              </li>
            ))}
          </ul>
        </SettingsGroup>
      ) : null}
      <SettingsGroup flush>
        <ActionRow title={t('bars.reset')} onClick={() => onChange(null)} />
      </SettingsGroup>
    </div>
  )
}
