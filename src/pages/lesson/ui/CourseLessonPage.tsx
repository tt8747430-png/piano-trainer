import { Link, useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { courseLesson, nextCourseLesson, previousCourseLesson } from '@/entities/course'
import { courseLessonStepId } from '@/entities/step'
import { localText, useLocale } from '@/shared/i18n'
import { BackButton } from '@/shared/ui'
import { LessonLayout, PlaceLink } from './LessonLayout'

/**
 * A course's lesson (ADR 0053): its course over it and its number there; the lesson before it, and on
 * to the course's next lesson, or after its last to its guided songs on the course's page.
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
  const previous = previousCourseLesson(place)
  const courseTitle = localText(place.course.title, locale)
  const lessonLink = (id: string) => (
    <Link to="/courses/$courseId/$lessonId" params={{ courseId, lessonId: id }} />
  )
  return (
    <LessonLayout
      lesson={place.lesson}
      step={courseLessonStepId(courseId, lessonId)}
      back={<BackButton fallback={course} />}
      place={
        <>
          <PlaceLink {...course}>{courseTitle}</PlaceLink> ·{' '}
          {t('place', { n: place.n, total: place.total })}
        </>
      }
      track={{
        up: { link: <Link {...course} />, label: t('track.toCourseLessons'), title: courseTitle },
        ...(previous
          ? {
              previous: {
                link: lessonLink(previous.id),
                label: t('track.previous'),
                title: localText(previous.title, locale),
              },
            }
          : {}),
        next: next
          ? {
              link: lessonLink(next.id),
              label: t('track.next'),
              title: localText(next.title, locale),
            }
          : {
              link: <Link {...course} />,
              label: place.course.songs.length > 0 ? t('track.toCourse') : t('track.courseDone'),
              title: courseTitle,
            },
      }}
    />
  )
}
