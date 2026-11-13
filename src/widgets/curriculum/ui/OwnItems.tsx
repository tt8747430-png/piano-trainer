import { Link } from '@tanstack/react-router'
import { BookOpenText, Plus } from 'lucide-react'
import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FolderTile } from '@/entities/library'
import {
  ownCourseLessons,
  selectOwnCourses,
  selectOwnLessons,
  useOwnLessons,
  type OwnCourse,
} from '@/entities/own-lessons'
import { selectLearned, selectRead, useProgress } from '@/entities/progress'
import { lessonStepId } from '@/entities/step'
import { localText, useLocale } from '@/shared/i18n'
import { ActionMenu, OpensMark } from '@/shared/ui'
import { lessonShare } from '../model/progress'
import { LessonRow } from './LessonRow'
import { NewOwnSheet, useNewOwnActions, type OwnKind } from './NewOwnSheet'

/** A course of the learner's as a row: its cover, its name, its lessons and how many are learned. */
function OwnCourseRow({ course }: { course: OwnCourse }) {
  const { t } = useTranslation('learn')
  const lessons = useOwnLessons(selectOwnLessons)
  const learned = useProgress(selectLearned)
  const listed = ownCourseLessons(course, lessons)
  const done = listed.filter(({ lesson }) => learned[lessonStepId(lesson.id)] !== undefined).length
  const facts = [
    t('own.course'),
    t('course.lessonCount', { count: listed.length }),
    ...(done > 0 ? [t('own.learnedCount', { count: done })] : []),
  ]
  return (
    <Link
      to="/courses/$courseId"
      params={{ courseId: course.id }}
      className="group flex min-h-16 items-center gap-4 px-3 py-2 transition-colors duration-200 ease-out hover:bg-muted focus-visible:-outline-offset-3"
    >
      <FolderTile look={course.look} />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="font-semibold text-pretty">{course.title}</span>
        <span className="text-sm text-muted-foreground tabular-nums">{facts.join(' · ')}</span>
      </span>
      <OpensMark />
    </Link>
  )
}

/** How many of the learner's own Learn shows; the rest are on their page. */
const SHOWN = 4

/**
 * Your lessons and courses (canvas 165), Learn's last group: the newest of the learner's own, the
 * courses with their covers first, then the lessons as a level's are (learned, read so far), See all opening
 * their page, then one New row whose menu holds New lesson and New course, each its own sheet (canvas 167). They count towards no level.
 */
export function OwnItems() {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const id = useId()
  const lessons = useOwnLessons(selectOwnLessons)
  const courses = useOwnLessons(selectOwnCourses)
  const learned = useProgress(selectLearned)
  const read = useProgress(selectRead)
  const [making, setMaking] = useState<OwnKind | null>(null)
  const newActions = useNewOwnActions(setMaking)
  const shownCourses = courses.toReversed().slice(0, SHOWN)
  const shownLessons = lessons.toReversed().slice(0, SHOWN - shownCourses.length)
  return (
    <section aria-labelledby={id} className="flex min-w-0 flex-col gap-2">
      <div className="flex items-center justify-between gap-4 px-1">
        <h2 id={id} className="font-sans text-xl font-bold">
          {t('own.title')}
        </h2>
        {lessons.length + courses.length > 0 ? (
          <Link
            to="/your-lessons"
            className="-mx-2 inline-flex min-h-11 items-center rounded-control px-2 font-semibold text-link hover:underline"
          >
            {t('seeAll')}
          </Link>
        ) : null}
      </div>
      <ul className="flex flex-col divide-y divide-hairline overflow-hidden card">
        {shownCourses.map((course) => (
          <li key={course.id}>
            <OwnCourseRow course={course} />
          </li>
        ))}
        {shownLessons.map((lesson) => {
          const step = lessonStepId(lesson.id)
          const learnedIt = learned[step] !== undefined
          return (
            <li key={lesson.id}>
              <LessonRow
                render={<Link to="/lessons/$lessonId" params={{ lessonId: lesson.id }} />}
                mark={<BookOpenText className="size-5" strokeWidth={1.75} />}
                done={learnedIt}
                share={lessonShare(lesson.sections.length, read[step], learnedIt)}
                title={localText(lesson.title, locale)}
                detail={`${t('kind.lesson')} · ${t('own.sectionCount', { count: lesson.sections.length })}`}
              />
            </li>
          )
        })}
        <li>
          <ActionMenu
            label={t('own.newOwn')}
            trigger={
              <>
                <span aria-hidden className="grid size-10 shrink-0 place-items-center">
                  <Plus className="size-5" />
                </span>
                {t('own.newOwn')}
              </>
            }
            render={
              <button
                type="button"
                className="flex min-h-16 w-full items-center gap-4 px-3 py-2 text-left font-semibold text-link transition-colors duration-200 ease-out hover:bg-muted focus-visible:-outline-offset-3"
              />
            }
            actions={newActions}
          />
        </li>
      </ul>
      <NewOwnSheet kind={making} onClose={() => setMaking(null)} />
    </section>
  )
}
