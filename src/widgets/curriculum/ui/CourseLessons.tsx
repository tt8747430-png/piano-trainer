import { Link } from '@tanstack/react-router'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { type Course } from '@/entities/course'
import { selectLearned, selectRead, useProgress } from '@/entities/progress'
import { courseLessonStepId, type StepId } from '@/entities/step'
import { localText, useLocale } from '@/shared/i18n'
import { lessonShare } from '../model/progress'
import { afterWorthSaying } from '../model/after'
import { LessonLine, LessonRow, LessonStop } from './LessonRow'

/**
 * A course's lessons (the canvas's LROWS), numbered as taught, on the level's one timeline: each its
 * 44 tile on the column's edge (a soft dot until learned, the book ringed in honey where Continue
 * leads, grass with a check once learned), its title and the lessons to read before it; under the
 * Lessons heading, 12 nearer it than to what stands above. On a laptop four across in reading order,
 * each ending where its words end. Every lesson opens; the order only suggests.
 */
export function CourseLessons({ course, next }: { course: Course; next: StepId | undefined }) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const id = useId()
  const learned = useProgress(selectLearned)
  const read = useProgress(selectRead)
  const numberOf = (lessonId: string) =>
    course.lessons.findIndex((each) => each.id === lessonId) + 1
  return (
    <section aria-labelledby={id} className="flex flex-col">
      <h2 id={id} className="font-sans text-xl leading-[normal] font-bold">
        {t('course.lessons')}
      </h2>
      <LessonLine across={4}>
        {course.lessons.map((lesson, i) => {
          const step = courseLessonStepId(course.id, lesson.id)
          const done = learned[step] !== undefined
          const current = step === next
          const share = lessonShare(lesson.sections.length, read[step], done)
          const after = afterWorthSaying(
            (lesson.after ?? []).map(numberOf).filter((n) => n > 0),
            i + 1,
          )
          return (
            <LessonStop
              key={lesson.id}
              reached={done || current}
              passed={done}
              first={i === 0}
              last={i === course.lessons.length - 1}
            >
              <LessonRow
                render={
                  <Link
                    to="/courses/$courseId/$lessonId"
                    params={{ courseId: course.id, lessonId: lesson.id }}
                  />
                }
                done={done}
                share={share}
                current={current}
                title={localText(lesson.title, locale)}
                detail={
                  [
                    t('lessonNumber', { n: i + 1 }),
                    after.length > 0 ? t('after', { lessons: after.join(', ') }) : null,
                  ]
                    .filter(Boolean)
                    .join(' · ') || undefined
                }
              />
            </LessonStop>
          )
        })}
      </LessonLine>
    </section>
  )
}
