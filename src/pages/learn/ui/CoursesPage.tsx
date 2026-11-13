import { useSearch } from '@tanstack/react-router'
import { PencilLine } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useCan } from '@/entities/library'
import { useSetSearch } from '@/shared/lib'
import { BackButton, MoreMenu, ScreenHeader } from '@/shared/ui'
import { CourseShelves, CoursesAbout, ShelfEditor, type LearnEdit } from '@/widgets/curriculum'

/**
 * The Courses (canvas 163), opened from Learn's See all: their title in the bar with Back to Learn,
 * what the courses are in its ⓘ, and the shelves. An editor's Edit is in its More and puts the
 * shelves in Edit mode in place (R29 B4).
 */
export function CoursesPage() {
  const { t } = useTranslation(['learn', 'common'])
  const { edit } = useSearch({ from: '/shell/courses' })
  const show = useSetSearch<LearnEdit>()
  const editable = useCan('reorder', { curriculum: 'shelf' })
  const editing = edit && editable
  const bar = (actions: ReactNode) => (
    <ScreenHeader
      title={t('learn:courses')}
      large
      back={editing ? undefined : <BackButton />}
      tools={
        <>
          {actions}
          {editing ? null : <CoursesAbout />}
        </>
      }
      edit={
        editing
          ? { editing, onEdit: () => show({ edit: true }), onDone: () => show({ edit: false }) }
          : undefined
      }
      more={
        editing ? undefined : (
          <MoreMenu
            actions={[
              {
                key: 'edit',
                label: t('common:editMode.edit'),
                icon: PencilLine,
                hidden: !editable,
                onSelect: () => show({ edit: true }),
              },
            ]}
          />
        )
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
          <div className="mt-2">
            <CourseShelves />
          </div>
        </>
      )}
    </div>
  )
}
