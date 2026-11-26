import { useNavigate } from '@tanstack/react-router'
import { Copy, Library, Settings, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useOwnLessonsStoreApi, type OwnCourse, type OwnLesson } from '@/entities/own-lessons'
import { useProgressStoreApi } from '@/entities/progress'
import { duplicateOwnCourse, duplicateOwnLesson } from '@/features/manage-own-lessons'
import { OPEN_SETTINGS } from '@/shared/lib'
import { LessonIcon, say, sayUndo, type MenuAction } from '@/shared/ui'
import { deleteOwn } from '../model/delete-own'

/** What a row holds: a lesson or a course of the learner's, by its id. */
type OwnThing =
  | { readonly kind: 'lesson'; readonly id: OwnLesson['id'] }
  | { readonly kind: 'course'; readonly id: OwnCourse['id'] }

/**
 * A row's More in Your lessons, one list for a lesson and a course: Open, Duplicate, Settings (its
 * page with the window over it), and
 * Delete at once with Undo in its toast.
 */
export function useOwnRowActions(thing: OwnThing, title: string): readonly MenuAction[] {
  const { t } = useTranslation('learn')
  const navigate = useNavigate()
  const store = useOwnLessonsStoreApi()
  const progress = useProgressStoreApi()
  return [
    {
      key: 'open',
      label: t('own.open'),
      icon: thing.kind === 'lesson' ? LessonIcon : Library,
      onSelect: () =>
        void (thing.kind === 'lesson'
          ? navigate({ to: '/lessons/$lessonId', params: { lessonId: thing.id } })
          : navigate({ to: '/courses/$courseId', params: { courseId: thing.id } })),
    },
    {
      key: 'duplicate',
      label: t('own.duplicate'),
      icon: Copy,
      onSelect: () => {
        const name = t('own.copyName', { name: title })
        const made =
          thing.kind === 'lesson'
            ? duplicateOwnLesson(store, thing.id, name)
            : duplicateOwnCourse(store, thing.id, name)
        if (made) say(t('own.duplicated'))
      },
    },
    {
      key: 'settings',
      label: t('own.settings'),
      icon: Settings,
      onSelect: () =>
        void (thing.kind === 'lesson'
          ? navigate({
              to: '/lessons/$lessonId',
              params: { lessonId: thing.id },
              state: OPEN_SETTINGS,
            })
          : navigate({
              to: '/courses/$courseId',
              params: { courseId: thing.id },
              state: OPEN_SETTINGS,
            })),
    },
    {
      key: 'delete',
      label: t('own.delete'),
      icon: Trash2,
      destructive: true,
      onSelect: () => {
        const deleted = deleteOwn(
          store,
          progress,
          thing.kind === 'lesson' ? { lessons: [thing.id] } : { courses: [thing.id] },
        )
        if (deleted) sayUndo(t('own.deleted', { title }), deleted.undo)
      },
    },
  ]
}
