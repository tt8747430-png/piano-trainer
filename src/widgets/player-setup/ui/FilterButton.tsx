import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import { FilterIcon } from '@/shared/ui'

/**
 * Sort and filter beside the Pattern sheet's search (the PlayerApp board's): a 40 card square that
 * opens the sheet's page of them, washed in honey in its ring while a filter or a sort is on, the
 * filters' count on it in honey.
 */
export function FilterButton({
  count,
  sorted,
  onOpen,
}: {
  /** How many filters are on. */
  count: number
  /** Whether the list is sorted another way than its books'. */
  sorted: boolean
  onOpen: () => void
}) {
  const { t } = useTranslation('common')
  const label = count > 0 ? t('library.filters.on', { count }) : t('library.filters.sortTitle')
  const on = count > 0 || sorted
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onOpen}
      className={cn(
        'relative grid size-11 shrink-0 place-items-center rounded-control text-foreground transition-colors duration-200 ease-out focus-visible:-outline-offset-3 [&_svg]:size-5',
        on
          ? 'bg-chosen-honey shadow-[inset_0_0_0_1.5px_var(--color-honey-ring)]'
          : 'bg-card hover:bg-muted',
      )}
    >
      <FilterIcon aria-hidden />
      {count > 0 ? (
        <span
          aria-hidden
          className="pointer-events-none absolute -top-1.25 -right-1.25 grid h-4.5 min-w-4.5 place-items-center rounded-pill bg-primary px-1 text-xs font-bold text-primary-foreground tabular-nums"
        >
          {count}
        </span>
      ) : null}
    </button>
  )
}
