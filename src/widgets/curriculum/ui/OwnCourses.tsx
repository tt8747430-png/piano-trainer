import { Link, useNavigate } from '@tanstack/react-router'
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
import { selectLearned, useProgress } from '@/entities/progress'
import { lessonStepId } from '@/entities/step'
import { createOwnCourse } from '@/features/manage-own-lessons'
import { OpensMark } from '@/shared/ui'
import { NewRow } from './NewRow'

/** An own course as a row of the Courses: its cover, its name, its lessons and how many are learned. */
function OwnCourseRow({ course }: { course: OwnCourse }) {
  const { t } = useTranslation('learn')
  const lessons = useOwnLessons(selectOwnLessons)
  const learned = useProgress(selectLearned)
  const listed = ownCourseLessons(course, lessons)
  const done = listed.filter(({ lesson }) => learned[lessonStepId(lesson.id)] !== undefined).length
  const facts = [
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
 * Your courses (R30-5), after the Courses' shelves: the courses the learner put together, then New
 * course, which names one and opens it in the course editor.
 */
export function OwnCourses() {
  const { t } = useTranslation('learn')
  const id = useId()
  const navigate = useNavigate()
  const store = useOwnLessonsStoreApi()
  const courses = useOwnLessons(selectOwnCourses)
  const create = (name: string) => {
    const made = createOwnCourse(store, name)
    if (made) void navigate({ to: '/courses/$courseId/edit', params: { courseId: made } })
    return made !== null
  }
  return (
    <section aria-labelledby={id} className="flex flex-col gap-2">
      <h2 id={id} className="px-3 font-sans text-sm font-semibold text-muted-foreground">
        {t('own.courses')}
      </h2>
      <ul className="flex flex-col divide-y divide-hairline overflow-hidden card">
        {courses.map((course) => (
          <li key={course.id}>
            <OwnCourseRow course={course} />
          </li>
        ))}
        <li>
          <NewRow
            label={t('own.newCourse')}
            createLabel={t('own.createCourse')}
            onCreate={create}
          />
        </li>
      </ul>
    </section>
  )
}
