import { useSearch } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useCan } from '@/entities/library'
import { useSetSearch } from '@/shared/lib'
import { BackButton, ScreenHeader } from '@/shared/ui'
import { CourseShelves, CoursesAbout, ShelfEditor, type LearnEdit } from '@/widgets/curriculum'

/**
 * The Courses (canvas 163), opened from Learn's See all: their title in the bar with Back to Learn,
 * what the courses are in its ⓘ, and the shelves. An editor's Edit is the bar's glass word beside the
 * ⓘ, as the board's, and puts the shelves in Edit mode in place, where it becomes Done.
 */
export function CoursesPage() {
  const { t } = useTranslation('learn')
  const { edit } = useSearch({ from: '/shell/courses' })
  const show = useSetSearch<LearnEdit>()
  const editable = useCan('reorder', { curriculum: 'shelf' })
  const editing = edit && editable
  const bar = (actions: ReactNode) => (
    <ScreenHeader
      title={t('courses')}
      large
      back={editing ? undefined : <BackButton />}
      tools={
        <>
          {actions}
          {editing ? null : <CoursesAbout />}
        </>
      }
      edit={
        editable
          ? { editing, onEdit: () => show({ edit: true }), onDone: () => show({ edit: false }) }
          : undefined
      }
    />
  )
  return (
    <div className="flex flex-col pb-8">
      {editing ? (
        <ShelfEditor bar={bar} />
      ) : (
        <>
          {bar(null)}
          <div className="mt-2 lg:mt-4">
            <CourseShelves />
          </div>
        </>
      )}
    </div>
  )
}
