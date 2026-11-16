import { SearchX } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { PublicSort } from '@/shared/api/public-library'
import { CountSort, Said } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { ExploreFeedCard } from '@/widgets/song-preview'
import { EXPLORE_SHELVES, type SongsHome } from '../model/explore-view'
import { useExploreBrowse } from '../model/use-explore-browse'
import { CardsLoading, ExploreEmpty, ExploreFailed } from './ExploreStates'

/**
 * Explore's feed (the R72 board, Flat's community): its count and its order (New, Most saved, Top
 * rated) at its head, then a card per item, one column on a phone, three across on a laptop. While
 * asked, grey cards; a search with no match says so, with Clear; nothing published, how to publish.
 */
export function ExploreResults({
  home,
  onSort,
  onClear,
}: {
  home: SongsHome
  onSort: (sort: PublicSort) => void
  onClear: () => void
}) {
  const { t } = useTranslation('songs')
  const sort = home.shelf || 'new'
  const { browse, retry } = useExploreBrowse({ cat: home.cat, sort, q: home.q })
  const patterns = home.cat === 'patterns'
  const query = home.q.trim()
  return (
    <section className="flex flex-col gap-3">
      {browse.kind === 'found' && browse.entries.length > 0 ? (
        <CountSort
          count={t(patterns ? 'explore.patternCount' : 'explore.songCount', {
            count: browse.entries.length,
          })}
          label={t('explore.sort')}
          sort={sort}
          sorts={EXPLORE_SHELVES.map((value) => ({
            value,
            label: t(`explore.shelves.${value}`),
          }))}
          onSort={onSort}
        />
      ) : null}
      {browse.kind === 'loading' ? (
        <CardsLoading count={6} />
      ) : browse.kind === 'failed' ? (
        <ExploreFailed reason={browse.reason} onRetry={retry} />
      ) : browse.entries.length === 0 && query ? (
        <Said
          icon={SearchX}
          title={t(patterns ? 'explore.noMatchPatterns' : 'explore.noMatch', { query })}
          action={
            <Button variant="soft" onClick={onClear}>
              {t('explore.clear')}
            </Button>
          }
        />
      ) : browse.entries.length === 0 ? (
        <ExploreEmpty />
      ) : (
        <ul
          aria-label={t('explore.views.explore')}
          className="grid items-start gap-3 lg:grid-cols-3 lg:gap-4"
        >
          {browse.entries.map((entry) => (
            <li key={entry.id} className="min-w-0">
              <ExploreFeedCard entry={entry} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
