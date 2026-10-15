import { Link } from '@tanstack/react-router'
import { Check } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { type Course } from '@/entities/course'
import { selectLearned, useProgress } from '@/entities/progress'
import { courseLessonStepId, STAGE_PAINT, type StepId } from '@/entities/step'
import { localText, useLocale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { PAINT } from '@/shared/ui'

/**
 * A course's lessons, as the courses-app lists them: each a card with its number on a tile in the
 * course's paint (grass with a check once learned, ringed in honey where Continue leads), its title
 * and what it teaches. Every lesson opens; the order only suggests.
 */
export function CourseLessons({ course, next }: { course: Course; next: StepId | undefined }) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const id = useId()
  const learned = useProgress(selectLearned)
  const paint = PAINT[STAGE_PAINT[course.stage]]
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3">
      <h2 id={id} className="text-3xl">
        {t('course.lessons')}
      </h2>
      <ol className="grid gap-3 lg:grid-cols-2">
        {course.lessons.map((lesson, i) => {
          const step = courseLessonStepId(course.id, lesson.id)
          const done = learned[step] !== undefined
          const current = step === next
          return (
            <li key={lesson.id} className="flex">
              <Link
                to="/courses/$courseId/$lessonId"
                params={{ courseId: course.id, lessonId: lesson.id }}
                aria-current={current ? 'step' : undefined}
                className={cn(
                  'group flex min-w-0 flex-1 overflow-hidden card transition-colors duration-200 ease-out hover:bg-muted/40',
                  current && 'ring-4 ring-primary',
                )}
              >
                <span
                  className={cn(
                    'grid w-20 shrink-0 place-items-center border-r border-border',
                    done ? 'bg-learned text-learned-foreground' : cn(paint.fill, paint.ink),
                  )}
                >
                  {done ? (
                    <Check aria-hidden className="size-7" strokeWidth={3} />
                  ) : (
                    <span aria-hidden className="font-display text-3xl font-semibold tabular-nums">
                      {i + 1}
                    </span>
                  )}
                </span>
                <span className="flex min-w-0 flex-col gap-1 p-4">
                  <span className="font-display text-lg leading-snug font-semibold text-balance">
                    <span className="sr-only">{t('lessonNumber', { n: i + 1 })}: </span>
                    {localText(lesson.title, locale)}
                  </span>
                  <span className="line-clamp-2 text-sm text-muted-foreground text-pretty">
                    {localText(lesson.summary, locale)}
                  </span>
                </span>
              </Link>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
