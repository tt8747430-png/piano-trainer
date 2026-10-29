import { useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { journeyById } from '@/entities/lesson'
import { selectLearned, useProgress } from '@/entities/progress'
import { NavTab, NavTabs, ScreenHeader } from '@/shared/ui'
import { PlaceActions } from '@/widgets/app-nav'
import { ContinueAction } from '@/widgets/continue-action'
import { CourseShelves, currentJourney, JourneyMap } from '@/widgets/curriculum'
import { RecentPieces } from '@/widgets/piece-list'
import { PracticeDays } from '@/widgets/practice-days'

/**
 * Learn (ADR 0053), the app's first place: its header's toggle between the Lessons, four journeys of
 * chapters as the journey-app lays them out, and the Courses, shelves of courses as the courses-app
 * has them. Beside them the days practised and the songs played last; Continue floats over it.
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
        large
        actions={<PlaceActions />}
        tabs={
          <NavTabs label={t('learn:views.label')}>
            {(['lessons', 'courses'] as const).map((shown) => (
              <NavTab
                key={shown}
                to="/"
                search={{ view: shown, journey: '' }}
                replace
                current={shown === view}
              >
                {t(`learn:views.${shown}`)}
              </NavTab>
            ))}
          </NavTabs>
        }
      />
      {/* What to do next first; then the Lessons or the Courses; the days and the songs played last
          after them on a phone, beside them on a laptop. */}
      <div className="mt-4 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-x-12">
        <div className="flex min-w-0 flex-col gap-8">
          <div className="mx-auto w-full max-w-2xl">
            <ContinueAction />
          </div>
          {view === 'lessons' ? (
            <div className="mx-auto w-full max-w-2xl">
              <JourneyMap journey={journey} />
            </div>
          ) : (
            <CourseShelves />
          )}
        </div>
        <div className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start">
          <PracticeDays />
          <RecentPieces />
        </div>
      </div>
    </div>
  )
}
