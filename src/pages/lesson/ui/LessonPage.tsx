import { Link, useParams } from '@tanstack/react-router'
import { ArrowRight, List } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  lessonById,
  lessonsIn,
  nextLesson,
  tabOf,
  useModuleName,
  type Lesson,
} from '@/entities/lesson'
import { lessonStepId } from '@/entities/path'
import { LearnedButton, useLearned } from '@/features/mark-learned'
import { localText, useLocale } from '@/shared/i18n'
import { BackButton, ButtonLink, ScreenHeader } from '@/shared/ui'
import { LessonView } from '@/widgets/lesson-view'

/** Learn as it shows a lesson's module: its tab, the module open. */
const moduleOnLearn = (lesson: Lesson) =>
  ({ to: '/learn', search: { tab: tabOf(lesson.module), open: lesson.module } }) as const

/**
 * A lesson: where it is (its module, a link to it on Learn, and its number in it), its title and
 * summary, then the lesson itself, and at its end Learned and the way on along its track (ADR 0042):
 * the next lesson, or a course's list after its last. Going on marks the lesson learned.
 */
export function LessonPage() {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const moduleName = useModuleName()
  const { lessonId } = useParams({ from: '/shell/learn/lessons/$lessonId' })
  const lesson = lessonById(lessonId)
  if (!lesson) return null
  const inModule = lessonsIn(lesson.module)
  return (
    <div className="flex flex-col gap-4">
      <ScreenHeader
        title={localText(lesson.title, locale)}
        back={<BackButton fallback={moduleOnLearn(lesson)} />}
      />
      <nav aria-label={t('placeLabel')} className="-mt-3 text-muted-foreground print:hidden">
        <Link
          {...moduleOnLearn(lesson)}
          className="rounded-sm font-semibold text-foreground underline-offset-4 hover:underline"
        >
          {moduleName(lesson.module)}
        </Link>{' '}
        · {t('place', { n: inModule.indexOf(lesson) + 1, total: inModule.length })}
      </nav>
      <p className="max-w-prose text-lg text-pretty text-muted-foreground">
        {localText(lesson.summary, locale)}
      </p>
      <LessonView key={lesson.id} lesson={lesson} />
      <LessonEnd lesson={lesson} />
    </div>
  )
}

/** A lesson's end: its Learned toggle beside the one way on, which learns it on the way. */
function LessonEnd({ lesson }: { lesson: Lesson }) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const moduleName = useModuleName()
  const step = lessonStepId(lesson.id)
  const { learn } = useLearned(step)
  const next = nextLesson(lesson.id)
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
            <Link {...moduleOnLearn(lesson)} />
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
          <span className="font-display text-xl text-balance">
            {t('track.all', { module: moduleName(lesson.module) })}
          </span>
        )}
        {next ? (
          <ArrowRight aria-hidden className="size-5" />
        ) : (
          <List aria-hidden className="size-5" />
        )}
      </ButtonLink>
      <LearnedButton step={step} />
    </footer>
  )
}
