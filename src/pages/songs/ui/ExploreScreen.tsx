import { useTranslation } from 'react-i18next'
import { useSetSearch } from '@/shared/lib'
import {
  BackButton,
  ChoiceChips,
  FilterChips,
  ScreenHeader,
  SearchField,
  Segmented,
} from '@/shared/ui'
import { EXPLORE_CATEGORIES, EXPLORE_KINDS, type SongsHome } from '../model/explore-view'
import { ExploreResults, ExploreSort, useExploreFeed } from './ExploreResults'
import { FRESH } from './songs-fresh'

/**
 * Explore (B3, D1; the Explore board, Flat's community): what learners published, a page of its own
 * under Songs with Back. One toolbar: the search, of songs and people, with Songs | People beside it on
 * a laptop and under it on a phone; for Songs the kinds as chips (or one person's songs as a chip that
 * takes it off) with the count and the order on the same row's right, always in sight; then the songs
 * as picture cards, or the people who publish.
 */
export function ExploreScreen({ home }: { home: SongsHome }) {
  const { t } = useTranslation('songs')
  const show = useSetSearch<SongsHome>()
  const songs = home.kind !== 'people'
  const feed = useExploreFeed(home)
  const kinds = (
    <Segmented
      label={t('explore.kinds.label')}
      value={home.kind}
      options={EXPLORE_KINDS.map((kind) => ({ value: kind, label: t(`explore.kinds.${kind}`) }))}
      onChange={(kind) => show({ kind, by: '' })}
      compact
    />
  )
  return (
    <div className="flex flex-col gap-4 pb-4">
      <ScreenHeader
        title={t('explore.views.explore')}
        large
        back={<BackButton label={t('title')} onClick={() => show({ ...FRESH, view: 'mine' })} />}
      />
      <div className="flex min-w-0 flex-col gap-3 lg:gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
          <div className="min-w-0 lg:max-w-160 lg:flex-1">
            <SearchField
              value={home.q}
              onChange={(q) => show({ q })}
              label={t('explore.search')}
              screen={t('explore.views.explore')}
            />
          </div>
          <div className="lg:w-70 lg:shrink-0">{kinds}</div>
        </div>
        {songs ? (
          <div className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-6">
            <div className="min-w-0 lg:flex-1">
              {home.by ? (
                <FilterChips
                  chips={[
                    {
                      id: 'by',
                      name: t('explore.by', { name: home.by }),
                      off: () => show({ by: '' }),
                    },
                  ]}
                />
              ) : (
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
            </div>
            <ExploreSort home={home} feed={feed} onSort={(shelf) => show({ shelf })} />
          </div>
        ) : null}
      </div>
      <ExploreResults home={home} feed={feed} onClear={() => show({ q: '' })} />
    </div>
  )
}
