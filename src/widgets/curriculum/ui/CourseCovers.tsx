import { Link } from '@tanstack/react-router'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { coursesOn, SHELVES, type Course } from '@/entities/course'
import { selectLearned, useProgress } from '@/entities/progress'
import { STAGE_PAINT } from '@/entities/step'
import { localText, useLocale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { PAINT } from '@/shared/ui'
import { continueStep } from '../model/continue-step'
import { courseProgress, isComplete } from '../model/progress'

/** How many covers Learn shows before See all. */
const SHOWN = 5

/** A course as a cover: its level's paint, its shelf (or Next) over its name, its facts under it. */
function CourseCover({ course, current }: { course: Course; current: boolean }) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const learned = useProgress(selectLearned)
  const progress = courseProgress(course, learned)
  const paint = PAINT[STAGE_PAINT[course.stage]]
  const facts = [
    t('course.lessonCount', { count: course.lessons.length }),
    isComplete(progress)
      ? t('course.done')
      : progress.done > 0
        ? t('progress', { learned: progress.done, total: progress.total })
        : t('course.weekCount', { count: course.weeks }),
  ]
  return (
    <Link
      to="/courses/$courseId"
      params={{ courseId: course.id }}
      aria-current={current ? 'step' : undefined}
      className="group flex w-44 shrink-0 snap-start flex-col gap-2 lg:w-full"
    >
      <span
        className={cn(
          'flex aspect-[3/2] flex-col justify-between rounded-card p-3 ring-1 ring-black/5 transition-[filter] duration-200 ease-out ring-inset group-hover:brightness-[0.97] dark:ring-white/5',
          paint.fill,
          paint.ink,
        )}
      >
        {current ? (
          <span className="self-start rounded-pill bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
            {t('upNext')}
          </span>
        ) : (
          <span className="text-xs font-semibold tracking-wide uppercase opacity-80">
            {t(`shelves.${course.shelf}`)}
          </span>
        )}
        <span className="font-display text-lg leading-tight text-balance">
          {localText(course.title, locale)}
        </span>
      </span>
      <span className="px-0.5 text-sm text-muted-foreground tabular-nums">{facts.join(' · ')}</span>
    </Link>
  )
}

/**
 * Learn's Courses (canvas 163): the first courses of the shelves as covers, the one Continue is in
 * first; a row that scrolls on a phone, five across on a laptop; See all opens the Courses' page.
 */
export function CourseCovers() {
  const { t } = useTranslation('learn')
  const id = useId()
  const learned = useProgress(selectLearned)
  const next = continueStep(learned)
  const current = next && 'course' in next ? next.course.id : undefined
  const all = SHELVES.flatMap((shelf) => coursesOn(shelf))
  const first = all.find((course) => course.id === current)
  const shown = [...(first ? [first] : []), ...all.filter((course) => course !== first)].slice(
    0,
    SHOWN,
  )
  return (
    <section aria-labelledby={id} className="flex min-w-0 flex-col gap-2">
      <div className="flex items-center justify-between gap-4 px-1">
        <h2 id={id} className="text-lg font-semibold">
          {t('courses')}
        </h2>
        <Link
          to="/courses"
          className="-mx-2 inline-flex min-h-11 items-center rounded-control px-2 font-semibold text-link hover:underline"
        >
          {t('seeAll')}
        </Link>
      </div>
      <ul className="-mx-gutter flex snap-x snap-mandatory scroll-px-gutter gap-3 overflow-x-auto px-gutter pb-1 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-4 lg:overflow-visible lg:px-0">
        {shown.map((course) => (
          <li key={course.id} className="flex">
            <CourseCover course={course} current={course.id === current} />
          </li>
        ))}
      </ul>
    </section>
  )
}
