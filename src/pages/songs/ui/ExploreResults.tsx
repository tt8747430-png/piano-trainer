import { ArrowDownUp, SearchX } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { PublicSort } from '@/shared/api/public-library'
import { BackMark, CardGrid, Dropdown, Said } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { ExploreCard } from '@/widgets/song-preview'
import { EXPLORE_SHELVES, type SongsHome } from '../model/explore-view'
import { useExploreBrowse } from '../model/use-explore-browse'
import { CardsLoading, ExploreEmpty, ExploreFailed } from './ExploreStates'

/**
 * Explore searched, or a shelf's See all: a grid of cards, its count at its head and its order
 * (New, Most saved, Top rated) at the head's end; a shelf opened has the way back to the shelves.
 * While asked, grey cards; a search with no match says so, with Clear.
 */
export function ExploreResults({
  home,
  onSort,
  onClear,
  onShelves,
}: {
  home: SongsHome
  onSort: (sort: PublicSort) => void
  onClear: () => void
  onShelves: () => void
}) {
  const { t } = useTranslation('songs')
  const sort = home.shelf || 'new'
  const { browse, retry } = useExploreBrowse({ cat: home.cat, sort, q: home.q })
  const patterns = home.cat === 'patterns'
  const query = home.q.trim()
  return (
    <section className="flex flex-col gap-2">
      <div className="flex min-h-9 items-center justify-between gap-2">
        {home.shelf && !query ? (
          <Button variant="ghost" className="-ml-3" onClick={onShelves}>
            <BackMark />
            {t('explore.shelvesBack')}
          </Button>
        ) : (
          <h2 className="font-sans text-sm font-semibold text-muted-foreground tabular-nums">
            {browse.kind === 'found'
              ? t(patterns ? 'explore.patternCount' : 'explore.songCount', {
                  count: browse.entries.length,
                })
              : null}
          </h2>
        )}
        <SortChoice value={sort} onChange={onSort} />
      </div>
      {browse.kind === 'loading' ? (
        <CardsLoading count={6} />
      ) : browse.kind === 'failed' ? (
        <ExploreFailed reason={browse.reason} onRetry={retry} />
      ) : browse.entries.length === 0 && query ? (
        <Said
          icon={SearchX}
          paint="sky"
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
        <CardGrid min="tile" label={t('explore.views.explore')}>
          {browse.entries.map((entry) => (
            <li key={entry.id}>
              <ExploreCard entry={entry} />
            </li>
          ))}
        </CardGrid>
      )}
    </section>
  )
}

/** The grid's order, at its head's end: its value in a word or two, every one in its list. */
function SortChoice({
  value,
  onChange,
}: {
  value: PublicSort
  onChange: (sort: PublicSort) => void
}) {
  const { t } = useTranslation('songs')
  return (
    <Dropdown<PublicSort>
      label={t('explore.sort')}
      value={value}
      onChange={onChange}
      options={EXPLORE_SHELVES.map((sort) => ({
        value: sort,
        label: t(`explore.shelves.${sort}`),
      }))}
      bare
      align="end"
      face={(sort) => (
        <span className="flex items-center gap-1.5">
          <ArrowDownUp aria-hidden className="size-4 shrink-0 text-muted-foreground" />
          <span className="whitespace-nowrap">{t(`explore.shelves.${sort}`)}</span>
        </span>
      )}
      className="h-9 gap-1.5 rounded-pill border-0 bg-transparent px-3 text-sm font-semibold text-muted-foreground shadow-none hover:bg-muted hover:text-foreground"
    />
  )
}
