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

/** A shelf as a group of the library: its name small over one card of its courses' rows. */
function ShelfSection({ shelf, current }: { shelf: Shelf; current: string | undefined }) {
  const { t } = useTranslation('learn')
  const id = useId()
  const courses = coursesOn(shelf)
  return (
    <section aria-labelledby={id} className="flex flex-col gap-2">
      <h2 id={id} className="px-3 font-sans text-sm font-semibold text-muted-foreground">
        {t(`shelves.${shelf}`)}
      </h2>
      <ul className="flex flex-col divide-y divide-hairline overflow-hidden card">
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
 */
export function CourseShelves() {
  const learned = useProgress(selectLearned)
  const next = continueStep(learned)
  const current = next && 'course' in next ? next.course.id : undefined
  return (
    // On a laptop the shelves stand two a row across the page's width, never one long column.
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-x-8">
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
        <ul aria-label={t('shelvesLabel')} className="flex flex-col divide-y divide-hairline">
          {SHELVES.map((shelf) => (
            <li key={shelf} className="flex min-h-9 items-center justify-between gap-3">
              <span>{t(`shelves.${shelf}`)}</span>
              <span className="text-muted-foreground tabular-nums">
                {t('courseCount', { count: coursesOn(shelf).length })}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </InfoTip>
  )
}
