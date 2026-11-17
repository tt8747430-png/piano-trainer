import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSetSearch } from '@/shared/lib'
import { SearchField } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { useSearchPalette } from '@/widgets/search-palette'
import type { SongsFilter } from '../model/songs-filter'

/**
 * The library's search (ADR 0106, R72's SEARCHFIELD): the one way to narrow its songs, the sort
 * beside the count. While something is typed, Search everywhere opens the palette on it.
 */
export function LibrarySearch({
  filter,
  screen,
}: {
  filter: SongsFilter
  /** The screen's name, for the search's. */
  screen: string
}) {
  const { t } = useTranslation('songs')
  const set = useSetSearch<SongsFilter>()
  return (
    <div className="flex flex-col gap-3">
      <SearchField
        value={filter.q}
        onChange={(q) => set({ q })}
        label={t('all.search')}
        hint={t('all.search')}
        screen={screen}
      />
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
