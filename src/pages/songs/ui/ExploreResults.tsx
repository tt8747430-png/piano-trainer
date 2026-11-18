import { ArrowUpDown, SearchX } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { PublicSort } from '@/shared/api/public-library'
import { LAPTOP, useMediaQuery } from '@/shared/lib'
import { Said } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/shared/ui/primitives/dropdown-menu'
import { EXPLORE_COLUMNS, ExploreFeedCard } from '@/widgets/song-preview'
import { EXPLORE_SHELVES, type SongsHome } from '../model/explore-view'
import { useExploreBrowse } from '../model/use-explore-browse'
import { ExplorePeople } from './ExplorePeople'
import { CardsLoading, ExploreEmpty, ExploreFailed } from './ExploreStates'

/** What Explore shows for its URL: the feed read, and the entries left once one person's are chosen. */
export function useExploreFeed(home: SongsHome) {
  const people = home.kind === 'people'
  const { browse, retry } = useExploreBrowse(
    people
      ? { cat: 'all', sort: home.shelf || 'new', q: '' }
      : { cat: home.cat, sort: home.shelf || 'new', q: home.q },
  )
  const entries =
    browse.kind !== 'found'
      ? []
      : home.by
        ? browse.entries.filter((entry) => entry.authorName === home.by)
        : browse.entries
  return { browse, retry, entries }
}
export type ExploreFeed = ReturnType<typeof useExploreFeed>

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
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={`${t('explore.sort')}: ${t(`explore.shelves.${sort}`)}`}
          className="flex min-h-11 items-center gap-2 rounded-control text-base font-semibold text-link focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          {t(`explore.shelves.${sort}`)}
          <ArrowUpDown aria-hidden className="size-4.5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-55">
          <DropdownMenuRadioGroup value={sort} onValueChange={(next: PublicSort) => onSort(next)}>
            {EXPLORE_SHELVES.map((value) => (
              <DropdownMenuRadioItem
                key={value}
                value={value}
                closeOnClick
                className="min-h-11 text-base"
              >
                {t(`explore.shelves.${value}`)}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

/**
 * Explore's feed (the Explore board): a picture card per item, two across on a phone and as many as
 * fit from 16rem on a laptop; one person's alone where People opened them (`by`). People lists who
 * publishes. While asked, grey cards; a search with no match says so, with Clear; nothing
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
  return (
    <section className="flex flex-col gap-3">
      {browse.kind === 'loading' ? (
        <CardsLoading count={8} />
      ) : browse.kind === 'failed' ? (
        <ExploreFailed reason={browse.reason} onRetry={retry} />
      ) : home.kind === 'people' ? (
        <ExplorePeople entries={browse.entries} query={home.q} onClear={onClear} />
      ) : entries.length === 0 && query ? (
        <Said
          icon={SearchX}
          title={t(patterns ? 'explore.noMatchPatterns' : 'explore.noMatch', { query })}
          action={
            <Button variant="soft" onClick={onClear}>
              {t('explore.clear')}
            </Button>
          }
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
