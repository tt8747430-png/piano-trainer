import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { COURSES, courseById, courseStepIds, type Course } from '@/entities/course'
import { selectOwnCourse, useOwnLessons } from '@/entities/own-lessons'
import { DraftPublishing, RemoveGroup, useCourseDraft } from '@/features/edit-original'
import { ResetStepsRow } from '@/features/reset-progress'
import { localText, useLocale } from '@/shared/i18n'
import { shareLink } from '@/shared/lib'
import { editsContent, useAccount } from '@/shared/lib/account'
import {
  ActionRow,
  BackButton,
  RowLink,
  say,
  ScreenHeader,
  SettingsGroup,
  ThingHead,
} from '@/shared/ui'
import { useStanding } from '@/widgets/content-editor'
import { CourseMark } from './CourseMark'
import { OwnCourseSettings } from './OwnCourseSettings'

/**
 * A course's Settings (`/courses/$courseId/settings`), one shape with a lesson's (owner, 2026-11-18:
 * "refactor the courses settings like the lesons settings with better structure"; the board's
 * THINGSET): the course at the head (its picture, its name, its lessons), The course (the shelf it
 * stands on, a way to the shelves' Edit), Share, for an editor its Publishing, the learner's progress
 * in it, and Delete last and apart. One column, phone and laptop. A course of the learner's own
 * (R30-5): `OwnCourseSettings`.
 */
export function CourseSettingsPage() {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const { account } = useAccount()
  const navigate = useNavigate()
  const { courseId } = useParams({ from: '/shell/courses/$courseId/settings' })
  const own = useOwnLessons(selectOwnCourse(courseId))
  const course = courseById(courseId)
  if (own) return <OwnCourseSettings key={courseId} course={own} />
  // The route finds no course that is not there.
  if (!course) return null
  const title = localText(course.title, locale)
  const share = async () => {
    const shared = await shareLink({ title, path: `/courses/${course.id}` })
    if (shared === 'copied') say(t('settings.shared'))
    if (shared === 'failed') say(t('settings.shareFailed'))
  }
  return (
    <div className="flex flex-col gap-2 pb-8 lg:gap-6">
      <ScreenHeader column="until-laptop" title={t('settings.title')} back={<BackButton />} />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 lg:max-w-295">
        <ThingHead
          mark={<CourseMark />}
          name={title}
          line={t('settings.courseLine', { count: course.lessons.length })}
        />
        {editsContent(account) ? (
          <SettingsGroup flush title={t('settings.course')}>
            <RowLink
              title={t('edit.course.shelf')}
              value={t(`shelves.${course.shelf}`)}
              render={<Link to="/courses" search={{ edit: true }} />}
            />
          </SettingsGroup>
        ) : null}
        <SettingsGroup flush title={t('settings.share')}>
          <ActionRow title={t('settings.shareLink')} onClick={() => void share()} />
        </SettingsGroup>
        {editsContent(account) ? <CoursePublishing course={course} title={title} /> : null}
        <ResetStepsRow
          steps={courseStepIds(course)}
          words={{
            row: t('settings.reset'),
            done: t('settings.resetDone'),
            undo: t('settings.undo'),
          }}
        />
        {editsContent(account) && !COURSES.some((each) => each.id === course.id) ? (
          // One made in the app, not one the app ships with: Delete (round 28), last of all and
          // apart (R25).
          <RemoveGroup
            kind="course"
            id={course.id}
            title={title}
            onDeleted={() => void navigate({ to: '/courses', replace: true })}
          />
        ) : null}
      </div>
    </div>
  )
}

/** A course's Publishing (ADR 0116), its draft's: where it stands, Versions, its changes. */
function CoursePublishing({ course, title }: { course: Course; title: string }) {
  const { t } = useTranslation(['editor', 'learn'])
  const draft = useCourseDraft(course)
  const { published, standing } = useStanding('course', course.id, draft)
  return (
    <DraftPublishing
      draft={draft}
      title={title}
      status={published === null ? undefined : t(`publishPage.standing.${standing}`)}
      unreadable={t('learn:edit.course.unreadable')}
      onReset={draft.reopen}
    />
  )
}
