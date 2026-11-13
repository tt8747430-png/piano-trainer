import { BookOpenText } from 'lucide-react'
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
 * A course's lessons, numbered as taught, in one card: each row its number on a plain tile (grass
 * with a check once learned; ringed in honey where Continue leads; an arc round it as
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
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3">
      <h2 id={id} className="font-sans text-xl font-bold">
        {t('course.lessons')}
      </h2>
      <LessonLine>
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
            <LessonStop key={lesson.id}>
              <LessonRow
                render={
                  <Link
                    to="/courses/$courseId/$lessonId"
                    params={{ courseId: course.id, lessonId: lesson.id }}
                  />
                }
                // As a level's line: the next one its book, the rest their number, said once.
                mark={current ? <BookOpenText className="size-5" strokeWidth={1.75} /> : i + 1}
                done={done}
                share={share}
                current={current}
                said={t('lessonNumber', { n: i + 1 })}
                title={localText(lesson.title, locale)}
                detail={
                  [
                    current || done ? t('lessonNumber', { n: i + 1 }) : null,
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
