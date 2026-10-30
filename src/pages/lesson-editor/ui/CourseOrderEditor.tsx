import { Link } from '@tanstack/react-router'
import { useRef, useState, type ReactElement, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { courseById, courseIcon, SHELVES, type CourseOrder } from '@/entities/course'
import { STAGE_PAINT } from '@/entities/step'
import { useCourseOrderDraft } from '@/features/edit-original'
import { localText, useLocale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { PAINT } from '@/shared/ui'
import { DraftScreen, RowGroups, type RowOrder } from '@/widgets/content-editor'

/** The order with each shelf's courses as dragged, the shelves' places among the whole kept. */
function withShelves(order: CourseOrder, shelves: RowOrder): CourseOrder {
  const dragged = shelves.flatMap((shelf) => shelf.rows)
  const known = new Set(dragged)
  return { courses: [...dragged, ...order.courses.filter((id) => !known.has(id))] }
}

/** The shelves as Courses shows them, each its courses in the order's sequence. */
function shelvesOf(order: CourseOrder) {
  return SHELVES.map((shelf) => ({
    shelf,
    courses: order.courses.flatMap((id) => {
      const course = courseById(id)
      return course && course.shelf === shelf ? [course] : []
    }),
  }))
}

/**
 * Manage courses (content as data, ADR 0116 r25), an editor's: the Courses' shelves as cards, each
 * course a row dragged into its place on its shelf; the order a draft of `catalog` `courses`,
 * published as one. A course changes shelf in its own editor, its Shelf property.
 */
export function CourseOrderEditor({
  back,
  toCourses,
}: {
  /** The screen's Back (`BackButton`). */
  back: ReactNode
  /** A router `Link` to the Courses. */
  toCourses: ReactElement
}) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const draft = useCourseOrderDraft()
  const written = useRef<{ opened: number; order: CourseOrder } | null>(null)
  const save = (next: CourseOrder) => {
    written.current = { opened: draft.opened, order: next }
    draft.save(next)
  }
  return (
    <DraftScreen
      draft={draft}
      heading={t('edit.courses.open')}
      title={t('edit.courses.open')}
      back={back}
      backTo={{ link: toCourses, label: t('edit.courses.back') }}
      editorsOnly={t('edit.courses.editorsOnly')}
      unreadable={t('edit.courses.editorsOnly')}
    >
      {(initial) => (
        <ShelvesDocument
          initial={written.current?.opened === draft.opened ? written.current.order : initial}
          locale={locale}
          onChange={save}
        />
      )}
    </DraftScreen>
  )
}

function ShelvesDocument({
  initial,
  locale,
  onChange,
}: {
  initial: CourseOrder
  locale: ReturnType<typeof useLocale>
  onChange: (order: CourseOrder) => void
}) {
  const { t } = useTranslation('learn')
  const [order, setOrder] = useState(initial)
  return (
    <div className="flex flex-col gap-2">
      <RowGroups
        fixed
        groups={shelvesOf(order).map(({ shelf, courses }) => ({
          key: shelf,
          region: t(`shelves.${shelf}`),
          label: t(`shelves.${shelf}`),
          empty: t('edit.courses.empty'),
          head: (
            <h2 className="mt-4 px-3 font-display text-xl font-semibold">
              {t(`shelves.${shelf}`)}
            </h2>
          ),
          rows: courses.map((course) => {
            const paint = PAINT[STAGE_PAINT[course.stage]]
            return {
              key: course.id,
              title: localText(course.title, locale),
              detail: t('course.lessonCount', { count: course.lessons.length }),
              icon: courseIcon(course.id),
              paint: cn(paint.fill, paint.ink),
              link: <Link to="/courses/$courseId/edit" params={{ courseId: course.id }} />,
            }
          }),
        }))}
        onChange={(shelves) => {
          const next = withShelves(order, shelves)
          setOrder(next)
          onChange(next)
        }}
      />
    </div>
  )
}
