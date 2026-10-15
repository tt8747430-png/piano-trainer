import { Link } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Fragment, useId } from 'react'
import { useTranslation } from 'react-i18next'
import { nextJourney, previousJourney, type Chapter, type Journey } from '@/entities/lesson'
import { selectAllAnswers, selectLearned, useProgress } from '@/entities/progress'
import { STAGE_PAINT, stepIdOf, type StepId } from '@/entities/step'
import { localText, useLocale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { PAINT, RoundLink } from '@/shared/ui'
import { continueStep } from '../model/continue-step'
import { journeyProgress } from '../model/progress'
import { centreOf, columnOf } from '../model/zigzag'
import { JourneyNode } from './JourneyNode'

/** The dashed path from one node down to the next, across the map's three columns. */
function Path({ from, to }: { from: 0 | 1 | 2; to: 0 | 1 | 2 }) {
  const x1 = centreOf(from)
  const x2 = centreOf(to)
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      className="-my-1 block h-14 w-full text-border"
    >
      <path
        d={`M ${x1} 0 C ${x1} 22, ${x2} 18, ${x2} 40`}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeDasharray="2 9"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

/** A chapter: its number and title on its stage's bar, how much of it is learned, its nodes in a zigzag. */
function ChapterSection({
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
  const answers = useProgress(selectAllAnswers)
  const ids = chapter.steps.map(stepIdOf)
  const done = ids.filter((each) => learned[each] !== undefined).length
  const paint = PAINT[STAGE_PAINT[journey.stage]]
  return (
    <section aria-labelledby={id} className="flex flex-col gap-6">
      <div
        className={cn(
          'flex items-baseline justify-between gap-4 border-l-4 border-current pl-4',
          paint.ink,
        )}
      >
        <h3 id={id} className="text-2xl text-balance text-foreground">
          {t('journey.chapter', { n, title: localText(chapter.title, locale) })}
        </h3>
        <span className="shrink-0 text-sm text-muted-foreground tabular-nums">
          {t('journey.chapterLearned', { learned: done, total: ids.length })}
        </span>
      </div>
      <ol className="flex flex-col">
        {chapter.steps.map((step, i) => {
          const stepId = stepIdOf(step)
          const column = columnOf(i)
          const before = i === 0 ? undefined : columnOf(i - 1)
          return (
            <Fragment key={stepId}>
              {before === undefined ? null : (
                <li aria-hidden className="list-none">
                  <Path from={before} to={column} />
                </li>
              )}
              <li className="grid grid-cols-3">
                <div
                  className={cn(
                    'flex justify-center',
                    column === 0 && 'col-start-1',
                    column === 1 && 'col-start-2',
                    column === 2 && 'col-start-3',
                  )}
                >
                  <JourneyNode
                    step={step}
                    stage={journey.stage}
                    number={numbers.get(stepId)}
                    learned={learned[stepId] !== undefined}
                    next={stepId === next}
                    answers={answers}
                  />
                </div>
              </li>
            </Fragment>
          )
        })}
      </ol>
    </section>
  )
}

/**
 * The Lessons (ADR 0053), as the journey-app lays them out: one journey at a time, its name between
 * arrows to the journeys before and after it, how much of it is learned and what it is for, then its
 * chapters, each a zigzag of nodes joined by a dashed path. Every node opens; the order only suggests.
 */
export function JourneyMap({ journey }: { journey: Journey }) {
  const { t } = useTranslation(['learn', 'common'])
  const locale = useLocale()
  const learned = useProgress(selectLearned)
  const progress = journeyProgress(journey, learned)
  const next = continueStep(learned)?.id
  const before = previousJourney(journey)
  const after = nextJourney(journey)
  const numbers = new Map(
    journey.chapters
      .flatMap((chapter) => chapter.steps)
      .filter((step) => step.kind === 'lesson')
      .map((step, i): [StepId, number] => [stepIdOf(step), i + 1]),
  )
  const arrow = (to: Journey | undefined, label: string, icon: typeof ArrowLeft) =>
    to ? (
      <RoundLink
        label={`${label}: ${localText(to.title, locale)}`}
        icon={icon}
        render={<Link to="/" search={{ view: 'lessons', journey: to.id }} replace />}
      />
    ) : (
      <span aria-hidden className="size-11" />
    )
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          {arrow(before, t('learn:journey.previous'), ArrowLeft)}
          <div className="flex min-w-0 flex-col items-center text-center">
            <span className="text-sm font-medium text-muted-foreground">
              {t('learn:journey.stage', { stage: t(`common:stage.${journey.stage}`) })}
            </span>
            <h2 className="text-4xl text-balance">{localText(journey.title, locale)}</h2>
            <span className="text-muted-foreground tabular-nums">
              {t('learn:journey.learned', { learned: progress.done, total: progress.total })}
            </span>
          </div>
          {arrow(after, t('learn:journey.next'), ArrowRight)}
        </div>
        <p className="mx-auto max-w-prose text-center text-lg text-pretty">
          {localText(journey.goal, locale)}
        </p>
      </div>
      {journey.chapters.map((chapter, i) => (
        <ChapterSection
          key={chapter.id}
          chapter={chapter}
          n={i + 1}
          journey={journey}
          numbers={numbers}
          next={next}
        />
      ))}
    </div>
  )
}
