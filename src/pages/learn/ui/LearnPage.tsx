import { useSearch } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useCan } from '@/entities/library'
import { journeyById } from '@/entities/lesson'
import { selectLearned, useProgress } from '@/entities/progress'
import { cn, useSetSearch } from '@/shared/lib'
import { ScreenHeader, TitleTabs } from '@/shared/ui'
import { PlaceActions } from '@/widgets/app-nav'
import { ContinueAction } from '@/widgets/continue-action'
import {
  CourseShelves,
  currentJourney,
  JourneyLibrary,
  LearnNav,
  LevelEditor,
  OwnCourses,
  OWN_LESSONS,
  ShelfEditor,
  type LearnView,
} from '@/widgets/curriculum'

/**
 * Learn (ADR 0053), the app's first place, a library: its bar's switch (in the title's place) between
 * the Lessons, a level chosen from its chips and its chapters as groups of rows, and the Courses,
 * shelves of courses as rows; Continue over both. An editor's Edit (R29 B4), at the bar's end, puts
 * the level or the shelves in Edit mode in place: their draft's status and Publish beside Done.
 * Outside Edit mode an editor sees the page a learner sees.
 */
export function LearnPage() {
  const { t } = useTranslation(['learn', 'common'])
  const { view, journey: journeyId, edit } = useSearch({ from: '/shell/' })
  const learned = useProgress(selectLearned)
  const own = view === 'lessons' && journeyId === OWN_LESSONS
  const journey = journeyById(journeyId) ?? currentJourney(learned)
  const show = useSetSearch<LearnView>()
  const editable = useCan('reorder', { curriculum: view === 'lessons' ? 'level' : 'shelf' })
  // Your lessons have no Edit mode: each is edited on its own page.
  const editing = edit && editable && !own
  const toggle =
    editable && !own
      ? { editing, onEdit: () => show({ edit: true }), onDone: () => show({ edit: false }) }
      : undefined
  const bar = (actions: ReactNode) => (
    <ScreenHeader
      title={t('learn:title')}
      large
      tools={
        <>
          {actions}
          {editing ? null : <PlaceActions />}
        </>
      }
      edit={toggle}
      views={
        <TitleTabs
          label={t('learn:views.label')}
          value={view}
          options={(['lessons', 'courses'] as const).map((shown) => ({
            value: shown,
            label: t(`learn:views.${shown}`),
          }))}
          onChange={(shown) => show({ view: shown, journey: '' })}
        />
      }
    />
  )
  if (editing)
    return (
      <div className="flex flex-col pb-8">
        {view === 'lessons' ? (
          <LevelEditor key={journey.id} journey={journey} bar={bar} />
        ) : (
          <ShelfEditor bar={bar} />
        )}
      </div>
    )
  const shown = own ? OWN_LESSONS : journey
  return (
    <div className="flex flex-col">
      {bar(null)}
      {/* Canvas 128. A phone: the level's chips, Continue, then the level. A laptop: the level list,
          the level, then Continue and Your courses. The days practised are the Profile's. */}
      <div className="mt-4 grid min-w-0 gap-8 lg:grid-cols-[15rem_minmax(0,1fr)_18rem] lg:items-start xl:grid-cols-[16rem_minmax(0,1fr)_20rem]">
        {view === 'lessons' ? (
          <aside className="hidden lg:sticky lg:top-4 lg:block">
            <LearnNav view={view} journey={shown} />
          </aside>
        ) : null}
        <div
          className={cn(
            'mx-auto flex w-full max-w-2xl min-w-0 flex-col gap-8',
            view === 'courses' && 'lg:col-span-2 lg:mx-0',
          )}
        >
          {view === 'lessons' ? (
            <JourneyLibrary
              journey={shown}
              lead={
                <div className="lg:hidden">
                  <ContinueAction />
                </div>
              }
            />
          ) : (
            <>
              <div className="lg:hidden">
                <ContinueAction />
              </div>
              <CourseShelves />
            </>
          )}
        </div>
        <aside className="hidden lg:sticky lg:top-4 lg:flex lg:flex-col lg:gap-8">
          <ContinueAction />
          {view === 'lessons' ? <OwnCourses /> : null}
        </aside>
      </div>
    </div>
  )
}
