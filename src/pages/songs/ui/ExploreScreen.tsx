import { useTranslation } from 'react-i18next'
import { LAPTOP, useMediaQuery, useSetSearch } from '@/shared/lib'
import {
  BackButton,
  ChoiceChips,
  FilterChips,
  ScreenHeader,
  SearchField,
  Segmented,
} from '@/shared/ui'
import { EXPLORE_CATEGORIES, EXPLORE_KINDS, type SongsHome } from '../model/explore-view'
import { ExplorePane } from './ExplorePane'
import { ExploreResults, ExploreSort, useExploreFeed } from './ExploreResults'
import { FRESH } from './songs-fresh'

/**
 * Explore (B3, D1; the Explore boards, flat.io's search and community lists): what learners published,
 * a page of its own under Songs with Back. On a laptop a pane at the left holds Songs | People and the
 * Kinds with their counts, the search and the order over the list beside it; on a phone the search, Songs
 * | People under it, the kinds as chips and the count with the order. Then the songs as rows, or the
 * people who publish.
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
  return (
    <div className="flex flex-col gap-4 pb-4">
      <ScreenHeader
        title={t('explore.views.explore')}
        large
        back={<BackButton label={t('title')} onClick={() => show({ ...FRESH, view: 'mine' })} />}
      />
      {laptop ? (
        <div className="grid grid-cols-[17.5rem_minmax(0,1fr)] items-start gap-8">
          <ExplorePane home={home} />
          <div className="flex min-w-0 flex-col gap-5">
            <div className="flex items-center gap-6">
              <div className="min-w-0 flex-1">{search}</div>
              {songs ? sort : null}
            </div>
            {byChip}
            {results}
          </div>
        </div>
      ) : (
        <>
          <div className="flex min-w-0 flex-col gap-3">
            {search}
            <Segmented
              label={t('explore.kinds.label')}
              value={home.kind}
              options={EXPLORE_KINDS.map((kind) => ({
                value: kind,
                label: t(`explore.kinds.${kind}`),
              }))}
              onChange={(kind) => show({ kind, by: '' })}
              compact
            />
            {songs ? (
              <div className="flex flex-col gap-1">
                {byChip ?? (
                  <ChoiceChips
                    label={t('explore.categories.label')}
                    value={home.cat}
                    options={EXPLORE_CATEGORIES.map((cat) => ({
                      value: cat,
                      label: t(`explore.categories.${cat}`),
                    }))}
                    onChange={(cat) => show({ cat })}
                    scroll
                  />
                )}
                {sort}
              </div>
            ) : null}
          </div>
          {results}
        </>
      )}
    </div>
  )
}
