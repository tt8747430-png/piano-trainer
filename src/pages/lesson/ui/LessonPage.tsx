import { Link, useParams } from '@tanstack/react-router'
import { ArrowRight, Dumbbell } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { lessonPlace, lessonStepId, nextLessonId, type LessonPlace } from '@/entities/course'
import { lessonById, type Lesson } from '@/entities/lesson'
import { LearnedButton, useLearned } from '@/features/mark-learned'
import { localText, useLocale } from '@/shared/i18n'
import { BackButton, ButtonLink, ScreenHeader } from '@/shared/ui'
import { LessonView } from '@/widgets/lesson-view'

/** A lesson's course: its page on Learn. */
const courseOf = (place: LessonPlace) =>
  ({ to: '/learn/$courseId', params: { courseId: place.course.id } }) as const

/**
 * A lesson: where it is (its course, a link to its page, and its number there), its title and
 * summary, then the lesson itself, and at its end Learned and the way on (ADR 0051): the next lesson
 * of its course, or after its last the course's page with what to practise. Going on learns it.
 */
export function LessonPage() {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const { lessonId } = useParams({ from: '/shell/learn/lessons/$lessonId' })
  const lesson = lessonById(lessonId)
  const place = lessonPlace(lessonId)
  // The route finds no lesson that no course teaches.
  if (!lesson || !place) return null
  return (
    <div className="flex flex-col gap-4">
      <ScreenHeader
        title={localText(lesson.title, locale)}
        back={<BackButton fallback={courseOf(place)} />}
      />
      <nav aria-label={t('placeLabel')} className="-mt-3 text-muted-foreground print:hidden">
        <Link
          {...courseOf(place)}
          className="rounded-sm font-semibold text-foreground underline-offset-4 hover:underline"
        >
          {localText(place.course.title, locale)}
        </Link>{' '}
        · {t('place', { n: place.n, total: place.total })}
      </nav>
      <p className="max-w-prose text-lg text-pretty text-muted-foreground">
        {localText(lesson.summary, locale)}
      </p>
      <LessonView key={lesson.id} lesson={lesson} />
      <LessonEnd lesson={lesson} place={place} />
    </div>
  )
}

/** A lesson's end: its Learned toggle beside the one way on, which learns it on the way. */
function LessonEnd({ lesson, place }: { lesson: Lesson; place: LessonPlace }) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const step = lessonStepId(lesson.id)
  const { learn } = useLearned(step)
  const nextId = nextLessonId(lesson.id)
  const next = nextId === undefined ? undefined : lessonById(nextId)
  return (
    <footer className="mt-6 flex max-w-prose flex-wrap items-center gap-3 border-t border-border pt-8 print:hidden">
      <ButtonLink
        size="pill"
        onClick={learn}
        className="h-auto min-h-14 min-w-0 flex-1 basis-64 justify-between gap-4 py-3 text-left whitespace-normal"
        render={
          next ? (
            <Link to="/learn/lessons/$lessonId" params={{ lessonId: next.id }} />
          ) : (
            <Link {...courseOf(place)} />
          )
        }
      >
        {next ? (
          <span className="flex min-w-0 flex-col">
            <span className="text-sm font-medium">{t('track.next')}</span>
            <span className="font-display text-xl text-balance">
              {localText(next.title, locale)}
            </span>
          </span>
        ) : (
          <span className="font-display text-xl text-balance">{t('track.practise')}</span>
        )}
        {next ? (
          <ArrowRight aria-hidden className="size-5" />
        ) : (
          <Dumbbell aria-hidden className="size-5" />
        )}
      </ButtonLink>
      <LearnedButton step={step} />
    </footer>
  )
}
