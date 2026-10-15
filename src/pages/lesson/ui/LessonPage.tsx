import { Link, useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { lessonById, lessonPlace, nextLessonId } from '@/entities/lesson'
import { lessonStepId } from '@/entities/step'
import { localText, useLocale } from '@/shared/i18n'
import { BackButton } from '@/shared/ui'
import { LessonLayout, PlaceLink } from './LessonLayout'

/**
 * A lesson of the Lessons (ADR 0053): its journey and chapter over it, its number along the journey,
 * and at its end the journey's next lesson, or after its last the way back to the journey.
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
  const nextId = nextLessonId(lesson.id)
  const next = nextId === undefined ? undefined : lessonById(nextId)
  return (
    <LessonLayout
      lesson={lesson}
      step={lessonStepId(lesson.id)}
      back={<BackButton fallback={journey} />}
      place={
        <>
          <PlaceLink {...journey}>{localText(place.journey.title, locale)}</PlaceLink> ·{' '}
          {localText(place.chapter.title, locale)} ·{' '}
          {t('place', { n: place.n, total: place.total })}
        </>
      }
      way={
        next
          ? {
              link: <Link to="/lessons/$lessonId" params={{ lessonId: next.id }} />,
              next: localText(next.title, locale),
              label: t('track.next'),
            }
          : { link: <Link {...journey} />, label: t('track.toJourney') }
      }
    />
  )
}
