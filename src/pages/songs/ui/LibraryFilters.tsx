import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LIBRARY_SORTS } from '@/entities/library'
import { useSetSearch } from '@/shared/lib'
import { keyFromParam } from '@/shared/lib/music'
import { useKeyName } from '@/shared/i18n'
import { FilterChips, SearchField, SortChoice, type FilterChipOn } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { useSearchPalette } from '@/widgets/search-palette'
import type { SongsFilter } from '../model/songs-filter'
import type { LibraryPage } from '../model/use-library-page'
import { SongsFilterSheet } from './FilterSheet'

/**
 * The library's search and filters (ADR 0106, the owner's examples): one search box with the sort
 * joined to its end, a pop-up of a word or two (Manual · Name · Recent · Key, the library's own,
 * kept); beside it the Filter button, its count on it while filters are on, opening the filters'
 * sheet (Key, Level, Favourites). Under them, while any is on, each as a chip that takes it off, in a
 * row that scrolls sideways; while something is typed, Search everywhere opens the palette on it. The
 * filters are the URL's; the sort is the library's.
 */
export function LibraryFilters({
  page,
  filter,
  screen,
  sortInHeadings = false,
}: {
  page: LibraryPage
  filter: SongsFilter
  /** The screen's name, for the search's. */
  screen: string
  /** The table's headings sort (a laptop's two panes): no sort joined to the search. */
  sortInHeadings?: boolean
}) {
  const { t } = useTranslation('songs')
  const set = useSetSearch<SongsFilter>()
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
            end={
              sortInHeadings ? undefined : (
                <SortChoice
                  value={page.sort}
                  options={LIBRARY_SORTS.map((sort) => ({
                    value: sort,
                    label: t(`sort.${sort}`),
                    short: t(`sort.short.${sort}`),
                  }))}
                  onChange={page.setSort}
                />
              )
            }
          />
        </div>
        <SongsFilterSheet page={page} filter={filter} />
      </div>
      <SongsFilterChips filter={filter} />
      {filter.q.trim() === '' ? null : <SearchEverywhere query={filter.q} />}
    </div>
  )
}

/** The library searched first; what was typed searched everywhere in the palette (rule 27). */
function SearchEverywhere({ query }: { query: string }) {
  const { t } = useTranslation('search')
  const palette = useSearchPalette()
  return (
    <Button variant="soft" className="self-start" onClick={() => palette.open(query)}>
      <Search aria-hidden />
      {t('everywhere')}
    </Button>
  )
}

/** The filters on, each a chip that takes it off, in a row that scrolls sideways (the search's own box says its text). */
function SongsFilterChips({ filter }: { filter: SongsFilter }) {
  const { t } = useTranslation('songs')
  const { t: common } = useTranslation('common')
  const keyName = useKeyName()
  const set = useSetSearch<SongsFilter>()
  const chips: (FilterChipOn | null)[] = [
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
      ? {
          id: 'favourites',
          name: common('library.favourites'),
          off: () => set({ favourites: false }),
        }
      : null,
    filter.folder === 'none'
      ? { id: 'folder', name: t('filters.noFolder'), off: () => set({ folder: 'any' }) }
      : null,
    filter.learned === 'any'
      ? null
      : {
          id: 'learned',
          name: t(filter.learned === 'yes' ? 'filters.learned' : 'filters.notLearned'),
          off: () => set({ learned: 'any' }),
        },
  ]
  return <FilterChips chips={chips.filter((chip) => chip !== null)} />
}
