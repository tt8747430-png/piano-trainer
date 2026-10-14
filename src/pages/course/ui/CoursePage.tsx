import { Link, useParams } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { isMethodBookId } from '@/entities/book'
import {
  isLessonModule,
  lessonInModule,
  lessonsIn,
  MODULE_LOOK,
  useModuleName,
} from '@/entities/lesson'
import { lessonStepId } from '@/entities/path'
import { selectLearned, useProgress } from '@/entities/progress'
import { localText, useLocale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import {
  BackButton,
  ButtonLink,
  LearnedBadge,
  PAGE_TILES,
  PAINT,
  RowLink,
  ScreenHeader,
} from '@/shared/ui'

/**
 * A course's page (ADR 0049): its band, what it teaches and how much of it is learned, one honey way in
 * (Start, or Continue with the lesson to read), then its lessons numbered as taught; a method book's
 * ends with its patterns and pieces on Practice's Accompaniment.
 */
export function CoursePage() {
  const { t } = useTranslation(['learn', 'common', 'practice'])
  const locale = useLocale()
  const moduleName = useModuleName()
  const { module } = useParams({ from: '/shell/learn/$module' })
  const learned = useProgress(selectLearned)
  if (!isLessonModule(module)) return null
  const lessons = lessonsIn(module)
  const isLearned = (id: string) => learned[lessonStepId(id)] !== undefined
  const done = lessons.filter((lesson) => isLearned(lesson.id)).length
  const next = lessonInModule(module, (lesson) => learned[lessonStepId(lesson.id)])
  const { paint, icon: Icon } = MODULE_LOOK[module]
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={moduleName(module)}
        back={<BackButton fallback={{ to: '/', search: { view: 'courses' } }} />}
      />
      <section className="flex max-w-3xl flex-col overflow-hidden card lg:flex-row">
        <span
          className={cn(
            'grid h-28 shrink-0 place-items-center lg:h-auto lg:w-40',
            PAINT[paint].fill,
          )}
        >
          <Icon aria-hidden className={cn('size-12', PAINT[paint].ink)} strokeWidth={1.5} />
        </span>
        <div className="flex flex-1 flex-col gap-4 p-5">
          <p className="text-lg text-pretty">{t(`learn:moduleAbout.${module}`)}</p>
          <div className="flex flex-col gap-2">
            <span className="text-sm text-muted-foreground tabular-nums">
              {t('learn:progress', { learned: done, total: lessons.length })}
            </span>
            <span aria-hidden className="h-1.5 overflow-hidden rounded-full bg-muted">
              <span
                className="block h-full rounded-full bg-learned"
                style={{ width: `${(done / lessons.length) * 100}%` }}
              />
            </span>
          </div>
          {next ? (
            <ButtonLink
              size="pill"
              className="h-auto min-h-14 justify-between gap-4 py-3 text-left whitespace-normal sm:self-start sm:min-w-80"
              render={<Link to="/learn/lessons/$lessonId" params={{ lessonId: next.id }} />}
            >
              <span className="flex min-w-0 flex-col">
                <span className="text-sm font-medium">
                  {done === 0 ? t('learn:course.start') : t('learn:course.continue')}
                </span>
                <span className="font-display text-xl text-balance">
                  {localText(next.title, locale)}
                </span>
              </span>
              <ArrowRight aria-hidden className="size-5" />
            </ButtonLink>
          ) : null}
        </div>
      </section>
      <section aria-label={t('learn:course.lessons')} className="flex max-w-3xl flex-col gap-3">
        <h2 className="text-2xl">{t('learn:course.lessons')}</h2>
        <ol className="flex flex-col divide-y divide-hairline card px-2">
          {lessons.map((lesson, i) => (
            <li key={lesson.id} aria-current={lesson === next ? 'step' : undefined}>
              <RowLink
                title={localText(lesson.title, locale)}
                numeral={i + 1}
                // Grass is learned: a lesson wears it once it is, its course's paint before.
                paint={isLearned(lesson.id) ? 'grass' : paint}
                trailing={
                  isLearned(lesson.id) ? (
                    <LearnedBadge label={t('common:learned.done')} />
                  ) : undefined
                }
                render={<Link to="/learn/lessons/$lessonId" params={{ lessonId: lesson.id }} />}
              />
            </li>
          ))}
        </ol>
      </section>
      {/* A course's patterns and pieces are on its part of Accompaniment: one course, two places. */}
      {isMethodBookId(module) ? (
        <div className="card">
          <RowLink
            title={t('learn:coursePractice')}
            detail={t('practice:pages.accompaniment')}
            {...PAGE_TILES.patterns}
            render={<Link to="/practice/accompaniment" search={{ show: module }} />}
          />
        </div>
      ) : null}
    </div>
  )
}
