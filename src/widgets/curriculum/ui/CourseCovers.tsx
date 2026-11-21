import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { coursesOn, SHELVES, type Course, SHELF_PAINT } from '@/entities/course'
import { selectLearned, useProgress } from '@/entities/progress'
import { localText, useLocale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { useFold } from '@/features/fold-section'
import { FoldSection, PAINT, SeeAll } from '@/shared/ui'
import { NextMark } from './NextMark'
import { continueStep } from '../model/continue-step'
import { courseProgress } from '../model/progress'

/** How many covers Learn shows before See all. */
const SHOWN = 5

/** The cover's eyebrow: what the learner hunts for, the course's progress ("3 of 8 lessons", "8 lessons", "Done"). */
function useCoverState() {
  const { t } = useTranslation('learn')
  return (course: Course, learned: Parameters<typeof courseProgress>[1]) => {
    const { done, total } = courseProgress(course, learned)
    if (total > 0 && done === total) return t('coverDone')
    if (done > 0) return t('coverLessonsOf', { done, count: total })
    return t('course.lessonCount', { count: total })
  }
}

/**
 * A course as a cover (the canvas's COURSECARD): its shelf's paint, 128 tall and 14 round, the Next
 * ring (honey ink on a honey ring, never filled: Continue's is the screen's one filled honey) and its
 * progress in sentence case over its name in the serif; what it teaches under it, two lines at most.
 */
function CourseCover({
  course,
  current,
  state,
}: {
  course: Course
  current: boolean
  state: string
}) {
  const locale = useLocale()
  const paint = PAINT[SHELF_PAINT[course.shelf]]
  return (
    <Link
      to="/courses/$courseId"
      params={{ courseId: course.id }}
      aria-current={current ? 'step' : undefined}
      className="group flex w-42 shrink-0 snap-start flex-col gap-2 lg:w-full"
    >
      <span
        className={cn(
          'flex h-32 flex-col justify-between rounded-card px-4 py-3 ring-1 ring-black/6 transition-[filter] duration-200 ease-out ring-inset group-hover:brightness-[0.97] dark:ring-white/5',
          paint.fill,
        )}
      >
        <span className="flex min-h-6 items-center gap-2">
          {current ? <NextMark /> : null}
          <span className="truncate text-xs font-semibold text-muted-foreground">{state}</span>
        </span>
        <span className="font-display text-[1.1875rem]/[1.15] text-balance text-foreground">
          {localText(course.title, locale)}
        </span>
      </span>
      <span className="line-clamp-2 text-footnote/[1.35] text-pretty text-muted-foreground">
        {localText(course.line, locale)}
      </span>
    </Link>
  )
}

/**
 * Learn's Courses (the canvas's COURSESTRIP and COURSEGRID): under the heading and its See all, the
 * first courses of the shelves as covers, the one Continue is in first; a row that scrolls on a phone,
 * as many across as fit at 176 each on a laptop. See all opens the Courses' page.
 */
export function CourseCovers() {
  const { t } = useTranslation('learn')
  const fold = useFold('learn.courses')
  const learned = useProgress(selectLearned)
  const stateOf = useCoverState()
  const next = continueStep(learned)
  const current = next && 'course' in next ? next.course.id : undefined
  const all = SHELVES.flatMap((shelf) => coursesOn(shelf))
  const first = all.find((course) => course.id === current)
  const shown = [...(first ? [first] : []), ...all.filter((course) => course !== first)].slice(
    0,
    SHOWN,
  )
  return (
    <FoldSection
      title={t('courses')}
      fold={fold}
      className="min-w-0"
      action={<SeeAll label={t('seeAll')} render={<Link to="/courses" />} />}
    >
      <ul className="-mx-gutter -mt-1 flex snap-x snap-mandatory scroll-px-gutter gap-3 overflow-x-auto px-gutter pt-1 pb-1 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-[repeat(auto-fit,minmax(11rem,1fr))] lg:gap-4 lg:overflow-visible lg:px-0">
        {shown.map((course) => (
          <li key={course.id} className="flex">
            <CourseCover
              course={course}
              current={course.id === current}
              state={stateOf(course, learned)}
            />
          </li>
        ))}
      </ul>
    </FoldSection>
  )
}
