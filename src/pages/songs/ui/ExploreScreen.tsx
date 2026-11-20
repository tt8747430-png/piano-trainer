import { useTranslation } from 'react-i18next'
import { cn, LAPTOP, useMediaQuery, useSetSearch } from '@/shared/lib'
import {
  BackButton,
  ChoiceChips,
  FilterChips,
  ScreenHeader,
  SearchField,
  Segmented,
} from '@/shared/ui'
import { PLACE_COLUMN, PlaceBar } from '@/widgets/song-library'
import { EXPLORE_CATEGORIES, EXPLORE_KINDS, type SongsHome } from '../model/explore-view'
import { ExploreResults, ExploreSort } from './ExploreResults'
import { useExploreFeed } from './use-explore-feed'
import { FRESH } from './songs-fresh'

/**
 * Explore (B3, D1; the Explore boards, flat.io's search and community lists): what learners published,
 * a place of Songs. On a laptop the frame every Songs place shares (`PlaceBar`: its name and count,
 * the search at the bar's trailing edge), then one row: Songs | People, the kinds as chips, the order
 * at the right; then All songs' table. On a phone, with Back, the search, Songs | People under it, the
 * kinds as chips and the count with the order, then the songs as one list, or the people who publish.
 */
export function ExploreScreen({ home }: { home: SongsHome }) {
  const { t } = useTranslation('songs')
  const show = useSetSearch<SongsHome>()
  const laptop = useMediaQuery(LAPTOP)
  const songs = home.kind !== 'people'
  const feed = useExploreFeed(home)
  const search = (
    <SearchField
      value={home.q}
      onChange={(q) => show({ q })}
      label={t('explore.search')}
      screen={t('explore.views.explore')}
    />
  )
  const sort = <ExploreSort home={home} feed={feed} onSort={(shelf) => show({ shelf })} />
  const byChip = home.by ? (
    <FilterChips
      chips={[{ id: 'by', name: t('explore.by', { name: home.by }), off: () => show({ by: '' }) }]}
    />
  ) : null
  const results = <ExploreResults home={home} feed={feed} onClear={() => show({ q: '' })} />
  const kinds = (
    <Segmented
      label={t('explore.kinds.label')}
      value={home.kind}
      options={EXPLORE_KINDS.map((kind) => ({
        value: kind,
        label: t(`explore.kinds.${kind}`),
      }))}
      onChange={(kind) => show({ kind, by: '' })}
    />
  )
  const categories = (
    <ChoiceChips
      label={t('explore.categories.label')}
      value={home.cat}
      options={EXPLORE_CATEGORIES.map((cat) => ({
        value: cat,
        label: t(`explore.categories.${cat}`),
      }))}
      onChange={(cat) => show({ cat })}
      scroll={!laptop}
    />
  )
  // On a laptop the place's frame (LPLACEBAR): the name and its count, the search at the bar's
  // trailing edge; one row under it, Songs | People, the kinds as chips, the order at the right.
  if (laptop)
    return (
      <div className={cn('flex flex-col gap-4 pb-4', PLACE_COLUMN)}>
        <PlaceBar
          title={t('explore.views.explore')}
          count={
            songs && feed.browse.kind === 'found' && feed.entries.length > 0
              ? t(home.cat === 'patterns' ? 'explore.patternCount' : 'explore.songCount', {
                  count: feed.entries.length,
                })
              : undefined
          }
          search={search}
        />
        <div className="flex min-w-0 flex-col items-start gap-3 xl:flex-row xl:items-center xl:gap-4">
          <div className="w-55 shrink-0">{kinds}</div>
          <div className="min-w-0 flex-1 max-xl:w-full">
            {songs ? (byChip ?? categories) : null}
          </div>
          {songs ? (
            <ExploreSort
              home={home}
              feed={feed}
              onSort={(shelf) => show({ shelf })}
              counted={false}
            />
          ) : null}
        </div>
        {results}
      </div>
    )
  return (
    <div className="flex flex-col gap-4 pb-4">
      <ScreenHeader
        title={t('explore.views.explore')}
        back={<BackButton label={t('title')} onClick={() => show({ ...FRESH, view: 'mine' })} />}
      />
      {/* The Explore board's column: the search 8 under the bar, Songs | People 16 under it, the
          kinds 12 under that. */}
      <div className="-mt-2 flex min-w-0 flex-col gap-4">
        {search}
        {kinds}
        {songs ? (
          <div className="flex flex-col gap-1">
            {byChip ?? categories}
            {sort}
          </div>
        ) : null}
      </div>
      {results}
    </div>
  )
}
