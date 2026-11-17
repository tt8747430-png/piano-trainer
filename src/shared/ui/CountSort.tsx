import { ArrowUpDown } from 'lucide-react'
import { cn } from '@/shared/lib'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './primitives/dropdown-menu'

interface SortProps<Sort extends string, Way extends string> {
  /** The menu's name: "Sort by". */
  readonly label: string
  readonly sort: Sort
  readonly sorts: readonly { readonly value: Sort; readonly label: string }[]
  readonly onSort: (sort: Sort) => void
  /** Which way it runs (Ascending · Descending), under the sorts. */
  readonly ways?: {
    readonly way: Way
    readonly options: readonly { readonly value: Way; readonly label: string }[]
    readonly onWay: (way: Way) => void
  }
}

/**
 * A list's sort (the R72 board's COUNTROW and its table's head): the sort it is in, in the link's
 * colour with ⇅, opening a menu of the sorts, the one in use ticked, and under a line which way it
 * runs where the list offers both. A choice made closes the menu. In a table's head (`head`) it takes
 * the head's small type.
 */
export function SortMenu<Sort extends string, Way extends string = never>({
  label,
  sort,
  sorts,
  onSort,
  ways,
  head = false,
}: SortProps<Sort, Way> & { readonly head?: boolean }) {
  const current = sorts.find((each) => each.value === sort)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`${label}: ${current?.label ?? ''}`}
        className={cn(
          'flex min-h-11 items-center rounded-control font-semibold text-link focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
          head ? 'gap-1.5 text-[0.8125rem]' : 'gap-2 text-base',
        )}
      >
        {current?.label}
        <ArrowUpDown aria-hidden className={head ? 'size-3.5' : 'size-4.5'} />
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
        {ways ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={ways.way}
              onValueChange={(next: Way) => ways.onWay(next)}
            >
              {ways.options.map((each) => (
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
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/**
 * A list's count and its sort (the R72 board's COUNTROW, Flat's library): how many it shows, quiet at
 * the start, on the cards' own edge, and its `SortMenu` at the end.
 */
export function CountSort<Sort extends string, Way extends string = never>({
  count,
  ...sort
}: SortProps<Sort, Way> & {
  /** "8 songs". */
  readonly count: string
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[0.9375rem] font-semibold text-muted-foreground tabular-nums">
        {count}
      </span>
      <SortMenu {...sort} />
    </div>
  )
}
