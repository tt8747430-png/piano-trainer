import { Link } from '@tanstack/react-router'
import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { CourseIcon, type Course } from '@/entities/course'
import { selectLearned, useProgress } from '@/entities/progress'
import { STAGE_PAINT } from '@/entities/step'
import { localText, useLocale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { PAINT } from '@/shared/ui'
import { courseProgress, isComplete } from '../model/progress'

/**
 * A course on its shelf, as the courses-app shows one: a cover in its level's paint with its icon,
 * its name, what it teaches, its level with its dot and how long it takes; how much is learned once
 * begun. The whole card opens the course.
 */
export function CourseCard({ course, current }: { course: Course; current: boolean }) {
  const { t } = useTranslation(['learn', 'common'])
  const locale = useLocale()
  const learned = useProgress(selectLearned)
  const progress = courseProgress(course, learned)
  const complete = isComplete(progress)
  const paint = PAINT[STAGE_PAINT[course.stage]]
  return (
    <Link
      to="/courses/$courseId"
      params={{ courseId: course.id }}
      aria-current={current ? 'step' : undefined}
      className={cn(
        'group flex h-full flex-col overflow-hidden card transition-transform duration-200 ease-out hover:-translate-y-0.5',
        current && 'ring-4 ring-primary',
      )}
    >
      <span
        className={cn(
          'relative grid h-28 place-items-center overflow-hidden border-b border-border',
          paint.fill,
        )}
      >
        <CourseIcon
          courseId={course.id}
          className={cn(
            'size-14 transition-transform duration-300 ease-out group-hover:scale-110',
            paint.ink,
          )}
          strokeWidth={1.5}
        />
        {complete ? (
          <span className="absolute top-3 right-3 grid size-8 place-items-center rounded-full bg-learned text-learned-foreground">
            <Check aria-hidden className="size-5" strokeWidth={3} />
            <span className="sr-only">{t('learn:course.done')}</span>
          </span>
        ) : null}
      </span>
      <span className="flex flex-1 flex-col gap-2 p-4">
        <span className="font-display text-xl leading-snug font-semibold text-balance">
          {localText(course.title, locale)}
        </span>
        <span className="line-clamp-3 text-muted-foreground text-pretty">
          {localText(course.summary, locale)}
        </span>
        <span className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 text-sm">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 font-medium">
            <span aria-hidden className={cn('size-2 rounded-full bg-current', paint.ink)} />
            {t(`common:stage.${course.stage}`)}
          </span>
          <span className="text-muted-foreground">
            {t('learn:course.weeks', { count: course.weeks })}
          </span>
        </span>
        {progress.done > 0 && !complete ? (
          <span className="flex items-center gap-2 text-sm text-muted-foreground tabular-nums">
            <span aria-hidden className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
              <span
                className="block h-full rounded-full bg-learned"
                style={{ width: `${(progress.done / progress.total) * 100}%` }}
              />
            </span>
            {t('learn:progress', { learned: progress.done, total: progress.total })}
          </span>
        ) : null}
      </span>
    </Link>
  )
}
