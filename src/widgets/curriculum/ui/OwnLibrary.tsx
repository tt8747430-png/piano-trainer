import { Link } from '@tanstack/react-router'
import { Check, ChevronRight, Copy, Library, SearchX, Trash2 } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ownCourseLessons,
  selectOwnCourses,
  selectOwnLessons,
  useOwnLessons,
  useOwnLessonsStoreApi,
  type OwnCourse,
  type OwnLesson,
} from '@/entities/own-lessons'
import { selectLearned, useProgress, useProgressStoreApi, isLearned } from '@/entities/progress'
import { lessonStepId } from '@/entities/step'
import { duplicateOwnCourse, duplicateOwnLesson } from '@/features/manage-own-lessons'
import { localText, useLocale } from '@/shared/i18n'
import { cn, flipped, matchesQuery } from '@/shared/lib'
import {
  BackButton,
  CheckMark,
  ChoiceChips,
  LessonIcon,
  MoreMenu,
  NewDial,
  PAINT,
  Said,
  say,
  sayUndo,
  ScreenHeader,
  SearchField,
  SelectAct,
  SelectDock,
  SortMenu,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { NewOwnSheet, type OwnKind } from './NewOwnSheet'
import { useNewOwnActions } from './use-new-own-actions'
import { useOwnRowActions } from './use-own-row-actions'
import { deleteOwn } from '../model/delete-own'
import type { OwnLibraryView, OwnShown, OwnSort } from '../model/learn-view'

/** What Select holds: a lesson's or a course's id, kept apart by kind. */
type Pick = `${'lesson' | 'course'}:${string}`

/** A row's shape, phone and laptop (the canvas's LROW and TROW_L): the laptop's columns follow its name. */
function Row({
  picking,
  picked,
  onPick,
  name,
  indent,
  link,
  columns,
  more,
  fold,
}: {
  picking: boolean
  picked: boolean
  onPick: () => void
  name: string
  /** What stands between Select's mark and the link: a course's fold, a lesson's indent. */
  indent: ReactNode
  link: ReactNode
  /** Length and Progress, the laptop's table columns. */
  columns: readonly [string, string]
  more: ReactNode
  /** A course's row: its fold at the row's edge, its tile right after it (the canvas's course row). */
  fold?: boolean
}) {
  return (
    <div
      className={cn(
        'relative flex min-h-18 items-center py-1.5 pe-1 lg:px-0',
        fold ? 'gap-0 lg:min-h-19 lg:gap-4' : 'gap-3 ps-1 lg:gap-4',
      )}
    >
      {picking ? (
        <button
          type="button"
          role="checkbox"
          aria-checked={picked}
          aria-label={name}
          onClick={onPick}
          className="absolute inset-0 z-1 focus-visible:-outline-offset-3"
        />
      ) : null}
      <div
        className={cn(
          'flex min-w-0 flex-1 items-center lg:flex-[2.4]',
          fold ? 'gap-0 lg:gap-2' : 'gap-3',
        )}
      >
        {picking ? <CheckMark checked={picked} className="mx-2.5" /> : null}
        {indent}
        {link}
      </div>
      <span className="hidden min-w-0 flex-1 text-sm text-muted-foreground tabular-nums lg:block">
        {columns[0]}
      </span>
      <span className="hidden min-w-0 flex-[1.2] text-sm text-muted-foreground tabular-nums lg:block">
        {columns[1]}
      </span>
      {/* Select hides the row's More; the laptop keeps its column so the table's columns hold. */}
      <span className={cn('w-11 shrink-0 justify-end', picking ? 'hidden lg:flex' : 'flex')}>
        {picking ? null : more}
      </span>
    </div>
  )
}

/** A lesson's tile, the canvas's LTILE: a 44 circle, the book on the card ringed, a check on sage once learned. */
function LessonTile({ done }: { done: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        'grid size-11 shrink-0 place-items-center rounded-pill',
        done ? 'bg-paint-grass text-on-paint-grass' : 'bg-card ring-1 ring-border ring-inset',
      )}
    >
      {done ? <Check className="size-5" strokeWidth={2.6} /> : <LessonIcon className="size-5" />}
    </span>
  )
}

