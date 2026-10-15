import { Link } from '@tanstack/react-router'
import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { CourseIcon, courseNumber, STAGE_PAINT, type Course } from '@/entities/course'
import { localText, useLocale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { PAINT } from '@/shared/ui'
import { isComplete, type CourseProgress } from '../model/course-progress'
import type { NodePlace } from '../model/node-place'

/**
 * A course on the curriculum's line: its node (its number on its stage's paint; grass with a check once
 * complete; ringed in honey where Continue is), its name, what it teaches and how much of it is
 * learned with a bar. The whole row opens the course's page.
 */
export function CourseRow({
  course,
  progress,
  current,
  place,
}: {
  course: Course
  progress: CourseProgress
  current: boolean
  place: NodePlace
}) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const paint = PAINT[STAGE_PAINT[course.stage]]
  const complete = isComplete(progress)
  return (
    <li aria-current={current ? 'step' : undefined} className="flex">
      <Link
        to="/learn/$courseId"
        params={{ courseId: course.id }}
        className="group flex min-w-0 flex-1 gap-4 rounded-3xl py-3 pr-3 transition-colors duration-200 ease-out hover:bg-muted/60"
      >
        <span className="relative flex w-16 shrink-0 justify-center self-stretch">
          {/* The stage's line through its courses, broken at its ends. */}
          <span
            aria-hidden
            className={cn(
              'absolute left-1/2 w-0.5 -translate-x-1/2 bg-border',
              place === 'first' && 'top-8 -bottom-3',
              place === 'between' && '-top-3 -bottom-3',
              place === 'last' && '-top-3 h-11',
              place === 'alone' && 'hidden',
            )}
          />
          <span
            className={cn(
              'relative mt-1 grid size-14 place-items-center rounded-full border-2 border-background transition-transform duration-200 ease-out group-hover:scale-105',
              current && 'shadow-[0_2px_8px_-2px_var(--color-primary)] ring-4 ring-primary',
              complete ? 'bg-learned text-learned-foreground' : cn(paint.fill, paint.ink),
            )}
          >
            {complete ? (
              <Check aria-hidden className="size-6" strokeWidth={3} />
            ) : (
              <span aria-hidden className="font-display text-xl font-semibold tabular-nums">
                {courseNumber(course)}
              </span>
            )}
          </span>
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-1.5 pt-1">
          <span className="flex items-start justify-between gap-3">
            <span className="font-display text-xl leading-snug font-semibold text-balance">
              <span className="sr-only">{t('courseNumber', { n: courseNumber(course) })}: </span>
              {localText(course.title, locale)}
            </span>
            <CourseIcon
              courseId={course.id}
              className={cn('mt-1 size-5 shrink-0', paint.ink)}
              strokeWidth={1.75}
            />
          </span>
          <span className="line-clamp-2 text-muted-foreground text-pretty">
            {localText(course.summary, locale)}
          </span>
          <span className="flex items-center gap-3 pt-1">
            <span aria-hidden className="h-1 max-w-48 flex-1 overflow-hidden rounded-full bg-muted">
              <span
                className="block h-full rounded-full bg-learned transition-[width] duration-300 ease-out"
                style={{ width: `${(progress.done / progress.total) * 100}%` }}
              />
            </span>
            <span className="text-sm text-muted-foreground tabular-nums">
              {complete
                ? t('course.done')
                : t('progress', { learned: progress.done, total: progress.total })}
            </span>
            {current ? (
              <span className="rounded-full bg-primary/25 px-2 py-0.5 text-sm font-medium">
                {t('current')}
              </span>
            ) : null}
          </span>
        </span>
      </Link>
    </li>
  )
}
