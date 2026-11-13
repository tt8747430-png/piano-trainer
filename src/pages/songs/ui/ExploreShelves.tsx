import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { RATED_MIN, type PublicEntry, type PublicSort } from '@/shared/api/public-library'
import { Button } from '@/shared/ui/primitives/button'
import { ExploreCard } from '@/widgets/song-preview'
import type { ExploreCategory } from '../model/explore-view'
import { entriesOf, useExploreBrowse } from '../model/use-explore-browse'
import { CardsLoading, ExploreEmpty, ExploreFailed } from './ExploreStates'

/** The most a shelf holds on a phone, swiped across; a laptop shows its first row of five. */
const SHELF = 10

/** What earns a place on a shelf: anything new; saved at least once; rated by enough learners. */
const ON_SHELF: Readonly<Record<PublicSort, (entry: PublicEntry) => boolean>> = {
  new: () => true,
  saved: (entry) => entry.saves > 0,
  rated: (entry) => (entry.rating?.count ?? 0) >= RATED_MIN,
}

/**
 * Explore with nothing searched: a chip's shelves, New, Most saved and Top rated, each its name and
 * See all over its cards (a row swiped across on a phone, a row of five on a laptop); a shelf with
 * nothing on it is left out. While asked, grey cards; offline or failed, why; nothing published,
 * how to publish the first.
 */
export function ExploreShelves({
  cat,
  onSeeAll,
}: {
  cat: ExploreCategory
  onSeeAll: (shelf: PublicSort) => void
}) {
  const newest = useExploreBrowse({ cat, sort: 'new', q: '' })
  const saved = useExploreBrowse({ cat, sort: 'saved', q: '' })
  const rated = useExploreBrowse({ cat, sort: 'rated', q: '' })
  if (newest.browse.kind === 'loading') return <CardsLoading count={5} row />
  if (newest.browse.kind === 'failed')
    return <ExploreFailed reason={newest.browse.reason} onRetry={newest.retry} />
  if (newest.browse.entries.length === 0) return <ExploreEmpty />
  const shelves = [
    { sort: 'new', entries: newest.browse.entries },
    { sort: 'saved', entries: entriesOf(saved.browse).filter(ON_SHELF.saved) },
    { sort: 'rated', entries: entriesOf(rated.browse).filter(ON_SHELF.rated) },
  ] as const
  return (
    <div className="flex flex-col gap-6">
      {shelves.map((shelf) =>
        shelf.entries.length > 0 ? (
          <Shelf
            key={shelf.sort}
            sort={shelf.sort}
            entries={shelf.entries}
            onSeeAll={() => onSeeAll(shelf.sort)}
          />
        ) : null,
      )}
    </div>
  )
}

/** One shelf (Noji's Popular): its name and See all over its cards. */
function Shelf({
  sort,
  entries,
  onSeeAll,
}: {
  sort: PublicSort
  entries: readonly PublicEntry[]
  onSeeAll: () => void
}) {
  const { t } = useTranslation('songs')
  const id = useId()
  return (
    <section aria-labelledby={id} className="flex min-w-0 flex-col gap-2">
      <div className="flex min-h-9 items-center justify-between gap-2">
        <h2 id={id} className="font-sans text-xl font-bold">
          {t(`explore.shelves.${sort}`)}
        </h2>
        <Button variant="ghost" onClick={onSeeAll}>
          {t('explore.seeAll')}
        </Button>
      </div>
      <ul
        aria-labelledby={id}
        className="-mx-gutter flex snap-x scroll-px-gutter gap-2 overflow-x-auto overscroll-x-contain px-gutter pb-1 scrollbar-none lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0 lg:[&>li:nth-child(n+6)]:hidden"
      >
        {entries.slice(0, SHELF).map((entry) => (
          <li key={entry.id} className="w-44 shrink-0 snap-start lg:w-auto">
            <ExploreCard entry={entry} />
          </li>
        ))}
      </ul>
    </section>
  )
}
