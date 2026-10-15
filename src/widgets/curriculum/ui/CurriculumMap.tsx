import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { coursesIn, STAGES, type Stage } from '@/entities/course'
import { selectLearned, selectSuggestedStep, useProgress } from '@/entities/progress'
import { courseProgress, isComplete } from '../model/course-progress'
import { CourseRow } from './CourseRow'
import { placeOf } from '../model/node-place'

/** A stage of the curriculum: its name, what it is for, its courses done, and its courses on one line. */
function StageSection({ stage, currentCourse }: { stage: Stage; currentCourse?: string }) {
  const { t } = useTranslation(['learn', 'common'])
  const id = useId()
  const learned = useProgress(selectLearned)
  const courses = coursesIn(stage).map((course) => ({
    course,
    progress: courseProgress(course, learned),
  }))
  const done = courses.filter(({ progress }) => isComplete(progress)).length
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id={id} className="text-3xl">
            {t(`common:stage.${stage}`)}
          </h2>
          <span className="shrink-0 text-muted-foreground tabular-nums">
            {t('learn:coursesDone', { done, total: courses.length })}
          </span>
        </div>
        <p className="text-lg text-muted-foreground text-pretty">{t(`learn:stageGoal.${stage}`)}</p>
      </div>
      <ol className="flex flex-col">
        {courses.map(({ course, progress }, i) => (
          <CourseRow
            key={course.id}
            course={course}
            progress={progress}
            current={course.id === currentCourse}
            place={placeOf(i, courses.length)}
          />
        ))}
      </ol>
    </section>
  )
}

/**
 * The curriculum (ADR 0051), beginner to professional: each stage its courses in the order taught, the
 * course Continue is in marked. Every course opens; the order only suggests.
 */
export function CurriculumMap() {
  const suggested = useProgress(selectSuggestedStep)
  return (
    <div className="flex flex-col gap-10">
      {STAGES.map((stage) => (
        <StageSection key={stage} stage={stage} currentCourse={suggested?.course.id} />
      ))}
    </div>
  )
}
