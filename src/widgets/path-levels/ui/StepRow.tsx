import { Link } from '@tanstack/react-router'
import {
  ChartNoAxesColumnIncreasing,
  KeyboardMusic,
  ListMusic,
  Music,
  Repeat2,
  type LucideIcon,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ExplorerLink,
  skillsOfStep,
  useStepTitle,
  type PlacedStep,
  type StepKind,
} from '@/entities/path'
import { knownCount, type ProgressState } from '@/entities/progress'
import { LearnedToggle } from '@/features/mark-learned'
import { cn } from '@/shared/lib'

const ICON: Readonly<Record<StepKind, LucideIcon>> = {
  chords: KeyboardMusic,
  scale: ChartNoAxesColumnIncreasing,
  study: Repeat2,
  song: Music,
  progression: ListMusic,
}
const TILE: Readonly<Record<StepKind, string>> = {
  chords: 'bg-primary text-primary-foreground',
  scale: 'bg-primary text-primary-foreground',
  study: 'bg-muted text-primary',
  song: 'bg-muted text-primary',
  progression: 'bg-muted text-primary',
}
const ROW_LINK =
  'flex min-h-16 min-w-0 flex-1 items-center gap-4 rounded-2xl transition-colors duration-200 ease-out outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring'

/** A step on the Path: what it is, how far along it is, and its learned toggle. A piece opens its Piece screen. */
export function StepRow({
  placed,
  answers,
}: {
  placed: PlacedStep
  answers: ProgressState['answers']
}) {
  const { t } = useTranslation('path')
  const title = useStepTitle()(placed.step)
  const { step } = placed
  const Icon = ICON[title.kind]
  const skills = skillsOfStep(step)
  const subtitle = [
    t(`kind.${title.kind}`),
    step.kind === 'chords'
      ? t('known', { known: knownCount(skills, answers), total: skills.length })
      : null,
    title.secondary ?? null,
  ]
    .filter(Boolean)
    .join(' · ')
  const body: ReactNode = (
    <>
      <span
        className={cn('grid size-12 shrink-0 place-items-center rounded-2xl', TILE[title.kind])}
      >
        <Icon aria-hidden className="size-5" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-lg font-semibold">{title.primary}</span>
        <span className="block truncate text-sm text-muted-foreground">{subtitle}</span>
      </span>
    </>
  )
  return (
    <li className="flex items-center gap-2">
      {step.kind === 'piece' ? (
        <Link to="/songs/$pieceId" params={{ pieceId: step.pieceId }} className={ROW_LINK}>
          {body}
        </Link>
      ) : (
        <ExplorerLink step={step} className={ROW_LINK}>
          {body}
        </ExplorerLink>
      )}
      <LearnedToggle step={placed.id} title={title.primary} />
    </li>
  )
}