/** A lesson of the learner's: its tile, name and length, its More (Open, Duplicate, Settings, Delete). */
function OwnLessonItem({
  lesson,
  nested,
  picking,
  picked,
  onPick,
}: {
  lesson: OwnLesson
  nested: boolean
  picking: boolean
  picked: boolean
  onPick: () => void
}) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const learned = useProgress(selectLearned)
  const step = lessonStepId(lesson.id)
  const done = isLearned(learned, step)
  const title = localText(lesson.title, locale)
  const length = t('own.sectionCount', { count: lesson.sections.length })
  const actions = useOwnRowActions({ kind: 'lesson', id: lesson.id }, title)
  return (
    <Row
      picking={picking}
      picked={picked}
      onPick={onPick}
      name={title}
      // A course's lesson stands under its course's tile; a loose one on the course tiles' edge.
      indent={
        <span aria-hidden className={cn('shrink-0', nested ? 'w-11 lg:w-14' : 'w-7 lg:w-10')} />
      }
      link={
        <Link
          to="/lessons/$lessonId"
          params={{ lessonId: lesson.id }}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-card focus-visible:-outline-offset-3"
        >
          <LessonTile done={done} />
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="font-semibold text-pretty">{title}</span>
            <span className="text-sm text-muted-foreground lg:hidden">
              {`${t('kind.lesson')} · ${length}`}
            </span>
          </span>
        </Link>
      }
      columns={[length, done ? t('own.learned') : '—']}
      more={<MoreMenu on="row" label={t('own.more', { title })} actions={actions} />}
    />
  )
}

/** A course of the learner's: a fold for its lessons, its tile, name and facts, its More. */
function OwnCourseItem({
  course,
  lessons,
  open,
  onToggle,
  picking,
  picked,
  onPick,
}: {
  course: OwnCourse
  lessons: readonly OwnLesson[]
  open: boolean
  onToggle: () => void
  picking: boolean
  picked: boolean
  onPick: () => void
}) {
  const { t } = useTranslation('learn')
  const learned = useProgress(selectLearned)
  const listed = ownCourseLessons(course, lessons)
  const done = listed.filter(({ lesson }) => isLearned(learned, lessonStepId(lesson.id))).length
  const length = t('course.lessonCount', { count: listed.length })
  const facts = [
    t('own.course'),
    length,
    ...(done > 0 ? [t('own.learnedCount', { count: done })] : []),
  ]
  const own = listed.flatMap(({ lesson, own: mine }) =>
    mine ? lessons.filter((each) => each.id === lesson.id) : [],
  )
  const paint = PAINT[course.look.paint].fill
  const actions = useOwnRowActions({ kind: 'course', id: course.id }, course.title)
  return (
    <Row
      fold
      picking={picking}
      picked={picked}
      onPick={onPick}
      name={course.title}
      indent={
        <button
          type="button"
          aria-expanded={open}
          aria-label={t('own.showLessons')}
          title={t('own.showLessons')}
          onClick={onToggle}
          disabled={own.length === 0}
          className={cn(
            'grid size-11 shrink-0 place-items-center rounded-pill text-muted-foreground transition-colors duration-200 ease-out hover:bg-muted hover:text-foreground disabled:invisible',
            // in Select its row moves as a lesson's does, 56 on both sizes, so their names stay aligned
            picking && 'ms-3 lg:ms-1',
          )}
        >
          <ChevronRight
            aria-hidden
            className={cn('size-5 transition-transform duration-200 ease-out', open && 'rotate-90')}
          />
        </button>
      }
      link={
        <Link
          to="/courses/$courseId"
          params={{ courseId: course.id }}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-card focus-visible:-outline-offset-3"
        >
          <span
            aria-hidden
            className={cn('grid size-11 shrink-0 place-items-center rounded-thumb', paint)}
          >
            <Library className="size-5" />
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="font-semibold text-pretty">{course.title}</span>
            <span className="text-sm text-muted-foreground lg:hidden">{facts.join(' · ')}</span>
          </span>
        </Link>
      }
      columns={[length, t('own.learnedOf', { done, total: listed.length })]}
      more={<MoreMenu on="row" label={t('own.more', { title: course.title })} actions={actions} />}
    />
  )
}

