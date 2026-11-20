import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import {
  ownCourseLessons,
  selectOwnLessons,
  useOwnLessons,
  useOwnLessonsStoreApi,
  type OwnCourse,
} from '@/entities/own-lessons'
import { useProgressStoreApi } from '@/entities/progress'
import { lessonStepId } from '@/entities/step'
import {
  duplicateOwnCourse,
  renameOwnCourse,
  setOwnCourseLook,
} from '@/features/manage-own-lessons'
import { LookFields } from '@/features/manage-library'
import { ResetStepsRow } from '@/features/reset-progress'
import { type SettingsWindowState } from '@/shared/lib'
import { say, sayUndo, SettingsGroup, SettingsWindow, ThingHead } from '@/shared/ui'
import { deleteOwn, OwnDeleteGroup, OwnItemRows } from '@/widgets/curriculum'
import { CourseMark } from './CourseMark'

/**
 * A course of the learner's own's Settings (R30-5), as a course's: The course, Rename and Duplicate
 * (the copy opened); its lessons' progress reset; and Delete last, at once with Undo, its lessons kept.
 */
export function OwnCourseSettings({
  course,
  open,
  onOpenChange,
}: { course: OwnCourse } & SettingsWindowState) {
  const { t } = useTranslation('learn')
  const navigate = useNavigate()
  const progress = useProgressStoreApi()
  const store = useOwnLessonsStoreApi()
  const lessons = ownCourseLessons(course, useOwnLessons(selectOwnLessons))
  return (
    <SettingsWindow open={open} onOpenChange={onOpenChange} title={t('settings.title')}>
      <div className="flex flex-col gap-6">
        <ThingHead
          mark={<CourseMark />}
          name={course.title}
          line={t('own.courseLine', { count: lessons.length })}
        />
        <OwnItemRows
          title={course.title}
          words={{ group: t('settings.course'), rename: t('own.renameCourse') }}
          onRename={(name) => renameOwnCourse(store, course.id, name)}
          onDuplicate={() => {
            const copy = duplicateOwnCourse(
              store,
              course.id,
              t('own.copyName', { name: course.title }),
            )
            if (!copy) return
            say(t('own.duplicated'))
            void navigate({ to: '/courses/$courseId', params: { courseId: copy } })
          }}
        />
        {/* Its cover, chosen here as on the New course sheet: the picture and its paint. */}
        <SettingsGroup title={t('own.cover')} bare>
          <LookFields
            pictures={false}
            paintLabel={false}
            covers
            look={course.look}
            onChange={(look) => setOwnCourseLook(store, course.id, look)}
          />
        </SettingsGroup>
        <ResetStepsRow
          steps={lessons.map(({ lesson }) => lessonStepId(lesson.id))}
          words={{
            row: t('settings.reset'),
            done: t('settings.resetDone'),
            undo: t('settings.undo'),
          }}
        />
        <OwnDeleteGroup
          words={{
            delete: t('own.deleteCourse'),
          }}
          onDelete={() => {
            void navigate({ to: '/your-lessons', replace: true })
            const deleted = deleteOwn(store, progress, { courses: [course.id] })
            if (deleted) sayUndo(t('own.deleted', { title: course.title }), deleted.undo)
          }}
        />
      </div>
    </SettingsWindow>
  )
}
