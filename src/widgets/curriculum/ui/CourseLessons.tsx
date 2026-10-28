import { Link } from '@tanstack/react-router'
import { Check, ChevronRight } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { type Course } from '@/entities/course'
import { selectLearned, selectRead, useProgress } from '@/entities/progress'
import { courseLessonStepId, STAGE_PAINT, type StepId } from '@/entities/step'
import { localText, useLocale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { PAINT, ProgressRing } from '@/shared/ui'
import { lessonShare } from '../model/progress'

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
              <Link
                to="/courses/$courseId/$lessonId"
                params={{ courseId: course.id, lessonId: lesson.id }}
                aria-current={current ? 'step' : undefined}
                className="group flex min-h-16 items-center gap-4 px-3 py-2 transition-colors duration-200 ease-out hover:bg-muted focus-visible:-outline-offset-3"
              >
                <ProgressRing share={done || current ? 0 : share} className={paint.ink}>
                  <span
                    aria-hidden
                    className={cn(
                      'grid size-10 shrink-0 place-items-center rounded-full font-display text-lg font-semibold tabular-nums',
                      done ? 'bg-learned text-learned-foreground' : cn(paint.fill, paint.ink),
                      current && 'ring-2 ring-primary ring-offset-2 ring-offset-card',
                    )}
                  >
                    {done ? <Check className="size-5" strokeWidth={3} /> : i + 1}
                  </span>
                </ProgressRing>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="font-semibold text-pretty">
                    <span className="sr-only">{t('lessonNumber', { n: i + 1 })}: </span>
                    {localText(lesson.title, locale)}
                    {/* The check and the arc say it to the eye alone. */}
                    {done ? <span className="sr-only">, {t('learned')}</span> : null}
                    {!done && share > 0 ? (
                      <span className="sr-only">
                        , {t('read', { percent: Math.round(share * 100) })}
                      </span>
                    ) : null}
                  </span>
                  {after.length > 0 ? (
                    <span className="text-sm text-muted-foreground tabular-nums">
                      {t('after', { lessons: after.join(', ') })}
                    </span>
                  ) : null}
                </span>
                <ChevronRight
                  aria-hidden
                  className="size-5 shrink-0 text-muted-foreground transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:text-foreground"
                />
              </Link>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
