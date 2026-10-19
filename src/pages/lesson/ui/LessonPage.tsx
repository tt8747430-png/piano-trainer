import { Link, useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { lessonById, lessonPlace, nextLessonId, previousLessonId } from '@/entities/lesson'
import { lessonStepId } from '@/entities/step'
import { localText, useLocale } from '@/shared/i18n'
import { BackButton } from '@/shared/ui'
import { LessonLayout, PlaceLink } from './LessonLayout'

/**
 * A lesson of the Lessons (ADR 0053): its journey and chapter over it, its number along the journey;
 * the lesson before it, and on to the journey's next lesson, or after its last back to the journey.
 */
export function LessonPage() {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const { lessonId } = useParams({ from: '/shell/lessons/$lessonId' })
  const lesson = lessonById(lessonId)
  const place = lessonPlace(lessonId)
  // The route finds no lesson that no journey has.
  if (!lesson || !place) return null
  const journey = { to: '/', search: { view: 'lessons', journey: place.journey.id } } as const
  const lessonAt = (id: string | undefined) => (id === undefined ? undefined : lessonById(id))
  const next = lessonAt(nextLessonId(lesson.id))
  const previous = lessonAt(previousLessonId(lesson.id))
  const journeyTitle = localText(place.journey.title, locale)
  // Keyed by its lesson: the next one is a new screen, its heading taking the focus from the way on,
  // so Enter again does not go on (and learn) past a lesson unread.
  return (
    <LessonLayout
      key={lesson.id}
      lesson={lesson}
      step={lessonStepId(lesson.id)}
      back={<BackButton fallback={journey} />}
      place={
        <>
          <PlaceLink {...journey}>{journeyTitle}</PlaceLink> ·{' '}
          {localText(place.chapter.title, locale)} ·{' '}
          {t('place', { n: place.n, total: place.total })}
        </>
      }
      track={{
        up: { link: <Link {...journey} />, label: t('track.toJourney'), title: journeyTitle },
        ...(previous
          ? {
              previous: {
                link: <Link to="/lessons/$lessonId" params={{ lessonId: previous.id }} />,
                label: t('track.previous'),
                title: localText(previous.title, locale),
              },
            }
          : {}),
        next: next
          ? {
              link: <Link to="/lessons/$lessonId" params={{ lessonId: next.id }} />,
              label: t('track.next'),
              title: localText(next.title, locale),
            }
          : { link: <Link {...journey} />, label: t('track.toJourney'), title: journeyTitle },
      }}
    />
  )
}
