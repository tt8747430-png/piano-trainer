import { Link, useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { courseLesson, nextCourseLesson } from '@/entities/course'
import { courseLessonStepId } from '@/entities/step'
import { localText, useLocale } from '@/shared/i18n'
import { BackButton } from '@/shared/ui'
import { LessonLayout, PlaceLink } from './LessonLayout'

/**
 * A course's lesson (ADR 0053): its course over it and its number there, and at its end the course's
 * next lesson, or after its last the way to its guided songs on the course's page.
 */
export function CourseLessonPage() {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const { courseId, lessonId } = useParams({ from: '/shell/courses/$courseId/$lessonId' })
  const place = courseLesson(courseId, lessonId)
  // The route finds no lesson its course does not have.
  if (!place) return null
  const course = { to: '/courses/$courseId', params: { courseId } } as const
  const next = nextCourseLesson(place)
  return (
    <LessonLayout
      lesson={place.lesson}
      step={courseLessonStepId(courseId, lessonId)}
      back={<BackButton fallback={course} />}
      place={
        <>
          <PlaceLink {...course}>{localText(place.course.title, locale)}</PlaceLink> ·{' '}
          {t('place', { n: place.n, total: place.total })}
        </>
      }
      way={
        next
          ? {
              link: (
                <Link to="/courses/$courseId/$lessonId" params={{ courseId, lessonId: next.id }} />
              ),
              next: localText(next.title, locale),
              label: t('track.next'),
            }
          : {
              link: <Link {...course} />,
              label: place.course.songs.length > 0 ? t('track.toCourse') : t('track.courseDone'),
            }
      }
    />
  )
}
