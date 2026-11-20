import { DndContext } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Minus, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  barAvailable,
  barCanShrink,
  barHasRoom,
  type BarAct,
  type BarSurface,
} from '@/entities/settings'
import { cn, useSortableList } from '@/shared/lib'
import { BAR_ICONS } from '../model/bar-icons'
import { ActionRow, SettingsGroup } from '@/shared/ui'

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

/**
 * An act's face, the row's middle (owner, 2026-11-17: "make the toolbar icons not just text"; the
 * board's TBROW): the glyph it wears in the toolbar on a 36 sand tile, then its name, so the list
 * reads as the bar above it. An act that cannot be added while every slot is used dims its tile and
 * quiets its name, which stays readable.
 */
function ActFace({ act, label, muted = false }: { act: BarAct; label: string; muted?: boolean }) {
  const Icon = BAR_ICONS[act]
  return (
    <>
      <span
        aria-hidden
        className={cn(
          'grid size-9 flex-none place-items-center rounded-[10px] bg-muted',
          muted && 'opacity-50',
        )}
      >
        <Icon className="size-5" />
      </span>
      <span className={cn('min-w-0 flex-1 truncate', muted && 'text-muted-foreground')}>
        {label}
      </span>
    </>
  )
}

/** An act on the bar: its − at the start, its name, its handle at the end to drag it in order. */
function OnRow({
  act,
  label,
  canRemove,
  onRemove,
}: {
  act: BarAct
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
        'relative flex min-h-13 items-center gap-2 bg-card py-1 ps-2 pe-1 not-last:border-b not-last:border-hairline',
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
      <ActFace act={act} label={label} />
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
    <div data-setting={`bars.${surface}`} className="flex flex-col gap-4">
      <DndContext {...sortable.dnd} modifiers={[restrictToVerticalAxis]}>
        <SortableContext items={[...sortable.items]} strategy={verticalListSortingStrategy}>
          {/* A card of rows; in the laptop's Settings dialog, rows on the pane. */}
          <ul aria-label={label} data-slot="settings-card" className="card overflow-hidden">
            {sortable.items.map((act) => (
              <OnRow
                key={act}
                act={act}
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
      {available.length > 0 ? (
        <section data-slot="settings-group" className="flex flex-col gap-2">
          <h2 data-slot="settings-heading" className="caps px-4">
            {t('bars.available')}
          </h2>
          {room ? null : (
            <p data-slot="settings-foot" className="px-4 text-sm text-pretty text-muted-foreground">
              {t('bars.full')}
            </p>
          )}
          <ul
            aria-label={t('bars.available')}
            data-slot="settings-card"
            className="card overflow-hidden"
          >
            {available.map((act) => (
              <li
                key={act}
                className="flex min-h-13 items-center gap-2 py-1 ps-2 pe-4 not-last:border-b not-last:border-hairline"
              >
                <EditMark
                  kind="add"
                  label={t('bars.add', { act: name(act) })}
                  disabled={!room}
                  onClick={() => onChange([...bar, act])}
                />
                <ActFace act={act} label={name(act)} muted={!room} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <SettingsGroup flush>
        <ActionRow title={t('bars.reset')} onClick={() => onChange(null)} />
      </SettingsGroup>
    </div>
  )
}

/** The acts that lose something, drawn in crimson on a selection's bar, glyph and word alike. */
const LOSSES: ReadonlySet<BarAct> = new Set(['archive', 'delete'])

/**
 * The toolbar as a selection shows it (the board's TBPREVIEW): a pill across the column, as the bar
 * spans the screen, with the count and the bar's acts in their order, each its glyph over its 12
 * word (the board's SELACT), the losses in crimson.
 */
export function BarPreview({ bar }: { bar: readonly BarAct[] }) {
  const { t } = useTranslation('settings')
  return (
    <div role="img" aria-label={t('bars.previewToolbar')} className="flex py-2">
      <div className="flex h-17 min-w-0 flex-1 items-center gap-1 rounded-pill bg-card px-2 layer-shadow">
        <span className="px-3 text-[0.9375rem] font-bold whitespace-nowrap">
          {t('bars.previewSelected')}
        </span>
        {bar.map((act) => {
          const Icon = BAR_ICONS[act]
          return (
            <span
              key={act}
              className={cn(
                'flex h-13 min-w-0 flex-1 flex-col items-center justify-center gap-0.5',
                LOSSES.has(act) && 'text-destructive',
              )}
            >
              <Icon aria-hidden className="size-5" />
              <span className="text-xs font-semibold whitespace-nowrap">
                {t(`bars.act.${act}`)}
              </span>
            </span>
          )
        })}
      </div>
    </div>
  )
}
