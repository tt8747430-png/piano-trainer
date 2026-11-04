import { Link, useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { COURSES, courseById, courseIcon, type Course } from '@/entities/course'
import { useCourseDraft } from '@/features/edit-original'
import { localText, useLocale } from '@/shared/i18n'
import { BackButton, TileMark } from '@/shared/ui'
import { DraftPublishScreen } from '@/widgets/content-editor'

/** A course's Publish page (`/courses/$courseId/publish`, R29 B6), an editor's. */
export function CoursePublishPage() {
  const { courseId } = useParams({ from: '/shell/courses/$courseId/publish' })
  const course = courseById(courseId)
  // The route finds no course that is not there.
  if (!course) return null
  return <CoursePublish key={courseId} course={course} />
}

function CoursePublish({ course }: { course: Course }) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const draft = useCourseDraft(course)
  const written = draft.load.state === 'ready' ? draft.load.value : course
  const title = localText(written.title, locale)
  return (
    <DraftPublishScreen
      kind="course"
      id={course.id}
      draft={draft}
      title={title}
      path={`/courses/${course.id}`}
      view={<Link to="/courses/$courseId" params={{ courseId: course.id }} />}
      unreadable={t('edit.course.unreadable')}
      back={<BackButton />}
      removable={!COURSES.some((each) => each.id === course.id)}
      preview={
        <div className="card flex min-h-16 items-center gap-3 p-2">
          <TileMark icon={courseIcon(course.id)} paint="sand" />
          <span className="flex min-w-0 flex-col">
            <span className="text-lg font-semibold text-balance">{title}</span>
            <span className="text-sm text-muted-foreground">
              {t('course.lessonCount', { count: course.lessons.length })}
            </span>
          </span>
        </div>
      }
    />
  )
}
