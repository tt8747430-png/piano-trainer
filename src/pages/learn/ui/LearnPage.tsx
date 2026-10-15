import { Link, useSearch } from '@tanstack/react-router'
import { Search, Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { journeyById } from '@/entities/lesson'
import { selectLearned, useProgress } from '@/entities/progress'
import { RoundLink, ScreenHeader } from '@/shared/ui'
import { ContinueCard } from '@/widgets/continue-card'
import { CourseShelves, currentJourney, JourneyMap } from '@/widgets/curriculum'
import { RecentPieces } from '@/widgets/piece-list'
import { PracticeDays } from '@/widgets/practice-days'
import { LearnViewToggle } from './LearnViewToggle'

/**
 * Learn (ADR 0053), the app's first place: its header's toggle between the Lessons, four journeys of
 * chapters as the journey-app lays them out, and the Courses, shelves of courses as the courses-app
 * has them. Beside them Continue, the days practised and the songs played last.
 */
export function LearnPage() {
  const { t } = useTranslation(['learn', 'common'])
  const { view, journey: journeyId } = useSearch({ from: '/shell/' })
  const learned = useProgress(selectLearned)
  const journey = journeyById(journeyId) ?? currentJourney(learned)
  return (
    <div className="flex flex-col">
      <ScreenHeader
        title={t('learn:title')}
        actions={
          <div className="flex items-center gap-2">
            <LearnViewToggle shown={view} />
            {/* A laptop's sidebar has Search and Settings at its foot. */}
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
          </div>
        }
      />
      {/* On a phone: Continue, the Lessons or the Courses, then the days and the songs played last.
          On a laptop the Lessons or the Courses run down the left, the rest stands on the right. */}
      <div className="mt-2 grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:grid-rows-[auto_1fr] lg:gap-x-12">
        <div className="lg:col-start-2 lg:row-start-1">
          <ContinueCard />
        </div>
        <div className="flex min-w-0 flex-col gap-4 lg:col-start-1 lg:row-span-2 lg:row-start-1">
          {view === 'lessons' ? (
            <div className="mx-auto w-full max-w-2xl">
              <JourneyMap journey={journey} />
            </div>
          ) : (
            <CourseShelves />
          )}
        </div>
        <div className="flex flex-col gap-6 lg:col-start-2 lg:row-start-2">
          <PracticeDays />
          <RecentPieces />
        </div>
      </div>
    </div>
  )
}
