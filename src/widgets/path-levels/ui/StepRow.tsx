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
  STEP_PAINT,
  useStepTitle,
  type PlacedStep,
  type StepKind,
} from '@/entities/path'
import { pieceById, PieceLink } from '@/entities/piece'
import { knownCount, type ProgressState } from '@/entities/progress'
import { LearnedCheck } from '@/features/mark-learned'
import { cn } from '@/shared/lib'
import { PAINT } from '@/shared/ui'

const ICON: Readonly<Record<StepKind, LucideIcon>> = {
  chords: KeyboardMusic,
  scale: ChartNoAxesColumnIncreasing,
  study: Repeat2,
  song: Music,
  progression: ListMusic,
}
const ROW_LINK =
  'flex min-h-16 min-w-0 flex-1 items-center gap-4 rounded-2xl px-1 py-1.5 transition-colors duration-200 ease-out hover:bg-muted'

/** A step on the Path: what it is, how far along it is, and its learned toggle. A piece opens its page on its shelf. */
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
  const piece = step.kind === 'piece' ? pieceById(step.pieceId) : undefined
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
        className={cn(
          'grid size-12 shrink-0 place-items-center rounded-2xl',
          PAINT[STEP_PAINT[title.kind]].fill,
          PAINT[STEP_PAINT[title.kind]].ink,
        )}
      >
        <Icon aria-hidden className="size-5" />
      </span>
      <span className="min-w-0">
        <span className="line-clamp-2 block text-lg font-semibold">{title.primary}</span>
        <span className="block truncate text-sm text-muted-foreground">{subtitle}</span>
      </span>
    </>
  )
  return (
    <li className="flex items-center gap-2">
      {step.kind !== 'piece' ? (
        <ExplorerLink step={step} className={ROW_LINK}>
          {body}
        </ExplorerLink>
      ) : piece ? (
        <PieceLink entry={piece} className={ROW_LINK}>
          {body}
        </PieceLink>
      ) : (
        // A step naming a piece that is not there (the path's content test forbids it) leads nowhere.
        <span className={ROW_LINK}>{body}</span>
      )}
      <LearnedCheck step={placed.id} title={title.primary} />
    </li>
  )
}
