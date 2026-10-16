import { Link } from '@tanstack/react-router'
import { Check, ChevronDown } from 'lucide-react'
import { Fragment, useId } from 'react'
import { useTranslation } from 'react-i18next'
import { JOURNEYS, type Chapter, type Journey } from '@/entities/lesson'
import { selectAllAnswers, selectLearned, useProgress } from '@/entities/progress'
import { stepIdOf, type StepId } from '@/entities/step'
import { useFold } from '@/features/fold-section'
import { localText, useLocale } from '@/shared/i18n'
import { cn, IN_PLACE } from '@/shared/lib'
import { FoldBody } from '@/shared/ui'
import { continueStep } from '../model/continue-step'
import { journeyProgress } from '../model/progress'
import { centreOf, columnOf } from '../model/zigzag'
import { JourneyNode } from './JourneyNode'
import { LearnedBar } from './LearnedMeter'

/** The dashed path from one node down to the next, across the map's three columns. */
function Path({ from, to }: { from: 0 | 1 | 2; to: 0 | 1 | 2 }) {
  const x1 = centreOf(from)
  const x2 = centreOf(to)
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      className="-my-1 block h-8 w-full text-border"
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

/**
 * The four journeys side by side, the one shown a card-paper tab on the sand track (the neutral
 * chosen), each with how much of it is learned; scrolled across where the screen is narrow.
 */
function JourneyTabs({ shown }: { shown: Journey }) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const learned = useProgress(selectLearned)
  return (
    <nav
      aria-label={t('journey.label')}
      className="-mx-gutter overflow-x-auto px-gutter scrollbar-none"
    >
      <ul className="flex min-w-max gap-1 rounded-2xl bg-muted p-1 sm:min-w-0">
        {JOURNEYS.map((journey) => {
          const progress = journeyProgress(journey, learned)
          const current = journey.id === shown.id
          return (
            <li key={journey.id} className="flex-1">
              <Link
                to="/"
                search={{ view: 'lessons', journey: journey.id }}
                {...IN_PLACE}
                aria-current={current ? 'page' : undefined}
                className={cn(
                  'flex min-w-28 flex-col gap-1.5 rounded-xl border px-3 py-2 transition-colors duration-200 ease-out',
                  current
                    ? 'border-input bg-card text-foreground'
                    : 'border-transparent text-muted-foreground hover:bg-background/60 hover:text-foreground',
                )}
              >
                <span className="flex items-baseline gap-2">
                  <span className="font-semibold">{localText(journey.title, locale)}</span>
                  <span className="text-xs tabular-nums">
                    {t('journey.count', { learned: progress.done, total: progress.total })}
                  </span>
                </span>
                <LearnedBar progress={progress} />
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

/**
 * A chapter: its heading the button that folds it (its number, or a check once it is all learned;
 * its title; how much is learned; a chevron), its nodes in a zigzag. Folded or open as the learner
 * left it, on every visit.
 */
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
  const bodyId = useId()
  const fold = useFold(`journey.${journey.id}.${chapter.id}`)
  const learned = useProgress(selectLearned)
  const answers = useProgress(selectAllAnswers)
  const ids = chapter.steps.map(stepIdOf)
  const done = ids.filter((each) => learned[each] !== undefined).length
  const complete = done === ids.length
  const title = localText(chapter.title, locale)
  return (
    <section aria-label={t('journey.chapter', { n, title })} className="flex flex-col">
      <h3 className="font-sans text-base">
        <button
          type="button"
          aria-expanded={fold.open}
          aria-controls={bodyId}
          aria-label={t('journey.chapter', { n, title })}
          onClick={fold.toggle}
          className="group flex w-full items-center gap-3 rounded-2xl py-2 text-left"
        >
          <span
            aria-hidden
            className={cn(
              'grid size-9 shrink-0 place-items-center rounded-full font-semibold tabular-nums',
              complete ? 'bg-learned text-learned-foreground' : 'bg-muted text-foreground',
            )}
          >
            {complete ? <Check className="size-4" strokeWidth={3} /> : n}
          </span>
          <span className="min-w-0 flex-1 font-display text-xl font-semibold text-balance">
            {title}
          </span>
          <span className="shrink-0 text-sm text-muted-foreground tabular-nums">
            {t('journey.count', { learned: done, total: ids.length })}
          </span>
          <ChevronDown
            aria-hidden
            className={cn(
              'size-5 shrink-0 text-muted-foreground transition-transform duration-200 ease-out group-hover:text-foreground',
              !fold.open && '-rotate-90',
            )}
          />
        </button>
      </h3>
      <FoldBody id={bodyId} open={fold.open}>
        <ol className="flex flex-col pt-4 pb-2">
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
      </FoldBody>
    </section>
  )
}

/**
 * The Lessons (ADR 0053), as the journey-app lays them out: the four journeys as tabs, then the one
 * shown, its chapters each folding under its heading, a zigzag of nodes joined by a dashed path.
 * Every node opens; the order only suggests.
 */
export function JourneyMap({ journey }: { journey: Journey }) {
  const learned = useProgress(selectLearned)
  const locale = useLocale()
  const next = continueStep(learned)?.id
  const numbers = new Map(
    journey.chapters
      .flatMap((chapter) => chapter.steps)
      .filter((step) => step.kind === 'lesson')
      .map((step, i): [StepId, number] => [stepIdOf(step), i + 1]),
  )
  return (
    <div className="flex flex-col gap-6">
      <JourneyTabs shown={journey} />
      <h2 className="sr-only">{localText(journey.title, locale)}</h2>
      <div className="flex flex-col divide-y divide-border">
        {journey.chapters.map((chapter, i) => (
          <div key={chapter.id} className="py-2">
            <ChapterSection
              chapter={chapter}
              n={i + 1}
              journey={journey}
              numbers={numbers}
              next={next}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
