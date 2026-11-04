import { DndContext } from '@dnd-kit/core'
import { horizontalListSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Minus, Plus, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  barAvailable,
  barCanShrink,
  barHasRoom,
  type BarAct,
  type BarSurface,
} from '@/entities/settings'
import { cn, useSortableList } from '@/shared/lib'
import { Button } from '@/shared/ui/primitives/button'
import { BAR_ICONS } from '../model/bar-icons'

/** A tile on the bar: dragged by itself to reorder, its − badge taking it off. */
function Tile({
  act,
  icon: Icon,
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
      className={cn('relative', isDragging && 'z-10 opacity-80')}
    >
      <button
        type="button"
        aria-label={t('bars.move', { act: label })}
        className="flex min-h-16 w-18 touch-none flex-col items-center justify-center gap-1 rounded-control border border-hairline bg-card px-1 text-xs"
        {...attributes}
        {...listeners}
      >
        <Icon aria-hidden className="size-5" />
        <span className="max-w-full truncate">{label}</span>
      </button>
      <button
        type="button"
        aria-label={t('bars.remove', { act: label })}
        title={canRemove ? undefined : t('bars.keepOne')}
        disabled={!canRemove}
        onClick={onRemove}
        className="absolute -top-2 -right-2 grid size-6 place-items-center rounded-full bg-destructive text-destructive-foreground disabled:opacity-40"
      >
        <Minus aria-hidden className="size-3.5" />
      </button>
    </li>
  )
}

/**
 * The bar editor (R29 B10, memory-palaces' Select toolbar): the bar live at the top as tiles, dragged
 * to reorder, each − badge taking one off (the last kept where the bar needs one); under it Available,
 * every act not on the bar, a tap adding it, or saying the bar is full; Reset at the foot.
 */
export function BarEditor({
  surface,
  bar,
  label,
  onChange,
}: {
  surface: BarSurface
  bar: readonly BarAct[]
  /** The bar's name: what a screen reader calls the tiles. */
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
    <div data-setting={`bars.${surface}`} className="card flex flex-col gap-4 px-4 py-4">
      <DndContext {...sortable.dnd}>
        <SortableContext items={[...sortable.items]} strategy={horizontalListSortingStrategy}>
          <ul aria-label={label} className="flex min-h-16 flex-wrap gap-3 pt-2">
            {sortable.items.map((act) => (
              <Tile
                key={act}
                act={act}
                icon={BAR_ICONS[act]}
                label={name(act)}
                canRemove={barCanShrink(surface, bar)}
                onRemove={() => onChange(bar.filter((each) => each !== act))}
              />
            ))}
            {sortable.items.length === 0 ? (
              <li className="text-sm text-muted-foreground">{t('bars.none')}</li>
            ) : null}
          </ul>
        </SortableContext>
      </DndContext>
      {available.length > 0 ? (
        <section aria-label={t('bars.available')} className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-muted-foreground">{t('bars.available')}</h3>
          {room ? null : <p className="text-sm text-muted-foreground">{t('bars.full')}</p>}
          <ul className="flex flex-wrap gap-2">
            {available.map((act) => {
              const Icon = BAR_ICONS[act]
              return (
                <li key={act}>
                  <Button
                    variant="outline"
                    disabled={!room}
                    aria-label={t('bars.add', { act: name(act) })}
                    onClick={() => onChange([...bar, act])}
                  >
                    <Plus data-icon="inline-start" />
                    <Icon aria-hidden />
                    {name(act)}
                  </Button>
                </li>
              )
            })}
          </ul>
        </section>
      ) : null}
      <Button variant="ghost" className="self-start" onClick={() => onChange(null)}>
        {t('bars.reset')}
      </Button>
    </div>
  )
}
