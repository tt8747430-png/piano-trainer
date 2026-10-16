import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { coursesOn, SHELVES, type Shelf } from '@/entities/course'
import { selectLearned, useProgress } from '@/entities/progress'
import { continueStep } from '../model/continue-step'
import { CourseCard } from './CourseCard'

/** A shelf: its name, and its courses as compact cards, as many across as fit. */
function ShelfSection({ shelf, current }: { shelf: Shelf; current: string | undefined }) {
  const { t } = useTranslation('learn')
  const id = useId()
  const courses = coursesOn(shelf)
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3">
      <h2 id={id} className="text-2xl text-balance">
        {t(`shelves.${shelf}`)}
      </h2>
      <ul className="grid-cards gap-3">
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
    <div className="flex flex-col gap-8">
      {SHELVES.map((shelf) => (
        <ShelfSection key={shelf} shelf={shelf} current={current} />
      ))}
    </div>
  )
}
