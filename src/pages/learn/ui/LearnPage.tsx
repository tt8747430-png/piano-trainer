import { useSearch } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useCan } from '@/entities/library'
import { journeyById } from '@/entities/lesson'
import { selectLearned, useProgress } from '@/entities/progress'
import { useSetSearch } from '@/shared/lib'
import { ScreenHeader, Segmented } from '@/shared/ui'
import { PlaceActions } from '@/widgets/app-nav'
import { ContinueAction } from '@/widgets/continue-action'
import {
  CourseShelves,
  currentJourney,
  JourneyLibrary,
  LevelEditor,
  ShelfEditor,
  type LearnView,
} from '@/widgets/curriculum'
import { EditToggle } from '@/widgets/mode-switch'

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
  const journey = journeyById(journeyId) ?? currentJourney(learned)
  const show = useSetSearch<LearnView>()
  const editable = useCan('reorder', { curriculum: view === 'lessons' ? 'level' : 'shelf' })
  const editing = edit && editable
  const toggle = editable ? (
    <EditToggle
      editing={editing}
      onEdit={() => show({ edit: true })}
      onDone={() => show({ edit: false })}
    />
  ) : null
  const bar = (actions: ReactNode) => (
    <ScreenHeader
      title={t('learn:title')}
      large
      actions={
        <>
          {actions}
          {editing ? null : <PlaceActions />}
          {toggle}
        </>
      }
      switcher={
        <Segmented
          label={t('learn:views.label')}
          value={view}
          options={(['lessons', 'courses'] as const).map((shown) => ({
            value: shown,
            label: t(`learn:views.${shown}`),
          }))}
          onChange={(shown) => show({ view: shown, journey: '' })}
          compact
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
  return (
    <div className="flex flex-col">
      {bar(null)}
      {/* What to do next first; then the Lessons or the Courses. The days practised are the
          Profile's. */}
      <div className="mx-auto mt-4 flex w-full max-w-2xl min-w-0 flex-col gap-8">
        <ContinueAction />
        {view === 'lessons' ? <JourneyLibrary journey={journey} /> : <CourseShelves />}
      </div>
    </div>
  )
}
