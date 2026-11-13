import { Link, useNavigate } from '@tanstack/react-router'
import {
  BookOpenText,
  ChevronDown,
  ChevronRight,
  Copy,
  Plus,
  Settings2,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FolderTile } from '@/entities/library'
import {
  ownCourseLessons,
  selectOwnCourses,
  selectOwnLessons,
  useOwnLessons,
  useOwnLessonsStoreApi,
  type OwnCourse,
  type OwnLesson,
} from '@/entities/own-lessons'
import { selectLearned, selectRead, useProgress, useProgressStoreApi } from '@/entities/progress'
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
import { cn } from '@/shared/lib'
import {
  ActionMenu,
  ChoiceChips,
  FloatingActions,
  RowMore,
  say,
  SearchField,
  SortChoice,
  SpeedDial,
  SpeedDialAction,
  type MenuAction,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { lessonShare } from '../model/progress'
import { LessonRow } from './LessonRow'
import { NewOwnSheet, useNewOwnActions, type OwnKind } from './NewOwnSheet'

type Kind = 'all' | 'lessons' | 'courses'
type Sort = 'recent' | 'name'

/** A lesson of the learner's as a row of the library: its tile and progress, its link, its More. */
function OwnLessonItem({ lesson, nested }: { lesson: OwnLesson; nested: boolean }) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const navigate = useNavigate()
  const store = useOwnLessonsStoreApi()
  const progress = useProgressStoreApi()
  const learned = useProgress(selectLearned)
  const read = useProgress(selectRead)
  const step = lessonStepId(lesson.id)
  const done = learned[step] !== undefined
  const title = localText(lesson.title, locale)
  const actions: MenuAction[] = [
    {
      key: 'open',
      label: t('own.open'),
      icon: BookOpenText,
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
      icon: Settings2,
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
        say(t('own.deleted', { title }), {
          label: t('settings.undo'),
          onClick: () => {
            restoreOwnLesson(store, deleted)
            restoreSteps(progress, forgotten)
          },
        })
      },
    },
  ]
  return (
    <div className={cn('flex items-center gap-1 pr-1', nested && 'ps-9')}>
      <div className="min-w-0 flex-1">
        <LessonRow
          render={<Link to="/lessons/$lessonId" params={{ lessonId: lesson.id }} />}
          mark={<BookOpenText className="size-5" strokeWidth={1.75} />}
          done={done}
          share={lessonShare(lesson.sections.length, read[step], done)}
          title={title}
          detail={`${t('kind.lesson')} · ${t('own.sectionCount', { count: lesson.sections.length })}`}
          opens={false}
        />
      </div>
      <RowMore label={t('own.more', { title })} actions={actions} />
    </div>
  )
}

