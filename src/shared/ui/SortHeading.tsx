import { ArrowDown } from 'lucide-react'
import { cn } from '@/shared/lib'

/** A table cell's room, the same in every library table. */
export const TABLE_CELL = 'px-3 py-2 text-start align-middle'

/**
 * A table's column heading that sorts by its column (Apple Music's songs list): its name and, while
 * sorted by it, an arrow. A tap on the sorted one gives the sort back (`onSort` decides to what).
 */
export function SortHeading({
  label,
  on,
  onSort,
  className,
}: {
  label: string
  on: boolean
  onSort: () => void
  className?: string
}) {
  return (
    <th scope="col" aria-sort={on ? 'ascending' : 'none'} className={cn(TABLE_CELL, className)}>
      <button
        type="button"
        onClick={onSort}
        className="-mx-2 inline-flex min-h-9 items-center gap-1 rounded-control px-2 font-semibold hover:bg-muted"
      >
        {label}
        {on ? <ArrowDown aria-hidden className="size-3.5" /> : null}
      </button>
    </th>
  )
}
