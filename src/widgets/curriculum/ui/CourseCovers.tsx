import { Link } from '@tanstack/react-router'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { coursesOn, SHELVES, type Course } from '@/entities/course'
import { selectLearned, useProgress } from '@/entities/progress'
import { STAGE_PAINT } from '@/entities/step'
import { localText, useLocale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { PAINT, SeeAll, SectionHead } from '@/shared/ui'
import { continueStep } from '../model/continue-step'

/** How many covers Learn shows before See all. */
const SHOWN = 5

/** A course as a cover (canvas 163): its level's paint, its shelf (or Next) over its name, what it teaches under it. */
function CourseCover({ course, current }: { course: Course; current: boolean }) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const paint = PAINT[STAGE_PAINT[course.stage]]
  return (
    <Link
      to="/courses/$courseId"
      params={{ courseId: course.id }}
      aria-current={current ? 'step' : undefined}
      className="group flex w-42 shrink-0 snap-start flex-col gap-2 lg:w-full"
    >
      <span
        className={cn(
          'flex h-32 flex-col justify-between rounded-[14px] px-3.5 py-3 ring-1 ring-black/6 transition-[filter] duration-200 ease-out ring-inset group-hover:brightness-[0.97] dark:ring-white/5',
          paint.fill,
        )}
      >
        {current ? (
          <span className="flex h-6 items-center self-start rounded-pill bg-primary px-2.5 text-xs font-bold text-primary-foreground">
            {t('upNext')}
          </span>
        ) : (
          <span className="flex min-h-6 items-center text-[0.6875rem] font-bold tracking-[0.06em] text-muted-foreground uppercase">
            {t(`shelves.${course.shelf}`)}
          </span>
        )}
        <span className="font-display text-[1.1875rem]/[1.15] text-balance text-foreground">
          {localText(course.title, locale)}
        </span>
      </span>
      <span className="line-clamp-2 text-[0.8125rem]/[1.35] text-pretty text-muted-foreground">
        {localText(course.summary, locale)}
      </span>
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
    <section aria-labelledby={id} className="flex min-w-0 flex-col gap-3.5">
      <SectionHead id={id} title={t('courses')}>
        <SeeAll label={t('seeAll')} render={<Link to="/courses" />} />
      </SectionHead>
      <ul className="-mx-gutter flex snap-x snap-mandatory scroll-px-gutter gap-3 overflow-x-auto px-gutter pb-1 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-4.5 lg:overflow-visible lg:px-0">
        {shown.map((course) => (
          <li key={course.id} className="flex">
            <CourseCover course={course} current={course.id === current} />
          </li>
        ))}
      </ul>
    </section>
  )
}
