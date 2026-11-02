import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { Link2, Library } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { COURSES, courseById, courseStepIds, type Course } from '@/entities/course'
import { RemoveGroup, useCourseDraft } from '@/features/edit-original'
import { ResetStepsRow } from '@/features/reset-progress'
import { localText, useLocale } from '@/shared/i18n'
import { shareLink } from '@/shared/lib'
import { editsContent, useAccount } from '@/shared/lib/account'
import { BackButton, RowButton, RowLink, say, ScreenHeader, SettingsGroup } from '@/shared/ui'
import { ChangesGroup } from '@/widgets/content-editor'

/**
 * A course's Settings (`/courses/$courseId/settings`, round 28, as a song's): Share link, and apart
 * the learner's progress in it reset, asked first. An editor's: the shelf it stands on (Manage
 * courses), and its changes with Publish. What it is (its title, summary, level and length) is
 * written on the course itself, in Edit.
 */
export function CourseSettingsPage() {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const { account } = useAccount()
  const { courseId } = useParams({ from: '/shell/courses/$courseId/settings' })
  const course = courseById(courseId)
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
        <SettingsGroup flush title={t('settings.share')}>
          <RowButton
            title={t('settings.shareLink')}
            icon={Link2}
            paint="grass"
            onClick={() => void share()}
          />
        </SettingsGroup>
        {editsContent(account) ? <EditorRows course={course} title={title} /> : null}
        <SettingsGroup flush title={t('settings.progress')}>
          <ResetStepsRow
            steps={courseStepIds(course)}
            words={{
              row: t('settings.reset'),
              title: t('settings.resetCourse'),
              body: t('settings.resetCourseBody'),
              cancel: t('settings.cancel'),
              confirm: t('settings.confirm'),
              done: t('settings.resetDone'),
            }}
          />
        </SettingsGroup>
      </div>
    </div>
  )
}

/** An editor's rows (ADR 0116): its shelf, a way to Manage courses; its changes with Publish. */
function EditorRows({ course, title }: { course: Course; title: string }) {
  const { t } = useTranslation('learn')
  const draft = useCourseDraft(course)
  const navigate = useNavigate()
  const shelf =
    draft.load.state === 'ready' ? (draft.load.value.shelf ?? course.shelf) : course.shelf
  return (
    <>
      <SettingsGroup flush title={t('settings.course')}>
        <RowLink
          title={t('edit.course.shelf')}
          value={t(`shelves.${shelf}`)}
          icon={Library}
          paint="sky"
          render={<Link to="/courses/manage" />}
        />
      </SettingsGroup>
      <ChangesGroup draft={draft} title={title} unreadable={t('edit.course.unreadable')} />
      {/* One made in the app, not one the app ships with: Unpublish and Delete (round 28). */}
      {COURSES.some((each) => each.id === course.id) ? null : (
        <RemoveGroup
          kind="course"
          id={course.id}
          title={title}
          onDeleted={() => void navigate({ to: '/', search: { view: 'courses' }, replace: true })}
        />
      )}
    </>
  )
}
