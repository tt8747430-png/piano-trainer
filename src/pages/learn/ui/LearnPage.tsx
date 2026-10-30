import { Link, useSearch } from '@tanstack/react-router'
import { LibraryBig, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { journeyById } from '@/entities/lesson'
import { selectLearned, useProgress } from '@/entities/progress'
import { editsContent, useAccount } from '@/shared/lib/account'
import { FabLink, FloatingActions, NavTab, NavTabs, RoundLink, ScreenHeader } from '@/shared/ui'
import { PlaceActions } from '@/widgets/app-nav'
import { ContinueAction } from '@/widgets/continue-action'
import { CourseShelves, currentJourney, JourneyLibrary } from '@/widgets/curriculum'

/**
 * Learn (ADR 0053), the app's first place, a library: its header's toggle between the Lessons, a
 * level chosen from its chips and its chapters as groups of rows, and the Courses, shelves of
 * courses as rows; Continue over both. An editor's Manage lessons or New course floats over it.
 */
export function LearnPage() {
  const { t } = useTranslation(['learn', 'common'])
  const { view, journey: journeyId } = useSearch({ from: '/shell/' })
  const learned = useProgress(selectLearned)
  const { account } = useAccount()
  const journey = journeyById(journeyId) ?? currentJourney(learned)
  return (
    <div className="flex flex-col">
      <ScreenHeader
        title={t('learn:title')}
        large
        actions={
          <>
            {/* An editor's way to the Lessons' order: the screen's own action, in its bar. */}
            {editsContent(account) && view === 'lessons' ? (
              <RoundLink
                label={t('learn:edit.journey.open')}
                icon={LibraryBig}
                render={<Link to="/journeys/$journeyId/edit" params={{ journeyId: journey.id }} />}
              />
            ) : null}
            <PlaceActions />
          </>
        }
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
      {/* What to do next first; then the Lessons or the Courses. The days practised are the
          Profile's. */}
      <div className="mx-auto mt-4 flex w-full max-w-2xl min-w-0 flex-col gap-8">
        <ContinueAction />
        {view === 'lessons' ? <JourneyLibrary journey={journey} /> : <CourseShelves />}
      </div>
      {/* An editor's way to change what is shown: the journey, or a new course (ADR 0116). */}
      {/* Creating is the + floating action: an editor's New course. */}
      {editsContent(account) && view === 'courses' ? (
        <FloatingActions>
          <FabLink
            label={t('learn:edit.course.new')}
            icon={Plus}
            render={<Link to="/courses/new" />}
          />
        </FloatingActions>
      ) : null}
    </div>
  )
}