/** A course of the learner's: a fold for its lessons, its cover, name and facts, its More. */
function OwnCourseItem({
  course,
  lessons,
  open,
  onToggle,
}: {
  course: OwnCourse
  lessons: readonly OwnLesson[]
  open: boolean
  onToggle: () => void
}) {
  const { t } = useTranslation('learn')
  const navigate = useNavigate()
  const store = useOwnLessonsStoreApi()
  const learned = useProgress(selectLearned)
  const listed = ownCourseLessons(course, lessons)
  const done = listed.filter(({ lesson }) => learned[lessonStepId(lesson.id)] !== undefined).length
  const facts = [
    t('own.course'),
    t('course.lessonCount', { count: listed.length }),
    ...(done > 0 ? [t('own.learnedCount', { count: done })] : []),
  ]
  const own = listed.flatMap(({ lesson, own: mine }) =>
    mine ? lessons.filter((each) => each.id === lesson.id) : [],
  )
  const actions: MenuAction[] = [
    {
      key: 'open',
      label: t('own.open'),
      icon: BookOpenText,
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
      icon: Settings2,
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
        say(t('own.deleted', { title: course.title }), {
          label: t('settings.undo'),
          onClick: () => restoreOwnCourse(store, deleted),
        })
      },
    },
  ]
  return (
    <li>
      <div className="flex items-center gap-1 pr-1">
        <button
          type="button"
          aria-expanded={open}
          aria-label={t('own.showLessons')}
          title={t('own.showLessons')}
          onClick={onToggle}
          disabled={own.length === 0}
          className="grid size-11 shrink-0 place-items-center rounded-pill text-muted-foreground transition-colors duration-200 ease-out hover:bg-muted hover:text-foreground disabled:invisible"
        >
          <ChevronRight
            aria-hidden
            className={cn('size-5 transition-transform duration-200 ease-out', open && 'rotate-90')}
          />
        </button>
        <Link
          to="/courses/$courseId"
          params={{ courseId: course.id }}
          className="flex min-h-16 min-w-0 flex-1 items-center gap-4 rounded-card py-2 pr-2 transition-colors duration-200 ease-out hover:bg-muted focus-visible:-outline-offset-3"
        >
          <FolderTile look={course.look} />
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="font-semibold text-pretty">{course.title}</span>
            <span className="text-sm text-muted-foreground tabular-nums">{facts.join(' · ')}</span>
          </span>
        </Link>
        <RowMore label={t('own.more', { title: course.title })} actions={actions} />
      </div>
      {open && own.length > 0 ? (
        <ul className="flex flex-col divide-y divide-hairline border-t border-hairline">
          {own.map((lesson) => (
            <li key={lesson.id}>
              <OwnLessonItem lesson={lesson} nested />
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  )
}

/**
 * Your lessons and courses (canvas 165), the learner's own as a library: search, All · Lessons ·
 * Courses, a sort, each course a row that folds open to its lessons, the lessons in no course below;
 * every row's More (Open, Duplicate, Settings, Delete with Undo); New lesson and New course, the dial of
 * the floating + on a phone and a menu beside the search on a laptop (canvas 167).
 */
export function OwnLibrary() {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const lessons = useOwnLessons(selectOwnLessons)
  const courses = useOwnLessons(selectOwnCourses)
  const [query, setQuery] = useState('')
  const [kind, setKind] = useState<Kind>('all')
  const [sort, setSort] = useState<Sort>('recent')
  const [opened, setOpened] = useState<ReadonlySet<string>>(new Set())
  const [making, setMaking] = useState<OwnKind | null>(null)
  const newActions = useNewOwnActions(setMaking)
  const needle = query.trim().toLocaleLowerCase(locale)
  const matches = (name: string) => needle === '' || name.toLocaleLowerCase(locale).includes(needle)
  const order = <T,>(items: readonly T[], name: (item: T) => string): readonly T[] =>
    sort === 'name'
      ? items.toSorted((a, b) => name(a).localeCompare(name(b), locale))
      : items.toReversed()
  const inSome = new Set(courses.flatMap((course) => course.lessons))
  const shownCourses =
    kind === 'lessons'
      ? []
      : order(
          courses.filter((course) => matches(course.title)),
          (course) => course.title,
        )
  const shownLessons = order(
    lessons.filter(
      (lesson) =>
        (kind === 'lessons' || !inSome.has(lesson.id)) && matches(localText(lesson.title, locale)),
    ),
    (lesson) => localText(lesson.title, locale),
  )
  const visibleLessons = kind === 'courses' ? [] : shownLessons
  const none = lessons.length === 0 && courses.length === 0
  const nothing = shownCourses.length === 0 && visibleLessons.length === 0
  const toggle = (id: string) =>
    setOpened((was) => {
      const next = new Set(was)
      if (!next.delete(id)) next.add(id)
      return next
    })
  return (
    <div className="flex flex-col gap-4">
      {none ? null : (
        <>
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <SearchField
                value={query}
                onChange={setQuery}
                label={t('own.search')}
                end={
                  <SortChoice<Sort>
                    value={sort}
                    options={[
                      { value: 'recent', label: t('own.sortRecent'), short: t('own.sortRecent') },
                      { value: 'name', label: t('own.sortName'), short: t('own.sortName') },
                    ]}
                    onChange={setSort}
                  />
                }
              />
            </div>
            <div className="max-lg:hidden">
              <ActionMenu
                label={t('own.new')}
                align="end"
                trigger={
                  <>
                    <Plus aria-hidden />
                    {t('own.new')}
                    <ChevronDown aria-hidden />
                  </>
                }
                render={<Button />}
                actions={newActions}
              />
            </div>
          </div>
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
        <div className="flex flex-col items-start gap-4 card p-5">
          <p className="text-pretty">{t('own.empty')}</p>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setMaking('lesson')}>
              <BookOpenText data-icon="inline-start" aria-hidden />
              {t('own.newLesson')}
            </Button>
            <Button variant="outline" onClick={() => setMaking('course')}>
              {t('own.newCourse')}
            </Button>
          </div>
        </div>
      ) : nothing ? (
        <div className="flex flex-col items-start gap-3 card p-5">
          <p className="text-pretty">{t('own.noMatch', { query: query.trim() })}</p>
          <Button variant="outline" onClick={() => setQuery('')}>
            {t('own.clear')}
          </Button>
        </div>
      ) : (
        <ul className="flex flex-col divide-y divide-hairline overflow-hidden card">
          {shownCourses.map((course) => (
            <OwnCourseItem
              key={course.id}
              course={course}
              lessons={lessons}
              open={(opened.has(course.id) || needle !== '') && kind !== 'courses'}
              onToggle={() => toggle(course.id)}
            />
          ))}
          {visibleLessons.map((lesson) => (
            <li key={lesson.id}>
              <OwnLessonItem lesson={lesson} nested={false} />
            </li>
          ))}
        </ul>
      )}
      <FloatingActions className="lg:hidden">
        <SpeedDial label={t('own.new')} icon={Plus} main>
          {newActions.toReversed().map((action) => (
            <SpeedDialAction
              key={action.key}
              label={action.label}
              icon={action.icon ?? Plus}
              onClick={action.onSelect}
            />
          ))}
        </SpeedDial>
      </FloatingActions>
      <NewOwnSheet kind={making} onClose={() => setMaking(null)} />
    </div>
  )
}
