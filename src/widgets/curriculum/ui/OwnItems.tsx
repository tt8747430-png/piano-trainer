import { Link, useNavigate } from '@tanstack/react-router'
import { BookOpenText } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { FolderTile } from '@/entities/library'
import {
  ownCourseLessons,
  selectOwnCourses,
  selectOwnLessons,
  useOwnLessons,
  useOwnLessonsStoreApi,
  type OwnCourse,
} from '@/entities/own-lessons'
import { selectLearned, selectRead, useProgress } from '@/entities/progress'
import { lessonStepId } from '@/entities/step'
import { createOwnCourse, createOwnLesson } from '@/features/manage-own-lessons'
import { localText, useLocale } from '@/shared/i18n'
import { OpensMark } from '@/shared/ui'
import { lessonShare } from '../model/progress'
import { LessonRow } from './LessonRow'
import { NewRow } from './NewRow'

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

/**
 * Your lessons and courses (canvas 163), Learn's last group: the lessons the learner wrote, each a
 * row as a level's lesson is (learned, read so far), the courses they put together, then New lesson
 * and New course, each naming one and opening it in its editor. They count towards no level.
 */
export function OwnItems() {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const id = useId()
  const navigate = useNavigate()
  const store = useOwnLessonsStoreApi()
  const lessons = useOwnLessons(selectOwnLessons)
  const courses = useOwnLessons(selectOwnCourses)
  const learned = useProgress(selectLearned)
  const read = useProgress(selectRead)
  const newLesson = (name: string) => {
    const made = createOwnLesson(store, name)
    if (made) void navigate({ to: '/lessons/$lessonId/edit', params: { lessonId: made } })
    return made !== null
  }
  const newCourse = (name: string) => {
    const made = createOwnCourse(store, name)
    if (made) void navigate({ to: '/courses/$courseId/edit', params: { courseId: made } })
    return made !== null
  }
  return (
    <section aria-labelledby={id} className="flex min-w-0 flex-col gap-2">
      <h2 id={id} className="px-1 text-lg font-semibold">
        {t('own.title')}
      </h2>
      <ul className="flex flex-col divide-y divide-hairline overflow-hidden card">
        {lessons.map((lesson) => {
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
        {courses.map((course) => (
          <li key={course.id}>
            <OwnCourseRow course={course} />
          </li>
        ))}
        <li>
          <NewRow
            label={t('own.newLesson')}
            createLabel={t('own.createLesson')}
            onCreate={newLesson}
          />
        </li>
        <li>
          <NewRow
            label={t('own.newCourse')}
            createLabel={t('own.createCourse')}
            onCreate={newCourse}
          />
        </li>
      </ul>
    </section>
  )
}
