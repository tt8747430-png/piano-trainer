import { ArrowDownUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Dropdown } from './Dropdown'

/** A way a library sorts: its full name in the list, and a word or two on the button. */
export interface SortOption<T extends string> {
  readonly value: T
  readonly label: string
  readonly short: string
}

/**
 * A library's sort, joined to its search's end (Songs', Practice's; ADR 0106): its value in a word or
 * two by a sort mark, the full names in its list.
 */
export function SortChoice<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T
  options: readonly SortOption<T>[]
  onChange: (sort: T) => void
}) {
  const { t } = useTranslation('common')
  const shortOf = (sort: T) => options.find((option) => option.value === sort)?.short ?? sort
  return (
    <Dropdown<T>
      label={t('library.sort')}
      value={value}
      onChange={onChange}
      options={options.map(({ value: sort, label }) => ({ value: sort, label }))}
      bare
      align="end"
      face={(sort) => (
        <span className="flex items-center gap-1.5">
          <ArrowDownUp aria-hidden className="size-4 shrink-0 text-muted-foreground" />
          <span className="whitespace-nowrap">{shortOf(sort)}</span>
        </span>
      )}
      className="h-full gap-1.5 rounded-none rounded-r-control border-0 border-l border-input bg-muted px-3 text-sm shadow-none hover:bg-accent focus-visible:-outline-offset-3"
    />
  )
}
