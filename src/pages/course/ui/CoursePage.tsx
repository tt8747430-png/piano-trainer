import { Link, useParams } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { courseById, CourseIcon, courseStepIds, type Course } from '@/entities/course'
import { selectLearned, useProgress } from '@/entities/progress'
import { STAGE_PAINT, stepOf } from '@/entities/step'
import { localText, useLocale } from '@/shared/i18n'
import { cn, OPEN_PLAINLY } from '@/shared/lib'
import { BackButton, ButtonLink, PAINT, ScreenHeader } from '@/shared/ui'
import {
  courseProgress,
  CourseLessons,
  GuidedSongs,
  isComplete,
  useStepTitle,
} from '@/widgets/curriculum'

/** The course's first step not yet learned: a lesson, then a guided song. */
const openStepOf = (course: Course, learned: Readonly<Record<string, string | undefined>>) =>
  courseStepIds(course).find((id) => learned[id] === undefined)

/**
 * The course's one honey way in, as the courses-app's Start Course: Start, or Continue with the step
 * to take; Review, onto its first lesson, once every one is learned.
 */
function CourseAction({ course }: { course: Course }) {
  const { t } = useTranslation('learn')
  const learned = useProgress(selectLearned)
  const stepTitle = useStepTitle()
  const progress = courseProgress(course, learned)
  const open = openStepOf(course, learned)
  const step = stepOf(open ?? courseStepIds(course)[0])
  if (!step || (step.kind !== 'course-lesson' && step.kind !== 'piece')) return null
  const label = !open
    ? t('course.review')
    : progress.done === 0
      ? t('course.start')
      : t('course.continue')
  return (
    <ButtonLink
      size="pill"
      variant={open ? 'default' : 'outline'}
      className="h-auto min-h-14 justify-between gap-4 py-3 text-left whitespace-normal sm:min-w-80 sm:self-start"
      render={
        step.kind === 'piece' ? (
          <Link to="/play/$pieceId" params={{ pieceId: step.pieceId }} state={OPEN_PLAINLY} />
        ) : (
          <Link
            to="/courses/$courseId/$lessonId"
            params={{ courseId: step.courseId, lessonId: step.lessonId }}
          />
        )
      }
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
 * A course's page (ADR 0053), as the courses-app has it: its cover, what it teaches, its level, weeks,
 * lessons and songs, how much is learned, one way in; then its lessons numbered as taught and its
 * guided songs.
 */
export function CoursePage() {
  const { t } = useTranslation(['learn', 'common'])
  const locale = useLocale()
  const { courseId } = useParams({ from: '/shell/courses/$courseId' })
  const learned = useProgress(selectLearned)
  const course = courseById(courseId)
  // The route finds no course that is not there.
  if (!course) return null
  const progress = courseProgress(course, learned)
  const paint = PAINT[STAGE_PAINT[course.stage]]
  const next = openStepOf(course, learned)
  const facts = [
    t('learn:course.weeks', { count: course.weeks }),
    t('learn:course.lessonCount', { count: course.lessons.length }),
    ...(course.songs.length > 0
      ? [t('learn:course.songCount', { count: course.songs.length })]
      : []),
  ]
  return (
    <div className="flex flex-col gap-10">
      <ScreenHeader
        title={localText(course.title, locale)}
        back={<BackButton fallback={{ to: '/', search: { view: 'courses', journey: '' } }} />}
      />
      <section className="-mt-4 flex max-w-4xl flex-col overflow-hidden card md:flex-row">
        <span
          className={cn(
            'grid h-36 shrink-0 place-items-center border-b border-border md:h-auto md:w-56 md:border-r md:border-b-0',
            paint.fill,
          )}
        >
          <CourseIcon
            courseId={course.id}
            className={cn('size-16', paint.ink)}
            strokeWidth={1.25}
          />
        </span>
        <div className="flex flex-1 flex-col gap-4 p-5">
          <p className="text-lg text-pretty">{localText(course.summary, locale)}</p>
          <ul
            aria-label={t('learn:course.facts')}
            className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm"
          >
            <li className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 font-medium">
              <span aria-hidden className={cn('size-2 rounded-full bg-current', paint.ink)} />
              {t(`common:stage.${course.stage}`)}
            </li>
            {facts.map((fact) => (
              <li key={fact} className="text-muted-foreground">
                {fact}
              </li>
            ))}
          </ul>
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
      <div className="flex max-w-4xl flex-col gap-10">
        <CourseLessons course={course} next={next} />
        <GuidedSongs course={course} />
      </div>
    </div>
  )
}
