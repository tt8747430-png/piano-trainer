import { ArrowDownUp, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LIBRARY_SORTS, type LibrarySort } from '@/entities/library'
import { useViewChange } from '@/shared/lib'
import { keyFromParam } from '@/shared/lib/music'
import { useKeyName } from '@/shared/i18n'
import { Dropdown, SearchField } from '@/shared/ui'
import type { SongsFilter } from '../model/songs-filter'
import type { LibraryPage } from '../model/use-library-page'
import { FilterSheet } from './FilterSheet'

/**
 * The library's search and filters (ADR 0106, the owner's examples): one search box with the sort
 * joined to its end, a pop-up of a word or two (Manual · Name · Recent · Key, the library's own,
 * kept); beside it the Filter button, its count on it while filters are on, opening the filters'
 * sheet (Key, Level, Favourites). Under them, while any is on, each as a chip that takes it off, in a
 * row that scrolls sideways. The filters are the URL's; the sort is the library's.
 */
export function LibraryFilters({
  page,
  filter,
  screen,
}: {
  page: LibraryPage
  filter: SongsFilter
  /** The screen's name, for the search's. */
  screen: string
}) {
  const { t } = useTranslation('songs')
  const set = useViewChange<SongsFilter>()
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <SearchField
            value={filter.q}
            onChange={(q) => set({ q })}
            label={t('search')}
            hint={t('searchHint')}
            screen={screen}
            end={<SortChoice value={page.sort} onChange={page.setSort} />}
          />
        </div>
        <FilterSheet page={page} filter={filter} />
      </div>
      <FilterChips filter={filter} />
    </div>
  )
}

/** The sort, joined to the search's end: its value in a word or two, the full names in its list. */
function SortChoice({
  value,
  onChange,
}: {
  value: LibrarySort
  onChange: (sort: LibrarySort) => void
}) {
  const { t } = useTranslation('songs')
  return (
    <Dropdown<LibrarySort>
      label={t('sort.label')}
      value={value}
      onChange={onChange}
      options={LIBRARY_SORTS.map((sort) => ({ value: sort, label: t(`sort.${sort}`) }))}
      bare
      align="end"
      face={(sort) => (
        <span className="flex items-center gap-1.5">
          <ArrowDownUp aria-hidden className="size-4 shrink-0 text-muted-foreground" />
          <span className="whitespace-nowrap">{t(`sort.short.${sort}`)}</span>
        </span>
      )}
      className="h-full gap-1.5 rounded-none rounded-r-2xl border-0 border-l border-input bg-muted px-3 text-sm shadow-none hover:bg-accent focus-visible:-outline-offset-3"
    />
  )
}

/** The filters on, each a chip that takes it off, in a row that scrolls sideways (the search's own box says its text). */
function FilterChips({ filter }: { filter: SongsFilter }) {
  const { t } = useTranslation('songs')
  const { t: common } = useTranslation('common')
  const keyName = useKeyName()
  const set = useViewChange<SongsFilter>()
  const chips = [
    filter.key === ''
      ? null
      : {
          id: 'key',
          name: t('filters.chipKey', { key: keyName(keyFromParam(filter.key)) }),
          off: () => set({ key: '' }),
        },
    filter.stage === 'any'
      ? null
      : {
          id: 'stage',
          name: t('filters.chipStage', { stage: common(`stage.${filter.stage}`) }),
          off: () => set({ stage: 'any' }),
        },
    filter.favourites
      ? { id: 'favourites', name: t('favourites'), off: () => set({ favourites: false }) }
      : null,
  ].filter((chip) => chip !== null)
  if (chips.length === 0) return null
  return (
    // Room round the chips inside the scroller, so a chip's focus ring is not cut.
    <ul
      aria-label={t('filters.chips')}
      className="-mx-gutter -my-1 flex gap-2 overflow-x-auto px-gutter py-1 [scrollbar-width:none]"
    >
      {chips.map((chip) => (
        <li key={chip.id} className="shrink-0">
          <button
            type="button"
            aria-label={t('filters.remove', { name: chip.name })}
            onClick={chip.off}
            className="flex h-9 items-center gap-1.5 rounded-full border border-input bg-muted py-1 pr-2 pl-3.5 text-sm font-semibold whitespace-nowrap transition-colors duration-200 ease-out hover:bg-accent"
          >
            {chip.name}
            <X aria-hidden className="size-4 text-muted-foreground" />
          </button>
        </li>
      ))}
    </ul>
  )
}
