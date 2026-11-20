import { SearchX } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { PublicSort } from '@/shared/api/public-library'
import { LAPTOP, useMediaQuery } from '@/shared/lib'
import { Said, SortMenu } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { EXPLORE_COLUMNS, ExploreFeedCard } from '@/widgets/song-preview'
import { EXPLORE_SHELVES, type SongsHome } from '../model/explore-view'
import { ExplorePeople } from './ExplorePeople'
import { ExploreEmpty, ExploreLoading, ExploreFailed } from './ExploreStates'
import { useExploreFeed } from './use-explore-feed'

type ExploreFeed = ReturnType<typeof useExploreFeed>

/**
 * The count and the order of Explore's songs (the board's EXSORTB): "8 songs", then New ⇅ in the link
 * colour opening New, Most saved and Top rated; on the chips' row's right on a laptop, under them on
 * a phone, never pushed off to the window's far edge.
 */
export function ExploreSort({
  home,
  feed,
  onSort,
  counted = true,
}: {
  home: SongsHome
  feed: ExploreFeed
  onSort: (sort: PublicSort) => void
  /** The count beside it: a laptop's is in the place's bar. */
  counted?: boolean
}) {
  const { t } = useTranslation('songs')
  if (feed.browse.kind !== 'found' || feed.entries.length === 0) return null
  const sort = home.shelf || 'new'
  const patterns = home.cat === 'patterns'
  return (
    <div className="flex shrink-0 items-center justify-end gap-4 px-1">
      {counted ? (
        <span className="text-[0.9375rem] font-semibold text-muted-foreground tabular-nums">
          {t(patterns ? 'explore.patternCount' : 'explore.songCount', {
            count: feed.entries.length,
          })}
        </span>
      ) : null}
      <SortMenu<PublicSort>
        label={t('explore.sort')}
        sort={sort}
        sorts={EXPLORE_SHELVES.map((value) => ({
          value,
          label: t(`explore.shelves.${value}`),
        }))}
        onSort={onSort}
      />
    </div>
  )
}

/**
 * Explore's feed (the Explore board): a picture card per item, two across on a phone and as many as
 * fit from 16rem on a laptop; one person's alone where People opened them (`by`). People lists who
 * publishes. While asked, its grey rows in the loaded shape; a search with no match says so, with Clear; nothing
 * published, how to publish.
 */
export function ExploreResults({
  home,
  feed,
  onClear,
}: {
  home: SongsHome
  feed: ExploreFeed
  onClear: () => void
}) {
  const { t } = useTranslation('songs')
  const laptop = useMediaQuery(LAPTOP)
  const { browse, retry, entries } = feed
  const patterns = home.kind !== 'people' && home.cat === 'patterns'
  const query = home.q.trim()
  // The table's head, the same over the rows and over their grey shapes while Explore is asked.
  const head = (
    <div role="row" className={`${EXPLORE_COLUMNS} h-10 border-b border-border`}>
      {(['title', 'composer', 'type', 'sharedBy', 'saves'] as const).map((column) => (
        <span
          key={column}
          role="columnheader"
          className="text-[0.8125rem] font-semibold text-muted-foreground"
        >
          {t(`table.${column}`)}
        </span>
      ))}
      <span role="columnheader" aria-hidden />
    </div>
  )
  return (
    <section className="flex flex-col gap-3">
      {browse.kind === 'loading' ? (
        <ExploreLoading head={laptop ? head : undefined} rows={laptop ? 8 : 6} />
      ) : browse.kind === 'failed' ? (
        <ExploreFailed reason={browse.reason} onRetry={retry} />
      ) : home.kind === 'people' ? (
        <ExplorePeople entries={browse.entries} query={home.q} onClear={onClear} />
      ) : entries.length === 0 && query ? (
        <Said
          quiet
          icon={SearchX}
          title={t(patterns ? 'explore.noMatchPatterns' : 'explore.noMatch', { query })}
          action={<Button onClick={onClear}>{t('explore.clear')}</Button>}
        />
      ) : entries.length === 0 ? (
        <ExploreEmpty />
      ) : laptop ? (
        // All songs' table (2026-11-17: "the pages change to much from the all songs to explore").
        <div
          role="table"
          aria-label={t('explore.views.explore')}
          className="border-t border-border"
        >
          {head}
          {entries.map((entry) => (
            <ExploreFeedCard key={entry.id} entry={entry} table />
          ))}
        </div>
      ) : (
        // One card holding the rows, the hairline from the title's edge (84: 12, the 56 tile, 16).
        <ul
          aria-label={t('explore.views.explore')}
          className="card flex flex-col overflow-hidden [&>li+li]:relative [&>li+li]:before:absolute [&>li+li]:before:top-0 [&>li+li]:before:right-0 [&>li+li]:before:left-21 [&>li+li]:before:h-px [&>li+li]:before:bg-border [&>li+li]:before:content-['']"
        >
          {entries.map((entry) => (
            <ExploreFeedCard key={entry.id} entry={entry} />
          ))}
        </ul>
      )}
    </section>
  )
}
