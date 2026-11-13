import { BookOpenText, ChartNoAxesColumnIncreasing, KeyboardMusic } from 'lucide-react'
import { useId, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  allJourneys,
  lessonById,
  type Chapter,
  type Journey,
  type JourneyStep,
} from '@/entities/lesson'
import {
  knownCount,
  selectAllAnswers,
  selectLearned,
  selectRead,
  useProgress,
} from '@/entities/progress'
import {
  lessonStepId,
  skillsOfStep,
  STAGE_PAINT,
  StepLink,
  stepIdOf,
  type StepId,
} from '@/entities/step'
import { localText, useLocale } from '@/shared/i18n'
import { useSetSearch } from '@/shared/lib'
import { ChoiceChips, PAINT } from '@/shared/ui'
import { continueStep } from '../model/continue-step'
import { OWN_LESSONS, type LearnView } from '../model/learn-view'
import { journeyProgress, lessonShare } from '../model/progress'
import { useStepTitle } from '../model/use-step-title'
import { LessonLine, LessonRow, LessonStop } from './LessonRow'
import { OwnLessons } from './OwnLessons'

const ICON = {
  lesson: BookOpenText,
  chords: KeyboardMusic,
  scale: ChartNoAxesColumnIncreasing,
} as const

/**
 * A step of a chapter as a library's row: its tile in its journey's paint (a lesson's number, a
 * check's picture; grass with a check once learned, an arc round it as a lesson is read, ringed in honey where Continue leads), its title and
 * one detail line (a lesson's number and the lessons to read first; a check's kind and how much of it
 * is known), Next where Continue leads, a chevron. The whole row opens it.
 */
function StepRow({
  step,
  journey,
  number,
  numbers,
  next,
}: {
  step: JourneyStep
  journey: Journey
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
  const paint = PAINT[STAGE_PAINT[journey.stage]]
  const Icon = ICON[step.kind]
  const after = (lesson?.after ?? []).flatMap((each) => {
    const n = numbers.get(lessonStepId(each))
    return n === undefined ? [] : [n]
  })
  const skills = skillsOfStep(step)
  const detail =
    step.kind === 'lesson'
      ? [
          number === undefined ? null : t('lessonNumber', { n: number }),
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
        paint={paint}
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
  journey,
  numbers,
  next,
}: {
  chapter: Chapter
  n: number
  journey: Journey
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
              journey={journey}
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

/** A level's name, its goal, how far along the learner is, and its chapters as groups of rows. */
function LevelLessons({ journey }: { journey: Journey }) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const learned = useProgress(selectLearned)
  const next = continueStep(learned)?.id
  const headingId = useId()
  const progress = journeyProgress(journey, learned)
  const numbers = new Map(
    journey.chapters
      .flatMap((chapter) => chapter.steps)
      .filter((step) => step.kind === 'lesson')
      .map((step, i): [StepId, number] => [stepIdOf(step), i + 1]),
  )
  return (
    <>
      <section aria-labelledby={headingId} className="flex flex-col gap-1 px-3">
        <h2 id={headingId} className="text-2xl font-semibold text-balance">
          {localText(journey.title, locale)}
        </h2>
        <p className="text-pretty text-muted-foreground">{localText(journey.goal, locale)}</p>
        <p className="text-sm text-muted-foreground tabular-nums">
          {t('journey.steps', { learned: progress.done, total: progress.total })}
        </p>
      </section>
      {journey.chapters.map((chapter, i) => (
        <ChapterGroup
          key={chapter.id}
          chapter={chapter}
          n={i + 1}
          journey={journey}
          numbers={numbers}
          next={next}
        />
      ))}
    </>
  )
}

/**
 * The Lessons as a library (ADR 0053, amended): the four levels as chips, then Your lessons (R30-5);
 * under them the level's name, what it makes of the learner and how far along they are, then its
 * chapters as groups of rows, each step a row that opens it; or the learner's own lessons. Every
 * step opens; the order only suggests.
 */
export function JourneyLibrary({
  journey,
  lead,
}: {
  journey: Journey | typeof OWN_LESSONS
  /** What comes after the chips and before the level (Continue, on a phone). */
  lead?: ReactNode
}) {
  const { t } = useTranslation(['learn', 'common'])
  const setSearch = useSetSearch<LearnView>()
  return (
    <div className="flex flex-col gap-6">
      {/* A laptop chooses the level from its list (LearnNav). */}
      <div className="lg:hidden">
        <ChoiceChips
          label={t('learn:journey.label')}
          value={journey === OWN_LESSONS ? OWN_LESSONS : journey.id}
          scroll
          options={[
            ...allJourneys().map((each) => ({
              value: each.id,
              label: t(`common:stage.${each.stage}`),
            })),
            { value: OWN_LESSONS, label: t('learn:own.lessons') },
          ]}
          onChange={(id) => setSearch({ view: 'lessons', journey: id })}
        />
      </div>
      {lead}
      {journey === OWN_LESSONS ? <OwnLessons /> : <LevelLessons journey={journey} />}
    </div>
  )
}
