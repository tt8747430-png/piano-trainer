import { useTranslation } from 'react-i18next'
import { useSetSearch } from '@/shared/lib'
import {
  ChoiceChips,
  FilterChips,
  ScreenHeader,
  SearchField,
  Segmented,
  TitleTabs,
} from '@/shared/ui'
import { EXPLORE_CATEGORIES, EXPLORE_KINDS, type SongsHome } from '../model/explore-view'
import { ExploreResults } from './ExploreResults'
import { useSongsViews } from './SongsSwitch'

/**
 * Explore (B3, D1; R72, Flat's community): Songs' second view, what learners published. Its bar the
 * library's with the switch; the search, of songs and people; Songs | People; for Songs the kinds as
 * chips (Patterns the patterns), or one person's songs as a chip that takes it off; then the feed
 * (its count and order, a card per item) or the people who publish.
 */
export function ExploreScreen({ home }: { home: SongsHome }) {
  const { t } = useTranslation('songs')
  const show = useSetSearch<SongsHome>()
  const views = useSongsViews('explore')
  return (
    <div className="flex flex-col gap-4 pb-4">
      <ScreenHeader title={t('title')} large views={<TitleTabs {...views} />} />
      <div className="flex min-w-0 flex-col gap-3">
        <div className="lg:max-w-2xl">
          <SearchField
            value={home.q}
            onChange={(q) => show({ q })}
            label={t('explore.search')}
            screen={t('explore.views.explore')}
          />
        </div>
        <div className="lg:max-w-2xl">
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
        </div>
        {home.kind === 'people' ? null : home.by ? (
          <FilterChips
            chips={[
              { id: 'by', name: t('explore.by', { name: home.by }), off: () => show({ by: '' }) },
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
      <ExploreResults
        home={home}
        onSort={(shelf) => show({ shelf })}
        onClear={() => show({ q: '' })}
      />
    </div>
  )
}
