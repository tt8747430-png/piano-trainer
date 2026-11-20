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
import {
  deleteOwnCourse,
  duplicateOwnCourse,
  renameOwnCourse,
  restoreOwnCourse,
  setOwnCourseLook,
} from '@/features/manage-own-lessons'
import { LookFields } from '@/features/manage-library'
import { ResetStepsRow } from '@/features/reset-progress'
import { BackButton, say, ScreenHeader, SettingsGroup, ThingHead } from '@/shared/ui'
import { OwnDeleteGroup, OwnItemRows } from '@/widgets/curriculum'
import { CourseMark } from './CourseMark'

/**
 * A course of the learner's own's Settings (R30-5), as a course's: The course, Rename and Duplicate
 * (the copy opened); its lessons' progress reset; and Delete last, at once with Undo, its lessons kept.
 */
export function OwnCourseSettings({ course }: { course: OwnCourse }) {
  const { t } = useTranslation('learn')
  const navigate = useNavigate()
  const store = useOwnLessonsStoreApi()
  const lessons = ownCourseLessons(course, useOwnLessons(selectOwnLessons))
  return (
    <div className="flex flex-col gap-2 pb-8 lg:gap-6">
      <ScreenHeader column="until-laptop" title={t('settings.title')} back={<BackButton />} />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 lg:max-w-295">
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
            const deleted = deleteOwnCourse(store, course.id)
            if (!deleted) return
            say(t('own.deleted', { title: course.title }), {
              label: t('settings.undo'),
              onClick: () => restoreOwnCourse(store, deleted),
            })
          }}
        />
      </div>
    </div>
  )
}
