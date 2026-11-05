import { Link } from '@tanstack/react-router'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { type Course } from '@/entities/course'
import { selectLearned, selectRead, useProgress } from '@/entities/progress'
import { courseLessonStepId, STAGE_PAINT, type StepId } from '@/entities/step'
import { localText, useLocale } from '@/shared/i18n'
import { PAINT } from '@/shared/ui'
import { lessonShare } from '../model/progress'
import { LessonRow } from './LessonRow'

/**
 * A course's lessons, numbered as taught, in one card: each row its number on a tile in the course's
 * paint (grass with a check once learned; ringed in honey where Continue leads; an arc round it as
 * its sections are read), its title and the lessons to read before it. Every lesson opens; the order
 * only suggests.
 */
export function CourseLessons({ course, next }: { course: Course; next: StepId | undefined }) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const id = useId()
  const learned = useProgress(selectLearned)
  const read = useProgress(selectRead)
  const numberOf = (lessonId: string) =>
    course.lessons.findIndex((each) => each.id === lessonId) + 1
  const paint = PAINT[STAGE_PAINT[course.stage]]
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3">
      <h2 id={id} className="text-2xl">
        {t('course.lessons')}
      </h2>
      <ol className="flex flex-col divide-y divide-hairline overflow-hidden card">
        {course.lessons.map((lesson, i) => {
          const step = courseLessonStepId(course.id, lesson.id)
          const done = learned[step] !== undefined
          const current = step === next
          const share = lessonShare(lesson.sections.length, read[step], done)
          const after = (lesson.after ?? []).map(numberOf).filter((n) => n > 0)
          return (
            <li key={lesson.id}>
              <LessonRow
                render={
                  <Link
                    to="/courses/$courseId/$lessonId"
                    params={{ courseId: course.id, lessonId: lesson.id }}
                  />
                }
                mark={i + 1}
                paint={paint}
                done={done}
                share={share}
                current={current}
                said={t('lessonNumber', { n: i + 1 })}
                title={localText(lesson.title, locale)}
                detail={after.length > 0 ? t('after', { lessons: after.join(', ') }) : undefined}
              />
            </li>
          )
        })}
      </ol>
    </section>
  )
}
