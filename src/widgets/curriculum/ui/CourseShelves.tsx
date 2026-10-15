import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { coursesOn, SHELVES, type Shelf } from '@/entities/course'
import { selectLearned, useProgress } from '@/entities/progress'
import { continueStep } from '../model/continue-step'
import { CourseCard } from './CourseCard'

/** A shelf: its name and what is on it, its courses side by side, scrolled across on a phone. */
function ShelfSection({ shelf, current }: { shelf: Shelf; current: string | undefined }) {
  const { t } = useTranslation('learn')
  const id = useId()
  const courses = coursesOn(shelf)
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h2 id={id} className="text-3xl text-balance">
          {t(`shelves.${shelf}`)}
        </h2>
        <p className="text-muted-foreground text-pretty">{t(`shelfAbout.${shelf}`)}</p>
      </div>
      <ul className="-mx-gutter flex snap-x snap-mandatory scroll-px-gutter gap-4 overflow-x-auto px-gutter pb-2 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 2xl:grid-cols-3">
        {courses.map((course) => (
          <li key={course.id} className="w-72 shrink-0 snap-start md:w-auto">
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
    <div className="flex flex-col gap-10">
      {SHELVES.map((shelf) => (
        <ShelfSection key={shelf} shelf={shelf} current={current} />
      ))}
    </div>
  )
}