/**
 * Made by you (the canvas's LearnYours), the learner's own as a library: Select in the bar ("n
 * selected" its title while on), then search with its sort, All · Lessons · Courses, each course a
 * row folding open to its lessons, the lessons in no course on the course tiles' edge; every row's
 * More (Open, Duplicate, Settings, Delete with Undo); the floating + for New lesson and New course.
 * On a laptop the search stands in the bar and the list is the libraries' table (Name · Length ·
 * Progress). Select's floating bar duplicates or deletes what is picked, or all when nothing is.
 */
export function OwnLibrary({
  view,
  onView,
}: {
  /** What is shown, from the URL. */
  view: OwnLibraryView
  /** Writes a change of it into the URL, in place. */
  onView: (change: Partial<OwnLibraryView>) => void
}) {
  const { t } = useTranslation(['learn', 'common'])
  const locale = useLocale()
  const store = useOwnLessonsStoreApi()
  const progress = useProgressStoreApi()
  const lessons = useOwnLessons(selectOwnLessons)
  const courses = useOwnLessons(selectOwnCourses)
  const { q: query, kind, sort } = view
  const setQuery = (q: string) => onView({ q })
  const [opened, setOpened] = useState<ReadonlySet<string>>(new Set())
  const [picking, setPicking] = useState(false)
  const [picks, setPicks] = useState<ReadonlySet<Pick>>(new Set())
  const [making, setMaking] = useState<OwnKind | null>(null)
  const newActions = useNewOwnActions(setMaking)
  const searching = query.trim() !== ''
  const matches = (name: string) => matchesQuery([name], query)
  const order = <T,>(items: readonly T[], name: (item: T) => string): readonly T[] =>
    sort === 'name'
      ? items.toSorted((a, b) => name(a).localeCompare(name(b), locale))
      : items.toReversed()
  const lessonName = (lesson: OwnLesson) => localText(lesson.title, locale)
  const inSome = new Set(courses.flatMap((course) => course.lessons))
  const lessonsOf = (course: OwnCourse) =>
    ownCourseLessons(course, lessons).flatMap(({ lesson, own }) =>
      own ? lessons.filter((each) => each.id === lesson.id) : [],
    )
  const shownCourses =
    kind === 'lessons'
      ? []
      : order(
          courses.filter(
            (course) =>
              matches(course.title) || lessonsOf(course).some((l) => matches(lessonName(l))),
          ),
          (course) => course.title,
        )
  const shownLessons =
    kind === 'courses'
      ? []
      : order(
          lessons.filter(
            (lesson) =>
              (kind === 'lessons' || !inSome.has(lesson.id)) && matches(lessonName(lesson)),
          ),
          lessonName,
        )
  const none = lessons.length === 0 && courses.length === 0
  const any = shownCourses.length + shownLessons.length > 0
  const selecting = picking && any
  const toggle = (id: string) => setOpened((was) => flipped(was, id))
  const pick = (key: Pick) => setPicks((was) => flipped(was, key))
  const stopPicking = () => {
    setPicking(false)
    setPicks(new Set())
  }
  // Every row in sight, for Duplicate all and Delete all.
  const everyRow: readonly Pick[] = [
    ...shownCourses.flatMap((course): Pick[] => [
      `course:${course.id}`,
      ...lessonsOf(course).map((lesson): Pick => `lesson:${lesson.id}`),
    ]),
    ...shownLessons.map((lesson): Pick => `lesson:${lesson.id}`),
  ]
  const chosen = picks.size > 0 ? [...picks] : everyRow
  // The lessons and courses picked, as themselves (their ids keep their kind).
  const split = (keys: readonly Pick[]) => ({
    lessonIds: lessons.filter((lesson) => keys.includes(`lesson:${lesson.id}`)).map((l) => l.id),
    courseIds: courses.filter((course) => keys.includes(`course:${course.id}`)).map((c) => c.id),
  })
  const counted = (lessonCount: number, courseCount: number) =>
    [
      lessonCount > 0 ? t('own.lessonsCounted', { count: lessonCount }) : '',
      courseCount > 0 ? t('own.coursesCounted', { count: courseCount }) : '',
    ]
      .filter(Boolean)
      .join(t('own.and'))
  const duplicateChosen = () => {
    const { lessonIds, courseIds } = split(chosen)
    let lessonCount = 0
    let courseCount = 0
    for (const id of courseIds) {
      const course = courses.find((each) => each.id === id)
      if (course && duplicateOwnCourse(store, id, t('own.copyName', { name: course.title })))
        courseCount += 1
    }
    for (const id of lessonIds) {
      const lesson = lessons.find((each) => each.id === id)
      if (lesson && duplicateOwnLesson(store, id, t('own.copyName', { name: lessonName(lesson) })))
        lessonCount += 1
    }
    stopPicking()
    if (lessonCount + courseCount === 1) say(t('own.duplicated'))
    else if (lessonCount + courseCount > 1)
      say(t('own.copied', { things: counted(lessonCount, courseCount) }))
  }
  const deleteChosen = () => {
    const { lessonIds, courseIds } = split(chosen)
    const deleted = deleteOwn(store, progress, { lessons: lessonIds, courses: courseIds })
    stopPicking()
    if (!deleted) return
    const { lessons: goneLessons, courses: goneCourses } = deleted
    const only =
      goneCourses[0]?.course.title ??
      (goneLessons[0] ? lessonName(goneLessons[0].lesson) : undefined)
    sayUndo(
      goneLessons.length + goneCourses.length === 1 && only !== undefined
        ? t('own.deleted', { title: only })
        : t('own.deletedMany', { things: counted(goneLessons.length, goneCourses.length) }),
      deleted.undo,
    )
  }
  const title = selecting
    ? picks.size > 0
      ? t('own.selectedCount', { count: picks.size })
      : t('own.select')
    : t('own.title')
  const search = (
    <SearchField
      value={query}
      onChange={setQuery}
      label={t('own.search')}
      hint={t('own.searchHint')}
      end={
        <SortMenu<OwnSort>
          field
          label={t('common:library.sort')}
          sort={sort}
          sorts={[
            { value: 'recent', label: t('own.sortRecent') },
            { value: 'name', label: t('own.sortName') },
          ]}
          onSort={(next) => onView({ sort: next })}
        />
      }
    />
  )
  const selectWord = any ? (
    <Button
      variant="bar"
      className="shrink-0 px-4"
      onClick={() => (selecting ? stopPicking() : setPicking(true))}
    >
      {selecting ? t('common:confirm.cancel') : t('own.select')}
    </Button>
  ) : null
  return (
    <div className="flex flex-col pb-8">
      <ScreenHeader
        title={title}
        large
        back={<BackButton />}
        tools={
          <>
            {none ? null : <div className="hidden w-105 lg:block">{search}</div>}
            {selectWord}
          </>
        }
      />
      {/* The column starts 8 under the bar, 24 under the laptop's, as the boards' (LTITLEBAR). */}
      <div className="mt-2 flex flex-col gap-3 lg:mt-6 lg:gap-4">
        {none ? null : (
          <>
            <div className="lg:hidden">{search}</div>
            <ChoiceChips<OwnShown>
              label={t('own.show')}
              value={kind}
              options={[
                { value: 'all', label: t('own.all') },
                { value: 'lessons', label: t('own.lessonsOnly') },
                { value: 'courses', label: t('own.coursesOnly') },
              ]}
              onChange={(next) => onView({ kind: next })}
            />
          </>
        )}
        {none ? (
          <Said
            icon={LessonIcon}
            title={t('own.bareTitle')}
            description={t('own.bareLine')}
            action={
              <Link
                to="/courses"
                className="inline-flex min-h-11 items-center px-2 font-semibold text-link"
              >
                {t('own.browseCourses')}
              </Link>
            }
          />
        ) : !any ? (
          <Said
            quiet
            icon={SearchX}
            title={t('own.noMatch', { query: query.trim() })}
            description={t('own.noMatchLine')}
            action={<Button onClick={() => setQuery('')}>{t('own.clear')}</Button>}
          />
        ) : (
          <div className="flex flex-col">
            {/* The laptop's table head: Name over the names, wherever Select's mark and the fold put them. */}
            <div className="hidden gap-4 pb-2 text-footnote/[normal] font-semibold text-muted-foreground shadow-[inset_0_-1px_0_var(--color-border)] lg:flex">
              <span className="min-w-0 flex-[2.4]">
                <span className={selecting ? 'ps-41' : 'ps-27'}>{t('own.columnName')}</span>
              </span>
              <span className="min-w-0 flex-1">{t('own.columnLength')}</span>
              <span className="min-w-0 flex-[1.2]">{t('own.columnProgress')}</span>
              <span className="w-11 shrink-0" />
            </div>
            <ul className="flex flex-col rows-hairline overflow-hidden card ps-2 lg:overflow-visible lg:rounded-none lg:ring-0 lg:bg-transparent lg:ps-0">
              {shownCourses.map((course) => {
                const open = (opened.has(course.id) || searching) && kind !== 'courses'
                const inside = lessonsOf(course).filter(
                  (lesson) => !searching || matches(course.title) || matches(lessonName(lesson)),
                )
                return [
                  <li key={course.id}>
                    <OwnCourseItem
                      course={course}
                      lessons={lessons}
                      open={open}
                      onToggle={() => toggle(course.id)}
                      picking={selecting}
                      picked={picks.has(`course:${course.id}`)}
                      onPick={() => pick(`course:${course.id}`)}
                    />
                  </li>,
                  ...(open
                    ? inside.map((lesson) => (
                        <li key={`${course.id}/${lesson.id}`}>
                          <OwnLessonItem
                            lesson={lesson}
                            nested
                            picking={selecting}
                            picked={picks.has(`lesson:${lesson.id}`)}
                            onPick={() => pick(`lesson:${lesson.id}`)}
                          />
                        </li>
                      ))
                    : []),
                ]
              })}
              {shownLessons.map((lesson) => (
                <li key={lesson.id}>
                  <OwnLessonItem
                    lesson={lesson}
                    nested={false}
                    picking={selecting}
                    picked={picks.has(`lesson:${lesson.id}`)}
                    onPick={() => pick(`lesson:${lesson.id}`)}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {selecting ? (
        <SelectDock label={title} className="lg:w-110">
          <SelectAct
            icon={Copy}
            label={picks.size > 0 ? t('own.duplicate') : t('own.duplicateAll')}
            onClick={duplicateChosen}
          />
          <SelectAct
            icon={Trash2}
            destructive
            label={picks.size > 0 ? t('own.delete') : t('own.deleteAll')}
            onClick={deleteChosen}
          />
        </SelectDock>
      ) : (
        <NewDial label={t('own.new')} actions={newActions} />
      )}
      <NewOwnSheet kind={making} onClose={() => setMaking(null)} />
    </div>
  )
}
