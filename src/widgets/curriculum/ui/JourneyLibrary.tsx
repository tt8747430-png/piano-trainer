import { useNavigate } from '@tanstack/react-router'
import {
  BookOpenText,
  ChartNoAxesColumnIncreasing,
  Check,
  ChevronRight,
  KeyboardMusic,
} from 'lucide-react'
import { useId } from 'react'
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
import { cn, IN_PLACE } from '@/shared/lib'
import { Dropdown, PAINT, ProgressRing } from '@/shared/ui'
import { continueStep } from '../model/continue-step'
import { journeyProgress, lessonShare } from '../model/progress'
import { useStepTitle } from '../model/use-step-title'

const ICON = {
  lesson: BookOpenText,
  chords: KeyboardMusic,
  scale: ChartNoAxesColumnIncreasing,
} as const

/**
 * A step of a chapter as a library's row: its tile in its journey's paint (grass with a check once
 * learned, an arc round it as a lesson is read, ringed in honey where Continue leads), its title and
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
          step.kind === 'chords'
            ? t('known', { known: knownCount(skills, answers), total: skills.length })
            : null,
        ]
  return (
    <li>
      <StepLink
        step={step}
        aria-current={next ? 'step' : undefined}
        className="group flex min-h-16 items-center gap-4 px-3 py-2 transition-colors duration-200 ease-out hover:bg-muted focus-visible:-outline-offset-3"
      >
        <ProgressRing share={done || next ? 0 : share} className={paint.ink}>
          <span
            aria-hidden
            className={cn(
              'grid size-10 shrink-0 place-items-center',
              step.kind === 'lesson' ? 'rounded-full' : 'rounded-xl',
              done ? 'bg-learned text-learned-foreground' : cn(paint.fill, paint.ink),
              next && 'ring-2 ring-primary ring-offset-2 ring-offset-card',
            )}
          >
            {done ? (
              <Check className="size-5" strokeWidth={3} />
            ) : (
              <Icon className="size-5" strokeWidth={1.75} />
            )}
          </span>
        </ProgressRing>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="font-semibold text-pretty">
            {title}
            {/* The check and the arc say it to the eye alone. */}
            {done ? <span className="sr-only">, {t('learned')}</span> : null}
            {!done && share > 0 ? (
              <span className="sr-only">, {t('read', { percent: Math.round(share * 100) })}</span>
            ) : null}
          </span>
          <span className="text-sm text-muted-foreground tabular-nums">
            {detail.filter(Boolean).join(' · ')}
          </span>
        </span>
        {next ? (
          <span className="shrink-0 rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
            {t('upNext')}
          </span>
        ) : null}
        <ChevronRight
          aria-hidden
          className="size-5 shrink-0 text-muted-foreground transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:text-foreground"
        />
      </StepLink>
    </li>
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
      <h3
        id={id}
        className="flex items-baseline gap-2 px-3 font-sans text-sm font-semibold text-muted-foreground"
      >
        <span className="sr-only">{t('journey.chapter', { n, title })}</span>
        <span aria-hidden className="min-w-0 flex-1">
          {n} · {title}
        </span>
        <span className="shrink-0 font-normal tabular-nums">
          {t('journey.count', { learned: done, total: ids.length })}
        </span>
      </h3>
      <ol className="flex flex-col divide-y divide-hairline overflow-hidden card">
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
      </ol>
    </section>
  )
}

/**
 * The Lessons as a library (ADR 0053, amended): the journey chosen from one pop-up button (each with
 * how many of its steps are learned), then its chapters as groups of rows, each step a row that
 * opens it. Every step opens; the order only suggests.
 */
export function JourneyLibrary({ journey }: { journey: Journey }) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const navigate = useNavigate()
  const learned = useProgress(selectLearned)
  const next = continueStep(learned)?.id
  const numbers = new Map(
    journey.chapters
      .flatMap((chapter) => chapter.steps)
      .filter((step) => step.kind === 'lesson')
      .map((step, i): [StepId, number] => [stepIdOf(step), i + 1]),
  )
  return (
    <div className="flex flex-col gap-6">
      <Dropdown
        label={t('journey.label')}
        value={journey.id}
        className="w-full sm:w-80"
        options={allJourneys().map((each) => {
          const progress = journeyProgress(each, learned)
          return {
            value: each.id,
            label: localText(each.title, locale),
            detail: t('journey.steps', { learned: progress.done, total: progress.total }),
          }
        })}
        onChange={(id) =>
          void navigate({ to: '/', search: { view: 'lessons', journey: id }, ...IN_PLACE })
        }
      />
      <h2 className="sr-only">{localText(journey.title, locale)}</h2>
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
    </div>
  )
}
