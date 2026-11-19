import { lazy, Suspense, useId } from 'react'
import { useTranslation } from 'react-i18next'
import { coursesAbout, coursesOn, SHELVES, type Shelf } from '@/entities/course'
import { hasAbout } from '@/entities/lesson'
import { selectLearned, useProgress } from '@/entities/progress'
import { InfoTip } from '@/shared/ui'
import { continueStep } from '../model/continue-step'
import { CourseCard } from './CourseCard'

/** An About's view, its own chunk: most visits to the Courses have none to draw. */
const AboutView = lazy(() =>
  import('@/widgets/lesson-view').then((module) => ({ default: module.AboutView })),
)

/**
 * A shelf (the canvas's COURSEROWS): its name 14 semibold in soft ink on the rows' 16 inset, 8 over
 * one card of its courses' rows; on a laptop the name on the page's edge, 12 over a grid of three
 * cards 16 apart, so every row shares its tops and bottoms.
 */
function ShelfSection({ shelf, current }: { shelf: Shelf; current: string | undefined }) {
  const { t } = useTranslation('learn')
  const id = useId()
  const courses = coursesOn(shelf)
  return (
    <section aria-labelledby={id} className="flex flex-col gap-2 lg:gap-3">
      <h2 id={id} className="px-4 font-sans text-sm font-semibold text-muted-foreground lg:px-0">
        {t(`shelves.${shelf}`)}
      </h2>
      <ul className="flex flex-col rows-hairline overflow-hidden card lg:grid lg:grid-cols-[repeat(auto-fill,minmax(max(15rem,calc((100%-2rem)/3)),1fr))] lg:gap-4 lg:overflow-visible lg:rounded-none lg:ring-0 lg:bg-transparent lg:[&>li]:after:hidden">
        {courses.map((course) => (
          <li key={course.id}>
            <CourseCard course={course} current={course.id === current} />
          </li>
        ))}
      </ul>
    </section>
  )
}

/**
 * The Courses (ADR 0053), as the courses-app shelves them: the beginner's, the intermediate's, the
 * technique courses, chords and improvising, then the method books, on the Courses' page (canvas
 * 163). The course Continue is in ringed. The Courses' About is in the page's ⓘ (`CoursesAbout`).
 * On a laptop the shelves stand one under another, full width, 40 apart.
 */
export function CourseShelves() {
  const learned = useProgress(selectLearned)
  const next = continueStep(learned)
  const current = next && 'course' in next ? next.course.id : undefined
  return (
    <div className="flex w-full flex-col gap-4 lg:gap-10">
      {SHELVES.map((shelf) => (
        <ShelfSection key={shelf} shelf={shelf} current={current} />
      ))}
    </div>
  )
}

/**
 * The Courses' About (R29 B9, canvas 167), in the ⓘ beside the Courses' title, never a box over the
 * shelves: the editor's document on what the courses are (else one line on what a course is), then the shelves themselves with how many
 * courses each holds, the facts rather than more prose.
 */
export function CoursesAbout() {
  const { t } = useTranslation('learn')
  const about = coursesAbout()
  return (
    <InfoTip name={t('courses')} bar>
      <div className="flex flex-col gap-3">
        {hasAbout(about) ? (
          <Suspense fallback={null}>
            <AboutView about={about} label={t('coursesAbout')} />
          </Suspense>
        ) : (
          <p>{t('coursesLine')}</p>
        )}
        <ul aria-label={t('shelvesLabel')} className="flex flex-col rows-hairline">
          {SHELVES.map((shelf) => (
            <li key={shelf} className="flex min-h-9 items-center justify-between gap-3">
              <span>{t(`shelves.${shelf}`)}</span>
              <span className="text-muted-foreground">
                {t('courseCount', { count: coursesOn(shelf).length })}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </InfoTip>
  )
}
