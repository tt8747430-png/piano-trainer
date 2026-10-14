import { Link, useSearch } from '@tanstack/react-router'
import { Search, Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useViewChange } from '@/shared/lib'
import { RoundLink, ScreenHeader, Segmented } from '@/shared/ui'
import { ContinueCard } from '@/widgets/continue-card'
import { Journey } from '@/widgets/journey'
import { RecentPieces } from '@/widgets/piece-list'
import { PracticeDays } from '@/widgets/practice-days'
import { LEARN_VIEWS, type LearnView } from '../model/learn-view'
import { CourseShelves } from './CourseShelves'

/**
 * Learn (ADR 0049), the app's first place: Continue, the days practised and the songs played last,
 * then the curriculum as a Journey (the Path's levels as a map) or as Courses (every module on its
 * shelf), the view in the URL.
 */
export function LearnPage() {
  const { t } = useTranslation(['learn', 'common'])
  const { view } = useSearch({ from: '/shell/' })
  const set = useViewChange<LearnView>()
  return (
    <div className="flex flex-col">
      <ScreenHeader
        title={t('learn:title')}
        actions={
          // A laptop's sidebar has Search and Settings at its foot.
          <div className="flex gap-2 lg:hidden">
            <RoundLink
              label={t('common:nav.search')}
              icon={Search}
              render={<Link to="/search" />}
            />
            <RoundLink
              label={t('common:nav.settings')}
              icon={Settings}
              render={<Link to="/settings" />}
            />
          </div>
        }
      />
      <div className="mt-2 flex flex-col gap-8">
        <div className="flex flex-col gap-6">
          <ContinueCard />
          <PracticeDays />
          <RecentPieces />
        </div>
        <div className="flex flex-col gap-6">
          <div className="max-w-sm">
            <Segmented
              label={t('learn:views.label')}
              value={view}
              options={LEARN_VIEWS.map((value) => ({ value, label: t(`learn:views.${value}`) }))}
              onChange={(next) => set({ view: next })}
            />
          </div>
          {view === 'journey' ? <Journey /> : <CourseShelves />}
        </div>
      </div>
    </div>
  )
}
