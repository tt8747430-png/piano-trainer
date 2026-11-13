import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { Link2, Library } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { COURSES, courseById, courseStepIds, type Course } from '@/entities/course'
import { selectOwnCourse, useOwnLessons } from '@/entities/own-lessons'
import { RemoveGroup, useCourseDraft } from '@/features/edit-original'
import { ResetStepsRow } from '@/features/reset-progress'
import { localText, useLocale } from '@/shared/i18n'
import { shareLink } from '@/shared/lib'
import { editsContent, useAccount } from '@/shared/lib/account'
import { BackButton, RowButton, RowLink, say, ScreenHeader, SettingsGroup } from '@/shared/ui'
import { PublishRow } from '@/widgets/content-editor'
import { OwnCourseSettings } from './OwnCourseSettings'

/**
 * A course's Settings (`/courses/$courseId/settings`, round 28, as a song's): Share link, and apart
 * the learner's progress in it reset, asked first. An editor's: the shelf it stands on, and
 * (R29 B6) Publish… before Share link, Delete last. What it is (its title, summary, level and length) is
 * written on the course itself, in Edit. A course of the learner's own (R30-5): `OwnCourseSettings`.
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
    <div className="flex flex-col gap-6 pb-8">
      <ScreenHeader title={t('settings.title')} back={<BackButton />} />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-7">
        <p className="px-1 font-display text-2xl font-semibold text-balance">{title}</p>
        {editsContent(account) ? <EditorRows course={course} /> : null}
        <SettingsGroup flush title={t('settings.share')}>
          {editsContent(account) ? <CoursePublishRow course={course} /> : null}
          <RowButton
            title={t('settings.shareLink')}
            icon={Link2}
            paint="grass"
            onClick={() => void share()}
          />
        </SettingsGroup>
        <ResetStepsRow
          steps={courseStepIds(course)}
          words={{
            row: t('settings.reset'),
            body: t('settings.resetCourseBody'),
            done: t('settings.resetDone'),
            undo: t('settings.undo'),
          }}
        />
        {editsContent(account) && !COURSES.some((each) => each.id === course.id) ? (
          // One made in the app, not one the app ships with: Unpublish and Delete (round 28), last
          // of all (R25).
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

/** An editor's rows (ADR 0116): the shelf it stands on, a way to the shelves' Edit mode. */
function EditorRows({ course }: { course: Course }) {
  const { t } = useTranslation('learn')
  return (
    <SettingsGroup flush title={t('settings.course')}>
      <RowLink
        title={t('edit.course.shelf')}
        value={t(`shelves.${course.shelf}`)}
        icon={Library}
        paint="sky"
        render={<Link to="/courses" search={{ edit: true }} />}
      />
    </SettingsGroup>
  )
}

/** Publish… (R29 B6): its Publish page, where it stands as its value. */
function CoursePublishRow({ course }: { course: Course }) {
  const draft = useCourseDraft(course)
  return (
    <PublishRow
      kind="course"
      id={course.id}
      draft={draft}
      link={<Link to="/courses/$courseId/publish" params={{ courseId: course.id }} />}
    />
  )
}
