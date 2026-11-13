import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSetSearch } from '@/shared/lib'
import { keyFromParam } from '@/shared/lib/music'
import { useKeyName } from '@/shared/i18n'
import { ChoiceChips, FilterChips, SearchField, type FilterChipOn } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { useSearchPalette } from '@/widgets/search-palette'
import type { SongsFilter } from '../model/songs-filter'
import type { LibraryPage } from '../model/use-library-page'
import { SongsFilterSheet } from './FilterSheet'

/**
 * The library's search and filters (ADR 0106, canvas 133): one search box and beside it Sort and
 * filter, its count on it while filters are on, opening the sheet whose first group is the sort
 * (Manual · Name · Recently played · Key, the library's own, kept) on a phone, where a laptop's table
 * headings sort. On a phone the place chips under them, All · Favourites · Learning · Learned, a row
 * that scrolls sideways, where a laptop has its tree. While any filter is on, each as a chip that
 * takes it off; while something is typed, Search everywhere opens the palette on it.
 */
export function LibraryFilters({
  page,
  filter,
  screen,
  wide = false,
}: {
  page: LibraryPage
  filter: SongsFilter
  /** The screen's name, for the search's. */
  screen: string
  /** A laptop's two panes: the table's headings sort and the tree holds the places. */
  wide?: boolean
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
          />
        </div>
        <SongsFilterSheet page={page} filter={filter} sorted={!wide} />
      </div>
      {wide ? null : <PlaceChips filter={filter} />}
      <SongsFilterChips filter={filter} />
      {filter.q.trim() === '' ? null : <SearchEverywhere query={filter.q} />}
    </div>
  )
}

type Place = 'all' | 'favourites' | 'learning' | 'learned'

/** The place chips (canvas 133): what the list shows, each one tap, the filters' own in the URL. */
function PlaceChips({ filter }: { filter: SongsFilter }) {
  const { t } = useTranslation('songs')
  const set = useSetSearch<SongsFilter>()
  const place: Place = filter.favourites
    ? 'favourites'
    : filter.learned === 'yes'
      ? 'learned'
      : filter.learned === 'no'
        ? 'learning'
        : 'all'
  const places: readonly Place[] = ['all', 'favourites', 'learning', 'learned']
  return (
    <ChoiceChips
      label={t('places.label')}
      value={place}
      scroll
      options={places.map((value) => ({ value, label: t(`places.${value}`) }))}
      onChange={(next) =>
        set({
          favourites: next === 'favourites',
          learned: next === 'learned' ? 'yes' : next === 'learning' ? 'no' : 'any',
        })
      }
    />
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

/** The filters on, besides the places' (their chips or the tree hold them), each a chip that takes it off, in a row that scrolls sideways (the search's own box says its text). */
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
    filter.folder === 'none'
      ? { id: 'folder', name: t('filters.noFolder'), off: () => set({ folder: 'any' }) }
      : null,
  ]
  return <FilterChips chips={chips.filter((chip) => chip !== null)} />
}
