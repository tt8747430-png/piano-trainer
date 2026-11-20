import { KeyboardMusic } from 'lucide-react'
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
import { ButtonLink, ProgressMeter, ScaleIcon } from '@/shared/ui'
import { continueStep } from '../model/continue-step'
import { journeyProgress, lessonShare } from '../model/progress'
import { afterWorthSaying } from '../model/after'
import { useStepTitle } from '../model/use-step-title'
import { LessonLine, LessonRow, LessonStop } from './LessonRow'

const ICON = {
  chords: KeyboardMusic,
  scale: ScaleIcon,
} as const

/** Where a step stands on the level's spine: whether the learner has come to it, passed it, and its ends. */
type Place = { reached: boolean; passed: boolean; first: boolean; last: boolean }

/**
 * A step of a chapter as a timeline's row (the canvas's PATHROW): a lesson's tile its soft dot until
 * learned, its book ringed in honey where Continue leads, a check's square its kind's picture; its
 * title and one detail line (a lesson's number and the lessons to read first; a check's kind and how
 * much of it is known), Next where Continue leads. The whole row opens it.
 */
function StepRow({
  step,
  number,
  numbers,
  next,
  place,
}: {
  step: JourneyStep
  number: number | undefined
  numbers: ReadonlyMap<StepId, number>
  next: boolean
  place: Place
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
  const asked = (lesson?.after ?? []).flatMap((each) => {
    const n = numbers.get(lessonStepId(each))
    return n === undefined ? [] : [n]
  })
  const after = number === undefined ? asked : afterWorthSaying(asked, number)
  const skills = skillsOfStep(step)
  const detail =
    step.kind === 'lesson'
      ? [
          number === undefined ? null : t('lessonNumber', { n: number }),
          after.length > 0 ? t('after', { lessons: after.join(', ') }) : null,
        ]
      : [
          t(`kind.${step.kind}`),
          skills.length === 1
            ? t(knownCount(skills, answers) === 1 ? 'knownOne' : 'notKnownYet')
            : skills.length > 0
              ? t('known', { known: knownCount(skills, answers), total: skills.length })
              : null,
        ]
  const Icon = step.kind === 'lesson' ? null : ICON[step.kind]
  return (
    <LessonStop {...place}>
      <LessonRow
        render={<StepLink step={step} />}
        mark={Icon ? <Icon strokeWidth={1.75} /> : undefined}
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

/**
 * A chapter: its number and name in the soft 14 over its line, how much of it is learned beside it
 * ("3 of 3"; at the row's end on a phone, beside the name on a laptop), its rows tucked 2 into its 28 band.
 */
function ChapterGroup({
  chapter,
  n,
  numbers,
  next,
  placeOf,
}: {
  chapter: Chapter
  n: number
  numbers: ReadonlyMap<StepId, number>
  next: StepId | undefined
  placeOf: (step: StepId) => Place
}) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const id = useId()
  const learned = useProgress(selectLearned)
  const ids = chapter.steps.map(stepIdOf)
  const done = ids.filter((each) => learned[each] !== undefined).length
  const title = localText(chapter.title, locale)
  return (
    <section aria-labelledby={id} className="flex flex-col gap-0.5">
      <h3 className="-mb-1 flex min-h-7 items-center justify-between gap-3 font-sans text-sm font-semibold text-muted-foreground lg:justify-start">
        <span id={id} className="sr-only">
          {t('journey.chapter', { n, title })}
        </span>
        <span aria-hidden className="min-w-0">
          {n} · {title}
        </span>
        <span className="shrink-0 text-[0.8125rem] font-normal tabular-nums">
          {t('journey.of', { learned: done, total: ids.length })}
        </span>
      </h3>
      <LessonLine across={3}>
        {chapter.steps.map((step) => {
          const stepId = stepIdOf(step)
          return (
            <StepRow
              key={stepId}
              step={step}
              number={numbers.get(stepId)}
              numbers={numbers}
              next={stepId === next}
              place={placeOf(stepId)}
            />
          )
        })}
      </LessonLine>
    </section>
  )
}

/**
 * A level's page's body (the LearnLevel boards' LVHEAD and PATHF): what it teaches in a line of
 * reading (65ch at most), its stage and how much is learned over the 6 meter, then the one honey act,
 * Start, Continue or Review and the lesson it opens; then its chapters 32 apart (40 on a laptop), each a line of its
 * steps. Its name is the serif heading above it. Every step opens; the order only suggests.
 */
export function LevelLessons({ journey }: { journey: Journey }) {
  const { t } = useTranslation(['learn', 'common'])
  const locale = useLocale()
  const learned = useProgress(selectLearned)
  const stepTitle = useStepTitle()
  const next = continueStep(learned)?.id
  const progress = journeyProgress(journey, learned)
  const steps = journey.chapters.flatMap((chapter) => chapter.steps)
  const numbers = new Map(
    steps
      .filter((step) => step.kind === 'lesson')
      .map((step, i): [StepId, number] => [stepIdOf(step), i + 1]),
  )
  const order = steps.map(stepIdOf)
  const isDone = (id: StepId) => learned[id] !== undefined
  const go = steps.find((step) => !isDone(stepIdOf(step))) ?? steps[0]
  const goWord =
    progress.done === 0 ? 'start' : progress.done === progress.total ? 'review' : 'continue'
  const placeOf = (id: StepId): Place => {
    const at = order.indexOf(id)
    return {
      reached: isDone(id) || id === next,
      passed: isDone(id),
      first: at === 0,
      last: at === order.length - 1,
    }
  }
  const counts = { learned: progress.done, total: progress.total }
  return (
    <div className="flex flex-col gap-8 lg:gap-10">
      <div className="flex w-full flex-col gap-2 lg:max-w-160">
        <p className="mb-1 max-w-[65ch] text-base/normal text-pretty text-muted-foreground">
          {localText(journey.goal, locale)}
        </p>
        <ProgressMeter
          done={progress.done}
          total={progress.total}
          count={`${t(`common:stage.${journey.stage}`)} · ${t('learn:progress', counts)}`}
          said={t('learn:progress', counts)}
          above
          className="text-sm/[normal] tabular-nums"
        />
        {go ? (
          <ButtonLink size="lg" className="mt-1 w-full" render={<StepLink step={go} />}>
            {t(`learn:journey.${goWord}`, { title: stepTitle(go).primary })}
          </ButtonLink>
        ) : null}
      </div>
      <div className="flex flex-col gap-8 lg:gap-10">
        {journey.chapters.map((chapter, i) => (
          <ChapterGroup
            key={chapter.id}
            chapter={chapter}
            n={i + 1}
            numbers={numbers}
            next={next}
            placeOf={placeOf}
          />
        ))}
      </div>
    </div>
  )
}
