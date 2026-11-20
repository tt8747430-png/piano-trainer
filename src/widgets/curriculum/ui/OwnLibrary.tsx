import { Link, useNavigate } from '@tanstack/react-router'
import { Check, ChevronRight, Copy, Library, SearchX, Settings, Trash2 } from 'lucide-react'
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
import { selectLearned, useProgress, useProgressStoreApi } from '@/entities/progress'
import { lessonStepId } from '@/entities/step'
import {
  deleteOwnCourse,
  deleteOwnLesson,
  duplicateOwnCourse,
  duplicateOwnLesson,
  restoreOwnCourse,
  restoreOwnLesson,
} from '@/features/manage-own-lessons'
import { resetSteps, restoreSteps } from '@/features/reset-progress'
import { localText, useLocale } from '@/shared/i18n'
import { cn, flipped } from '@/shared/lib'
import {
  BackButton,
  CheckMark,
  ChoiceChips,
  FloatingActions,
  LessonIcon,
  NewDial,
  PAINT,
  RowMore,
  Said,
  say,
  sayUndo,
  ScreenHeader,
  SearchField,
  SortMenu,
  Toolbar,
  type MenuAction,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { NewOwnSheet, type OwnKind } from './NewOwnSheet'
import { useNewOwnActions } from './use-new-own-actions'

type Kind = 'all' | 'lessons' | 'courses'
type Sort = 'recent' | 'name'

/** What Select holds: a lesson's or a course's id, kept apart by kind. */
type Pick = `${'lesson' | 'course'}:${string}`

/** Select's mark, the canvas's YCHECK: a 24 circle leading the row, ink and ticked once picked. */
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
  const navigate = useNavigate()
  const store = useOwnLessonsStoreApi()
  const progress = useProgressStoreApi()
  const learned = useProgress(selectLearned)
  const step = lessonStepId(lesson.id)
  const done = learned[step] !== undefined
  const title = localText(lesson.title, locale)
  const length = t('own.sectionCount', { count: lesson.sections.length })
  const actions: MenuAction[] = [
    {
      key: 'open',
      label: t('own.open'),
      icon: LessonIcon,
      onSelect: () => void navigate({ to: '/lessons/$lessonId', params: { lessonId: lesson.id } }),
    },
    {
      key: 'duplicate',
      label: t('own.duplicate'),
      icon: Copy,
      onSelect: () => {
        if (duplicateOwnLesson(store, lesson.id, t('own.copyName', { name: title })))
          say(t('own.duplicated'))
      },
    },
    {
      key: 'settings',
      label: t('own.settings'),
      icon: Settings,
      onSelect: () =>
        void navigate({ to: '/lessons/$lessonId/settings', params: { lessonId: lesson.id } }),
    },
    {
      key: 'delete',
      label: t('own.delete'),
      icon: Trash2,
      destructive: true,
      onSelect: () => {
        const deleted = deleteOwnLesson(store, lesson.id)
        if (!deleted) return
        const forgotten = resetSteps(progress, [step])
        sayUndo(t('own.deleted', { title }), () => {
          restoreOwnLesson(store, deleted)
          restoreSteps(progress, forgotten)
        })
      },
    },
  ]
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
      more={<RowMore label={t('own.more', { title })} actions={actions} />}
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
  const navigate = useNavigate()
  const store = useOwnLessonsStoreApi()
  const learned = useProgress(selectLearned)
  const listed = ownCourseLessons(course, lessons)
  const done = listed.filter(({ lesson }) => learned[lessonStepId(lesson.id)] !== undefined).length
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
  const actions: MenuAction[] = [
    {
      key: 'open',
      label: t('own.open'),
      icon: Library,
      onSelect: () => void navigate({ to: '/courses/$courseId', params: { courseId: course.id } }),
    },
    {
      key: 'duplicate',
      label: t('own.duplicate'),
      icon: Copy,
      onSelect: () => {
        if (duplicateOwnCourse(store, course.id, t('own.copyName', { name: course.title })))
          say(t('own.duplicated'))
      },
    },
    {
      key: 'settings',
      label: t('own.settings'),
      icon: Settings,
      onSelect: () =>
        void navigate({ to: '/courses/$courseId/settings', params: { courseId: course.id } }),
    },
    {
      key: 'delete',
      label: t('own.delete'),
      icon: Trash2,
      destructive: true,
      onSelect: () => {
        const deleted = deleteOwnCourse(store, course.id)
        if (!deleted) return
        sayUndo(t('own.deleted', { title: course.title }), () => restoreOwnCourse(store, deleted))
      },
    },
  ]
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
            picking && 'ms-2',
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
            className={cn('grid size-11 shrink-0 place-items-center rounded-[11px]', paint)}
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
      more={<RowMore label={t('own.more', { title: course.title })} actions={actions} />}
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
export function OwnLibrary() {
  const { t } = useTranslation(['learn', 'common'])
  const locale = useLocale()
  const store = useOwnLessonsStoreApi()
  const lessons = useOwnLessons(selectOwnLessons)
  const courses = useOwnLessons(selectOwnCourses)
  const [query, setQuery] = useState('')
  const [kind, setKind] = useState<Kind>('all')
  const [sort, setSort] = useState<Sort>('recent')
  const [opened, setOpened] = useState<ReadonlySet<string>>(new Set())
  const [picking, setPicking] = useState(false)
  const [picks, setPicks] = useState<ReadonlySet<Pick>>(new Set())
  const [making, setMaking] = useState<OwnKind | null>(null)
  const newActions = useNewOwnActions(setMaking)
  const needle = query.trim().toLocaleLowerCase(locale)
  const matches = (name: string) => needle === '' || name.toLocaleLowerCase(locale).includes(needle)
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
    const goneCourses = courseIds.flatMap((id) => {
      const deleted = deleteOwnCourse(store, id)
      return deleted ? [deleted] : []
    })
    const goneLessons = lessonIds.flatMap((id) => {
      const deleted = deleteOwnLesson(store, id)
      return deleted ? [deleted] : []
    })
    stopPicking()
    const total = goneCourses.length + goneLessons.length
    if (total === 0) return
    const only =
      goneCourses[0]?.course.title ??
      (goneLessons[0] ? lessonName(goneLessons[0].lesson) : undefined)
    sayUndo(
      total === 1 && only !== undefined
        ? t('own.deleted', { title: only })
        : t('own.deletedMany', { things: counted(goneLessons.length, goneCourses.length) }),
      () => {
        for (const lesson of goneLessons) restoreOwnLesson(store, lesson)
        for (const course of goneCourses) restoreOwnCourse(store, course)
      },
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
        <SortMenu<Sort>
          field
          label={t('common:library.sort')}
          sort={sort}
          sorts={[
            { value: 'recent', label: t('own.sortRecent') },
            { value: 'name', label: t('own.sortName') },
          ]}
          onSort={setSort}
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
            <ChoiceChips<Kind>
              label={t('own.show')}
              value={kind}
              options={[
                { value: 'all', label: t('own.all') },
                { value: 'lessons', label: t('own.lessonsOnly') },
                { value: 'courses', label: t('own.coursesOnly') },
              ]}
              onChange={setKind}
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
            icon={SearchX}
            title={t('own.noMatch', { query: query.trim() })}
            description={t('own.noMatchLine')}
            action={
              <Button variant="secondary" size="lg" onClick={() => setQuery('')}>
                {t('own.clear')}
              </Button>
            }
          />
        ) : (
          <div className="flex flex-col">
            {/* The laptop's table head: Name over the names, wherever Select's mark and the fold put them. */}
            <div className="hidden gap-4 pb-2 text-[0.8125rem]/[normal] font-semibold text-muted-foreground shadow-[inset_0_-1px_0_var(--color-border)] lg:flex">
              <span className={cn('min-w-0 flex-[2.4]', selecting ? 'ps-41' : 'ps-27')}>
                {t('own.columnName')}
              </span>
              <span className="min-w-0 flex-1">{t('own.columnLength')}</span>
              <span className="min-w-0 flex-[1.2]">{t('own.columnProgress')}</span>
              <span className="w-11 shrink-0" />
            </div>
            <ul className="flex flex-col rows-hairline overflow-hidden card ps-2 lg:overflow-visible lg:rounded-none lg:ring-0 lg:bg-transparent lg:ps-0">
              {shownCourses.map((course) => {
                const open = (opened.has(course.id) || needle !== '') && kind !== 'courses'
                const inside = lessonsOf(course).filter(
                  (lesson) => needle === '' || matches(course.title) || matches(lessonName(lesson)),
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
        <FloatingActions className="justify-center">
          <Toolbar
            label={title}
            className="glass flex h-17 w-[calc(100vw-2rem)] items-center gap-2 rounded-pill px-2 lg:w-110"
          >
            <SelectAct icon={Copy} onClick={duplicateChosen}>
              {picks.size > 0 ? t('own.duplicate') : t('own.duplicateAll')}
            </SelectAct>
            <SelectAct icon={Trash2} destructive onClick={deleteChosen}>
              {picks.size > 0 ? t('own.delete') : t('own.deleteAll')}
            </SelectAct>
          </Toolbar>
        </FloatingActions>
      ) : (
        <NewDial label={t('own.new')} actions={newActions} />
      )}
      <NewOwnSheet kind={making} onClose={() => setMaking(null)} />
    </div>
  )
}

/** One of Select's acts, the canvas's SELACT: its 20 icon over its 12 name, in a 52 pill of the bar. */
function SelectAct({
  icon: Icon,
  destructive,
  onClick,
  children,
}: {
  icon: typeof Copy
  destructive?: boolean
  onClick: () => void
  children: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-13 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-pill transition-colors duration-200 ease-out hover:bg-foreground/5',
        destructive && 'text-destructive',
      )}
    >
      <Icon aria-hidden className="size-5" />
      <span className="text-xs font-semibold whitespace-nowrap">{children}</span>
    </button>
  )
}
