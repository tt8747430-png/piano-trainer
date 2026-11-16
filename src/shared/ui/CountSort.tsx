import { ArrowUpDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from './primitives/dropdown-menu'

/**
 * A list's count and its sort (the R72 board's COUNTROW, Flat's library): how many it shows, quiet at
 * the start, and at the end the sort it is in, in the link's colour with ⇅, opening a menu of the
 * sorts, the one in use ticked. A sort picked closes the menu.
 */
export function CountSort<Sort extends string>({
  count,
  label,
  sort,
  sorts,
  onSort,
}: {
  /** "8 songs". */
  count: string
  /** The menu's name: "Sort by". */
  label: string
  sort: Sort
  sorts: readonly { readonly value: Sort; readonly label: string }[]
  onSort: (sort: Sort) => void
}) {
  const current = sorts.find((each) => each.value === sort)
  return (
    <div className="mx-1 flex items-center justify-between gap-3">
      <span className="text-[0.9375rem] font-semibold text-muted-foreground tabular-nums">
        {count}
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={`${label}: ${current?.label ?? ''}`}
          className="flex min-h-11 items-center gap-2 rounded-control text-base font-semibold text-link focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          {current?.label}
          <ArrowUpDown aria-hidden className="size-4.5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-57.5">
          <DropdownMenuRadioGroup value={sort} onValueChange={(next: Sort) => onSort(next)}>
            {sorts.map((each) => (
              <DropdownMenuRadioItem
                key={each.value}
                value={each.value}
                closeOnClick
                className="min-h-11 text-base"
              >
                {each.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
