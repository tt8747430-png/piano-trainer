import { BookOpenText, ChartNoAxesColumnIncreasing, KeyboardMusic } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { lessonById, type Chapter, type Journey, type JourneyStep } from '@/entities/lesson'
import {
  knownCount,
  selectAllAnswers,
  selectLearned,
  selectRead,
  useProgress,
} from '@/entities/progress'
import { lessonStepId, skillsOfStep, StepLink, stepIdOf, type StepId } from '@/entities/step'
import { localText, useLocale } from '@/shared/i18n'
import { ProgressMeter } from '@/shared/ui'
import { continueStep } from '../model/continue-step'
import { journeyProgress, lessonShare } from '../model/progress'
import { afterWorthSaying } from '../model/after'
import { useStepTitle } from '../model/use-step-title'
import { LessonLine, LessonRow, LessonStop } from './LessonRow'

const ICON = {
  lesson: BookOpenText,
  chords: KeyboardMusic,
  scale: ChartNoAxesColumnIncreasing,
} as const

/**
 * A step of a chapter as a library's row: its tile plain until learned (a lesson's number, a
 * check's picture; grass with a check once learned, an arc round it as a lesson is read, ringed in honey where Continue leads), its title and
 * one detail line (a lesson's number and the lessons to read first; a check's kind and how much of it
 * is known), Next where Continue leads, a chevron. The whole row opens it.
 */
function StepRow({
  step,
  number,
  numbers,
  next,
}: {
  step: JourneyStep
  number: number | undefined
  numbers: ReadonlyMap<StepId, number>
  next: boolean
}) {
  const { t } = useTranslation('learn')
  const title = useStepTitle()(step).primary
  const learned = useProgress(selectLearned)
  const read = useProgress(selectRead)
  const answers = useProgress(selectAllAnswers)
  const id = stepIdOf(step)
  const done = learned[id] !== undefined
  const lesson = step.kind === 'lesson' ? lessonById(step.lessonId) : undefined
  const share = lesson ? lessonShare(lesson.sections.length, read[id], done) : 0
  const Icon = ICON[step.kind]
  const asked = (lesson?.after ?? []).flatMap((each) => {
    const n = numbers.get(lessonStepId(each))
    return n === undefined ? [] : [n]
  })
  const after = number === undefined ? asked : afterWorthSaying(asked, number)
  const skills = skillsOfStep(step)
  const detail =
    step.kind === 'lesson'
      ? [
          // The number said once: on the tile, or here where the tile shows Next's book or a check.
          number === undefined || !(next || done) ? null : t('lessonNumber', { n: number }),
          after.length > 0 ? t('after', { lessons: after.join(', ') }) : null,
        ]
      : [
          t(`kind.${step.kind}`),
          skills.length > 0
            ? t('known', { known: knownCount(skills, answers), total: skills.length })
            : null,
        ]
  return (
    <LessonStop>
      <LessonRow
        render={<StepLink step={step} />}
        // A lesson's tile its number, the same as its line's; a check's square its kind's picture.
        mark={
          next || number === undefined ? <Icon className="size-5" strokeWidth={1.75} /> : number
        }
        square={step.kind !== 'lesson'}
        done={done}
        share={share}
        current={next}
        title={title}
        detail={detail.filter(Boolean).join(' · ')}
      />
    </LessonStop>
  )
}

/** A chapter as a group of the library: its name and how much is learned over one card of rows. */
function ChapterGroup({
  chapter,
  n,
  numbers,
  next,
}: {
  chapter: Chapter
  n: number
  numbers: ReadonlyMap<StepId, number>
  next: StepId | undefined
}) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const id = useId()
  const learned = useProgress(selectLearned)
  const ids = chapter.steps.map(stepIdOf)
  const done = ids.filter((each) => learned[each] !== undefined).length
  const title = localText(chapter.title, locale)
  return (
    <section aria-labelledby={id} className="flex flex-col gap-2">
      <h3 className="flex items-baseline gap-2 px-3 font-sans text-sm font-semibold text-muted-foreground">
        <span id={id} className="sr-only">
          {t('journey.chapter', { n, title })}
        </span>
        <span aria-hidden className="min-w-0 flex-1">
          {n} · {title}
        </span>
        <span className="shrink-0 font-normal tabular-nums">
          {t('journey.count', { learned: done, total: ids.length })}
        </span>
      </h3>
      <LessonLine>
        {chapter.steps.map((step) => {
          const stepId = stepIdOf(step)
          return (
            <StepRow
              key={stepId}
              step={step}
              number={numbers.get(stepId)}
              numbers={numbers}
              next={stepId === next}
            />
          )
        })}
      </LessonLine>
    </section>
  )
}

/**
 * A level's page's body (canvas 163): its stage and how much of it is learned over a meter, its goal,
 * then its chapters, each a line of its steps. Its name is the page's title, in the bar. Every step
 * opens; the order only suggests.
 */
export function LevelLessons({ journey }: { journey: Journey }) {
  const { t } = useTranslation(['learn', 'common'])
  const locale = useLocale()
  const learned = useProgress(selectLearned)
  const next = continueStep(learned)?.id
  const progress = journeyProgress(journey, learned)
  const numbers = new Map(
    journey.chapters
      .flatMap((chapter) => chapter.steps)
      .filter((step) => step.kind === 'lesson')
      .map((step, i): [StepId, number] => [stepIdOf(step), i + 1]),
  )
  const counts = { learned: progress.done, total: progress.total }
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 px-1">
        <ProgressMeter
          done={progress.done}
          total={progress.total}
          count={`${t(`common:stage.${journey.stage}`)} · ${t('learn:progress', counts)}`}
          said={t('learn:progress', counts)}
          above
        />
        <p className="max-w-prose text-pretty text-muted-foreground">
          {localText(journey.goal, locale)}
        </p>
      </div>
      {journey.chapters.map((chapter, i) => (
        <ChapterGroup key={chapter.id} chapter={chapter} n={i + 1} numbers={numbers} next={next} />
      ))}
    </div>
  )
}
