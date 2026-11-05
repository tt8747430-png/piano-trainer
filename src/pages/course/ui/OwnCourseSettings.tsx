import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import {
  ownCourseLessons,
  selectOwnLessons,
  useOwnLessons,
  useOwnLessonsStoreApi,
  type OwnCourse,
} from '@/entities/own-lessons'
import { lessonStepId } from '@/entities/step'
import { deleteOwnCourse, duplicateOwnCourse, renameOwnCourse } from '@/features/manage-own-lessons'
import { ResetStepsRow } from '@/features/reset-progress'
import { BackButton, say, ScreenHeader } from '@/shared/ui'
import { OwnDeleteGroup, OwnItemRows } from '@/widgets/curriculum'

/**
 * A course of the learner's own's Settings (R30-5), as a course's: The course, Rename and Duplicate
 * (the copy opened); its lessons' progress reset; and Delete last, asked first, its lessons kept.
 */
export function OwnCourseSettings({ course }: { course: OwnCourse }) {
  const { t } = useTranslation('learn')
  const navigate = useNavigate()
  const store = useOwnLessonsStoreApi()
  const lessons = ownCourseLessons(course, useOwnLessons(selectOwnLessons))
  return (
    <div className="flex flex-col gap-6 pb-8">
      <ScreenHeader title={t('settings.title')} back={<BackButton />} />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-7">
        <p className="px-1 font-display text-2xl font-semibold text-balance">{course.title}</p>
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
        <ResetStepsRow
          steps={lessons.map(({ lesson }) => lessonStepId(lesson.id))}
          words={{
            row: t('settings.reset'),
            title: t('settings.resetCourse'),
            body: t('settings.resetOwnCourseBody'),
            cancel: t('settings.cancel'),
            confirm: t('settings.confirm'),
            done: t('settings.resetDone'),
          }}
        />
        <OwnDeleteGroup
          words={{
            delete: t('own.deleteCourse'),
            deleteTitle: t('own.deleteCourseTitle', { title: course.title }),
            deleteBody: t('own.deleteCourseBody'),
          }}
          onDelete={() => {
            deleteOwnCourse(store, course.id)
            say(t('own.deleted'))
            void navigate({ to: '/', search: { view: 'courses' }, replace: true })
          }}
        />
      </div>
    </div>
  )
}
