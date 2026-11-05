import { useTranslation } from 'react-i18next'
import { useSetSearch } from '@/shared/lib'
import { ChoiceChips, ScreenHeader, SearchField, TitleTabs } from '@/shared/ui'
import { EXPLORE_CATEGORIES, type SongsHome } from '../model/explore-view'
import { ExploreResults } from './ExploreResults'
import { ExploreShelves } from './ExploreShelves'
import { useSongsViews } from './SongsSwitch'

/**
 * Explore (B3, D1, Noji's library page): Songs' second view, what learners published. Its bar the
 * library's with the switch; the search; the categories as chips (Patterns the patterns); then,
 * with nothing searched, the shelves New, Most saved and Top rated, each with See all; searched or
 * a shelf opened, a grid of cards in an order of the learner's.
 */
export function ExploreScreen({ home }: { home: SongsHome }) {
  const { t } = useTranslation('songs')
  const show = useSetSearch<SongsHome>()
  const views = useSongsViews('explore')
  const listing = home.q.trim() !== '' || home.shelf !== ''
  return (
    <div className="flex flex-col gap-4 pb-4">
      <ScreenHeader title={t('title')} large views={<TitleTabs {...views} />} />
      <div className="flex min-w-0 flex-col gap-3">
        <div className="lg:max-w-2xl">
          <SearchField
            value={home.q}
            onChange={(q) => show({ q })}
            label={t('explore.search')}
            hint={t('searchHint')}
            screen={t('explore.views.explore')}
          />
        </div>
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
      </div>
      {listing ? (
        <ExploreResults
          home={home}
          onSort={(shelf) => show({ shelf })}
          onClear={() => show({ q: '' })}
          onShelves={() => show({ shelf: '', q: '' })}
        />
      ) : (
        <ExploreShelves cat={home.cat} onSeeAll={(shelf) => show({ shelf })} />
      )}
    </div>
  )
}
