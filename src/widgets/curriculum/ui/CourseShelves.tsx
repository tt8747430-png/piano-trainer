import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { coursesOn, SHELVES, type Shelf } from '@/entities/course'
import { selectLearned, useProgress } from '@/entities/progress'
import { continueStep } from '../model/continue-step'
import { CourseCard } from './CourseCard'

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
 * technique courses, chords and improvising, then the method books. The course Continue is in ringed.
 */
export function CourseShelves() {
  const learned = useProgress(selectLearned)
  const next = continueStep(learned)
  const current = next && 'course' in next ? next.course.id : undefined
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      {SHELVES.map((shelf) => (
        <ShelfSection key={shelf} shelf={shelf} current={current} />
      ))}
    </div>
  )
}
