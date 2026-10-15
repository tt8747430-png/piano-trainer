import { useId, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { stepIdOf, type Course, type Step } from '@/entities/course'
import {
  selectAllAnswers,
  selectLearned,
  selectSuggestedStep,
  useProgress,
} from '@/entities/progress'
import { placeOf } from '../model/node-place'
import { StepNode } from './StepNode'

/** A titled run of a course's steps on one line. */
function StepGroup({
  title,
  detail,
  children,
}: {
  title: string
  detail?: string
  children: ReactNode
}) {
  const id = useId()
  return (
    <section aria-labelledby={id} className="flex flex-col gap-2">
      <h2 id={id} className="text-2xl">
        {title}
      </h2>
      {detail ? <p className="text-muted-foreground text-pretty">{detail}</p> : null}
      <ol className="flex flex-col gap-1">{children}</ol>
    </section>
  )
}

/**
 * A course's steps (ADR 0051): its lessons numbered as taught, then what to practise once they are
 * read, each on the course's line with its state; the one Continue opens lit.
 */
export function CourseSteps({ course }: { course: Course }) {
  const { t } = useTranslation('learn')
  const learned = useProgress(selectLearned)
  const answers = useProgress(selectAllAnswers)
  const next = useProgress(selectSuggestedStep)?.id
  const node = (step: Step, i: number, count: number, numeral?: number) => {
    const id = stepIdOf(step)
    return (
      <StepNode
        key={id}
        step={step}
        numeral={numeral}
        answers={answers}
        learned={learned[id] !== undefined}
        next={id === next}
        place={placeOf(i, count)}
      />
    )
  }
  const lessons = course.lessons.map((lessonId): Step => ({ kind: 'lesson', lessonId }))
  return (
    <div className="flex flex-col gap-8">
      <StepGroup title={t('course.lessons')}>
        {lessons.map((step, i) => node(step, i, lessons.length, i + 1))}
      </StepGroup>
      {course.practice.length > 0 ? (
        <StepGroup title={t('course.practise')} detail={t('course.practiseAbout')}>
          {course.practice.map((step, i) => node(step, i, course.practice.length))}
        </StepGroup>
      ) : null}
    </div>
  )
}
