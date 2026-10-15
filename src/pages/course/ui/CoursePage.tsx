import { Link, useParams } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import type { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import {
  courseById,
  CourseIcon,
  courseIcon,
  courseNumber,
  firstOpenStep,
  nextCourse,
  STAGE_PAINT,
  StepLink,
  useStepTitle,
  type Course,
  type Step,
} from '@/entities/course'
import { selectLearned, useProgress } from '@/entities/progress'
import { localText, useLocale } from '@/shared/i18n'
import { cn, OPEN_PLAINLY } from '@/shared/lib'
import { BackButton, ButtonLink, PAINT, RowLink, ScreenHeader } from '@/shared/ui'
import { courseProgress, CourseSteps, isComplete } from '@/widgets/curriculum'

/** The way a step is opened from its course's one button: a piece in the Player, any other on its own page. */
function StepButtonLink({ step, ...props }: { step: Step } & Omit<ComponentProps<'a'>, 'href'>) {
  return step.kind === 'piece' ? (
    <Link to="/play/$pieceId" params={{ pieceId: step.pieceId }} state={OPEN_PLAINLY} {...props} />
  ) : (
    <StepLink step={step} {...props} />
  )
}

/** The course's one honey way in: Start, or Continue with the step to take; Review once all are learned. */
function CourseAction({ course }: { course: Course }) {
  const { t } = useTranslation('learn')
  const learned = useProgress(selectLearned)
  const stepTitle = useStepTitle()
  const progress = courseProgress(course, learned)
  const open = firstOpenStep(course, (id) => learned[id] !== undefined)
  const first: Step = { kind: 'lesson', lessonId: course.lessons[0] ?? '' }
  const step = open ?? first
  const label = open
    ? progress.done === 0
      ? t('course.start')
      : t('course.continue')
    : t('course.review')
  return (
    <ButtonLink
      size="pill"
      variant={open ? 'default' : 'outline'}
      className="h-auto min-h-14 justify-between gap-4 py-3 text-left whitespace-normal sm:min-w-80 sm:self-start"
      render={<StepButtonLink step={step} />}
    >
      <span className="flex min-w-0 flex-col">
        <span className="text-sm font-medium">{label}</span>
        <span className="font-display text-xl text-balance">{stepTitle(step).primary}</span>
      </span>
      <ArrowRight aria-hidden className="size-5 shrink-0" />
    </ButtonLink>
  )
}

/**
 * A course's page (ADR 0051): its stage and number, what it teaches and how much of it is learned, one
 * way in, its lessons numbered as taught, what to practise after them, and the course after it.
 */
export function CoursePage() {
  const { t } = useTranslation(['learn', 'common'])
  const locale = useLocale()
  const { courseId } = useParams({ from: '/shell/learn/$courseId' })
  const learned = useProgress(selectLearned)
  const course = courseById(courseId)
  if (!course) return null
  const progress = courseProgress(course, learned)
  const paint = PAINT[STAGE_PAINT[course.stage]]
  const after = nextCourse(course)
  return (
    <div className="flex flex-col gap-8">
      <ScreenHeader
        title={localText(course.title, locale)}
        back={<BackButton fallback={{ to: '/' }} />}
      />
      <section className="flex max-w-3xl flex-col overflow-hidden card sm:flex-row">
        <span
          className={cn(
            'flex h-24 shrink-0 items-center justify-between px-5 sm:h-auto sm:w-40 sm:flex-col sm:justify-center sm:gap-2',
            paint.fill,
          )}
        >
          <CourseIcon courseId={course.id} className={cn('size-10', paint.ink)} strokeWidth={1.5} />
          <span className={cn('text-sm font-semibold', paint.ink)}>
            {t('learn:courseNumber', { n: courseNumber(course) })}
          </span>
        </span>
        <div className="flex flex-1 flex-col gap-4 p-5">
          <p className="text-sm font-medium text-muted-foreground">
            {t(`common:stage.${course.stage}`)} ·{' '}
            {t('learn:course.count', { count: course.lessons.length })}
          </p>
          <p className="-mt-2 text-lg text-pretty">{localText(course.summary, locale)}</p>
          <div className="flex flex-col gap-2">
            <span className="text-sm text-muted-foreground tabular-nums">
              {isComplete(progress)
                ? t('learn:course.done')
                : t('learn:progress', { learned: progress.done, total: progress.total })}
            </span>
            <span aria-hidden className="h-1.5 overflow-hidden rounded-full bg-muted">
              <span
                className="block h-full rounded-full bg-learned"
                style={{ width: `${(progress.done / progress.total) * 100}%` }}
              />
            </span>
          </div>
          <CourseAction course={course} />
        </div>
      </section>
      <div className="max-w-3xl">
        <CourseSteps course={course} />
      </div>
      {after ? (
        <section aria-label={t('learn:course.next')} className="flex max-w-3xl flex-col gap-2">
          <h2 className="text-2xl">{t('learn:course.next')}</h2>
          <div className="card">
            <RowLink
              title={localText(after.title, locale)}
              detail={`${t(`common:stage.${after.stage}`)} · ${t('learn:courseNumber', {
                n: courseNumber(after),
              })}`}
              icon={courseIcon(after.id)}
              paint={STAGE_PAINT[after.stage]}
              render={<Link to="/learn/$courseId" params={{ courseId: after.id }} />}
            />
          </div>
        </section>
      ) : null}
    </div>
  )
}
