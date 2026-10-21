import { BookOpenText, ChartNoAxesColumnIncreasing, Check, KeyboardMusic } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { JourneyStep } from '@/entities/lesson'
import { type ProgressState, knownCount } from '@/entities/progress'
import { skillsOfStep, STAGE_PAINT, StepLink, type Stage } from '@/entities/step'
import { cn } from '@/shared/lib'
import { PAINT } from '@/shared/ui'
import { useStepTitle } from '../model/use-step-title'

const ICON = {
  lesson: BookOpenText,
  chords: KeyboardMusic,
  scale: ChartNoAxesColumnIncreasing,
} as const

/**
 * A node of a journey's chapter, as the journey-app draws one: a round button in its stage's paint
 * (grass with a check once learned, ringed in honey and larger where Continue leads), its name under
 * it and, for a chapter's check, what it asks. The whole node opens the lesson, or the check's page.
 */
export function JourneyNode({
  step,
  stage,
  number,
  learned,
  next,
  answers,
}: {
  step: JourneyStep
  stage: Stage
  /** A lesson's number along its journey. */
  number?: number
  learned: boolean
  next: boolean
  answers: ProgressState['answers']
}) {
  const { t } = useTranslation('learn')
  const title = useStepTitle()(step)
  const paint = PAINT[STAGE_PAINT[stage]]
  const Icon = learned ? Check : ICON[step.kind]
  const skills = skillsOfStep(step)
  const detail =
    step.kind === 'lesson'
      ? number === undefined
        ? null
        : t('lessonNumber', { n: number })
      : [
          t(`kind.${step.kind}`),
          step.kind === 'chords'
            ? t('known', { known: knownCount(skills, answers), total: skills.length })
            : null,
        ]
          .filter(Boolean)
          .join(' · ')
  return (
    <StepLink
      step={step}
      aria-current={next ? 'step' : undefined}
      className="group relative z-10 flex w-36 flex-col items-center gap-2 rounded-3xl p-2 text-center outline-offset-4 sm:w-44"
    >
      <span
        className={cn(
          'grid place-items-center rounded-full border-4 border-background transition-transform duration-200 ease-out group-hover:scale-105 group-active:scale-95',
          next
            ? 'size-20 shadow-[0_4px_16px_-4px_var(--color-primary)] ring-4 ring-primary'
            : 'size-16',
          learned ? 'bg-learned text-learned-foreground' : cn(paint.fill, paint.ink),
          step.kind !== 'lesson' && !learned && 'rounded-3xl',
        )}
      >
        <Icon aria-hidden className={next ? 'size-8' : 'size-7'} strokeWidth={learned ? 3 : 1.75} />
      </span>
      <span
        className={cn(
          'text-sm leading-snug font-semibold text-balance',
          next && 'font-display text-base',
        )}
      >
        {title.primary}
      </span>
      {detail ? (
        <span className="-mt-1 text-xs text-muted-foreground tabular-nums">{detail}</span>
      ) : null}
      {/* The check says it to the eye alone. */}
      {learned ? <span className="sr-only">, {t('learned')}</span> : null}
    </StepLink>
  )
}
