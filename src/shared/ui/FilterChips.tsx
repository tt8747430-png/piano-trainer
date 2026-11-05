import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

/** A filter that is on, as its chip names it, and how to take it off. */
export interface FilterChipOn {
  readonly id: string
  readonly name: string
  readonly off: () => void
}

/**
 * A library's filters that are on (Songs', Practice's), each a chip that takes it off, in a row that
 * scrolls sideways under the search; nothing while none is.
 */
export function FilterChips({ chips }: { chips: readonly FilterChipOn[] }) {
  const { t } = useTranslation('common')
  if (chips.length === 0) return null
  return (
    // Room round the chips inside the scroller, so a chip's focus ring is not cut.
    <ul
      aria-label={t('library.filters.chips')}
      className="-mx-gutter -my-1 flex gap-2 overflow-x-auto px-gutter py-1 [scrollbar-width:none]"
    >
      {chips.map((chip) => (
        <li key={chip.id} className="shrink-0">
          <button
            type="button"
            aria-label={t('library.filters.remove', { name: chip.name })}
            onClick={chip.off}
            className="flex h-11 items-center gap-1.5 rounded-pill border border-input bg-muted py-1 pr-2 pl-3.5 text-sm font-semibold whitespace-nowrap transition-colors duration-200 ease-out hover:bg-accent"
          >
            {chip.name}
            <X aria-hidden className="size-4 text-muted-foreground" />
          </button>
        </li>
      ))}
    </ul>
  )
}
