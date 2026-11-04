import { Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { Fragment, lazy, Suspense, useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { courseById, courseIcon, SHELVES, type CourseOrder, type Shelf } from '@/entities/course'
import { hasAbout } from '@/entities/lesson'
import { STAGE_PAINT } from '@/entities/step'
import { DraftActions, DraftStatus, useCourseOrderDraft } from '@/features/edit-original'
import { localText, useLocale, type Locale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { PAINT } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { NewCourseSheet, NotOpen, RowGroups, type RowOrder } from '@/widgets/content-editor'

/** The About's document, the editor's own chunk: Learn opens without it. */
const AboutDocument = lazy(() =>
  import('@/widgets/lesson-document').then((module) => ({ default: module.AboutDocument })),
)

/** The order with each shelf's courses as dragged, the shelves' places among the whole kept. */
function withShelves(order: CourseOrder, shelves: RowOrder): CourseOrder {
  const dragged = shelves.flatMap((shelf) => shelf.rows)
  const known = new Set(dragged)
  return { ...order, courses: [...dragged, ...order.courses.filter((id) => !known.has(id))] }
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

function ShelvesDocument({
  initial,
  locale,
  onChange,
  onNew,
}: {
  initial: CourseOrder
  locale: Locale
  onChange: (order: CourseOrder) => void
  onNew: (shelf: Shelf) => void
}) {
  const { t } = useTranslation('learn')
  const [order, setOrder] = useState(initial)
  // The order as last written: the About's document writes over it, whenever it was opened.
  const latest = useRef(initial)
  const change = (next: CourseOrder) => {
    latest.current = next
    setOrder(next)
    onChange(next)
  }
  return (
    <>
      {/* The Courses' About (R29 B9): the lesson's document over the shelves, written in place. */}
      <section aria-labelledby="courses-about" className="flex flex-col gap-2">
        <h2 id="courses-about" className="px-3 font-display text-xl font-semibold">
          {t('coursesAbout')}
        </h2>
        <Suspense fallback={null}>
          <AboutDocument
            initial={order.about ?? []}
            locale={locale}
            label={t('coursesAbout')}
            onChange={(about) => {
              // An About with nothing in it is none; the document's own first steps save nothing.
              const { about: was, ...rest } = latest.current
              const next = hasAbout(about) ? about : undefined
              if (JSON.stringify(next) === JSON.stringify(was)) return
              change(next ? { ...rest, about: next } : rest)
            }}
          />
        </Suspense>
      </section>
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
          // A new course on this shelf: the New sheet, its shelf chosen.
          foot: (
            <Button
              variant="ghost"
              className="self-start text-muted-foreground"
              onClick={() => onNew(shelf)}
            >
              <Plus data-icon="inline-start" aria-hidden />
              {t('edit.course.new')}
            </Button>
          ),
        }))}
        onChange={(shelves) => change(withShelves(latest.current, shelves))}
      />
    </>
  )
}

/**
 * The Courses' shelves in Edit mode (R29 B4, content as data ADR 0116 r25), in place on Learn: each
 * shelf's courses rows dragged into order (a course changes shelf by its own Shelf, in its editor),
 * New course at a shelf's end; the order a draft of `catalog` `courses`, published as one. Its bar
 * (`bar`) carries the draft's status, Publish and menu before the page's Done.
 */
export function ShelfEditor({ bar }: { bar: (actions: ReactNode) => ReactNode }) {
  const { t } = useTranslation(['learn', 'editor'])
  const locale = useLocale()
  const draft = useCourseOrderDraft()
  const [making, setMaking] = useState<Shelf | null>(null)
  // The last change, where the document opens again (another language): kept as it was written.
  const [written, setWritten] = useState<{ opened: number; order: CourseOrder } | null>(null)
  const { load } = draft
  const save = (next: CourseOrder) => {
    setWritten({ opened: draft.opened, order: next })
    draft.save(next)
  }
  return (
    <>
      {bar(
        load.state === 'ready' ? (
          <>
            <DraftStatus draft={draft} className="me-1" />
            <DraftActions
              draft={draft}
              title={t('learn:views.courses')}
              unreadable={t('learn:edit.courses.editorsOnly')}
              onReset={draft.reopen}
            />
          </>
        ) : null,
      )}
      <div className="mx-auto mt-4 flex w-full max-w-2xl min-w-0 flex-col gap-2">
        {load.state === 'loading' ? (
          <NotOpen line={t('editor:original.opening')} />
        ) : load.state === 'failed' ? (
          <NotOpen
            line={t(
              load.reason === 'offline' ? 'editor:original.offline' : 'editor:original.failed',
            )}
          >
            <Button onClick={draft.reopen}>{t('editor:original.retry')}</Button>
          </NotOpen>
        ) : (
          <Fragment key={draft.opened}>
            <ShelvesDocument
              initial={written?.opened === draft.opened ? written.order : load.value}
              locale={locale}
              onChange={save}
              onNew={setMaking}
            />
          </Fragment>
        )}
      </div>
      <NewCourseSheet
        key={making ?? 'shut'}
        open={making !== null}
        shelf={making ?? undefined}
        onOpenChange={(open) => (open ? undefined : setMaking(null))}
      />
    </>
  )
}
