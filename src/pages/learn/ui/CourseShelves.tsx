import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { MODULE_SHELVES, SHELF_MODULES, type ModuleShelf } from '@/entities/lesson'
import { CourseCard } from './CourseCard'

/** One shelf of courses: a row that scrolls sideways on a phone, each card snapping to the gutter; a grid on a laptop. */
function Shelf({ shelf }: { shelf: ModuleShelf }) {
  const { t } = useTranslation('learn')
  const id = useId()
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3">
      <h2 id={id} className="text-2xl">
        {t(`shelves.${shelf}`)}
      </h2>
      <ul className="-mx-gutter flex snap-x snap-mandatory scroll-px-[var(--gutter)] gap-3 overflow-x-auto overscroll-x-contain px-gutter pb-2 scrollbar-none lg:mx-0 lg:grid lg:grid-cols-[repeat(auto-fill,minmax(17rem,1fr))] lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0">
        {SHELF_MODULES[shelf].map((module) => (
          <li key={module} className="w-[min(18rem,80%)] shrink-0 snap-start lg:w-auto">
            <CourseCard module={module} />
          </li>
        ))}
      </ul>
    </section>
  )
}

/** Learn's Courses view (ADR 0049): every module as a card, on the Subjects shelf and the Courses shelf. */
export function CourseShelves() {
  return (
    <div className="flex flex-col gap-8">
      {MODULE_SHELVES.map((shelf) => (
        <Shelf key={shelf} shelf={shelf} />
      ))}
    </div>
  )
}
