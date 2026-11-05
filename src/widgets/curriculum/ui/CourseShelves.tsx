import { lazy, Suspense, useId } from 'react'
import { useTranslation } from 'react-i18next'
import { coursesAbout, coursesOn, SHELVES, type Shelf } from '@/entities/course'
import { hasAbout } from '@/entities/lesson'
import { selectLearned, useProgress } from '@/entities/progress'
import { continueStep } from '../model/continue-step'
import { CourseCard } from './CourseCard'
import { OwnCourses } from './OwnCourses'

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
 * technique courses, chords and improvising, then the method books; then Your courses (R30-5), the
 * learner's own. The course Continue is in ringed.
 * Over them the Courses' About, where an editor wrote one (R29 B9).
 */
export function CourseShelves() {
  const { t } = useTranslation('learn')
  const about = coursesAbout()
  const learned = useProgress(selectLearned)
  const next = continueStep(learned)
  const current = next && 'course' in next ? next.course.id : undefined
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      {/* The Courses' About (R29 B9), an editor's, over the shelves. */}
      {hasAbout(about) ? (
        <Suspense fallback={null}>
          <AboutView about={about} label={t('coursesAbout')} className="px-1" />
        </Suspense>
      ) : null}
      {SHELVES.map((shelf) => (
        <ShelfSection key={shelf} shelf={shelf} current={current} />
      ))}
      <OwnCourses />
    </div>
  )
}
