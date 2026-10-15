import {
  BookOpenText,
  ChartNoAxesColumnIncreasing,
  Check,
  KeyboardMusic,
  Music,
  Repeat2,
  type LucideIcon,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  skillsOfStep,
  STEP_PAINT,
  StepLink,
  useStepTitle,
  type Step,
  type StepKind,
} from '@/entities/course'
import { pieceById, PieceLink } from '@/entities/piece'
import { knownCount, type ProgressState } from '@/entities/progress'
import { cn } from '@/shared/lib'
import { PAINT } from '@/shared/ui'
import type { NodePlace } from '../model/node-place'

const ICON: Readonly<Record<StepKind, LucideIcon>> = {
  lesson: BookOpenText,
  chords: KeyboardMusic,
  scale: ChartNoAxesColumnIncreasing,
  study: Repeat2,
  song: Music,
}

const ROW =
  'group flex min-h-18 min-w-0 flex-1 items-center gap-4 rounded-2xl py-2 pr-2 transition-colors duration-200 ease-out hover:bg-muted/60'

/**
 * A step on its course's line: its node (its kind's paint and icon, or its number where the steps are
 * a course's lessons; grass with a check once learned; ringed in honey and larger where Continue
 * leads), then its name and what it is. The node is the step's state; the step's own page marks it
 * learned.
 */
export function StepNode({
  step,
  numeral,
  answers,
  learned,
  next,
  place,
}: {
  step: Step
  numeral?: number | undefined
  answers: ProgressState['answers']
  learned: boolean
  next: boolean
  place: NodePlace
}) {
  const { t } = useTranslation(['learn', 'common'])
  const title = useStepTitle()(step)
  const skills = skillsOfStep(step)
  const Icon = learned ? Check : ICON[title.kind]
  const subtitle = [
    step.kind === 'lesson' ? null : t(`learn:kind.${title.kind}`),
    step.kind === 'chords'
      ? t('learn:known', { known: knownCount(skills, answers), total: skills.length })
      : null,
    // A lesson's place is its numeral on the course's own line.
    step.kind === 'lesson' ? null : (title.secondary ?? null),
  ]
    .filter(Boolean)
    .join(' · ')
  const body: ReactNode = (
    <>
      <span className="relative grid w-14 shrink-0 place-items-center self-stretch">
        {/* The course's line, through the node: drawn behind it, broken at its ends. */}
        <span
          aria-hidden
          className={cn(
            'absolute left-1/2 w-0.5 -translate-x-1/2 bg-border',
            place === 'first' && 'top-1/2 -bottom-2',
            place === 'between' && '-top-2 -bottom-2',
            place === 'last' && '-top-2 bottom-1/2',
            place === 'alone' && 'hidden',
          )}
        />
        <span
          className={cn(
            'relative grid place-items-center rounded-full border-2 border-background transition-transform duration-200 ease-out group-hover:scale-105',
            next
              ? 'size-14 shadow-[0_2px_8px_-2px_var(--color-primary)] ring-4 ring-primary'
              : 'size-11',
            learned
              ? 'bg-learned text-learned-foreground'
              : cn(PAINT[STEP_PAINT[title.kind]].fill, PAINT[STEP_PAINT[title.kind]].ink),
          )}
        >
          {numeral !== undefined && !learned ? (
            <span aria-hidden className="font-display text-lg font-semibold tabular-nums">
              {numeral}
            </span>
          ) : (
            <Icon
              aria-hidden
              className={next ? 'size-6' : 'size-5'}
              strokeWidth={learned ? 3 : 2}
            />
          )}
        </span>
      </span>
      <span className="min-w-0">
        <span
          className={cn(
            'line-clamp-2 block font-semibold text-balance',
            next ? 'font-display text-xl' : 'text-lg',
          )}
        >
          {title.primary}
        </span>
        {learned || subtitle ? (
          <span className="block truncate text-sm text-muted-foreground">
            {[learned ? t('common:learned.done') : null, subtitle || null]
              .filter(Boolean)
              .join(' · ')}
          </span>
        ) : null}
      </span>
    </>
  )
  const piece = step.kind === 'piece' ? pieceById(step.pieceId) : undefined
  return (
    <li aria-current={next ? 'step' : undefined} className="flex">
      {step.kind !== 'piece' ? (
        <StepLink step={step} className={ROW}>
          {body}
        </StepLink>
      ) : piece ? (
        <PieceLink entry={piece} className={ROW}>
          {body}
        </PieceLink>
      ) : (
        // A step naming a piece that is not there (the curriculum's test forbids it) leads nowhere.
        <span className={ROW}>{body}</span>
      )}
    </li>
  )
}
