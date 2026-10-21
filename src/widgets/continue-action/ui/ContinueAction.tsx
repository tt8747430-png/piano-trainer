import { BookOpenText, Play } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PieceLink, pieceById } from '@/entities/piece'
import { selectLearned, useProgress } from '@/entities/progress'
import { StepLink } from '@/entities/step'
import { ButtonLink, FloatingActions } from '@/shared/ui'
import { continueStep, useStepTitle } from '@/widgets/curriculum'

/**
 * What to do next (ADR 0053), floating in the thumb's reach over Learn: one honey button saying
 * Continue over the step it opens: the next lesson of the journey or of the course last worked in,
 * read; its next guided song, on its page, where it is played and marked learned. It always says so in words, whatever the other floating
 * actions do: a picture alone would not say where it leads. Nothing floats once everything is learned.
 */
export function ContinueAction() {
  const { t } = useTranslation('learn')
  const learned = useProgress(selectLearned)
  const stepTitle = useStepTitle()
  const next = continueStep(learned)
  if (!next) return null
  const { step } = next
  const read = step.kind === 'lesson' || step.kind === 'course-lesson'
  const Icon = read ? BookOpenText : Play
  const title = stepTitle(step).primary
  const name = `${t('continue')}: ${title}`
  return (
    <FloatingActions>
      <ButtonLink
        aria-label={name}
        className="h-14 max-w-[min(20rem,calc(100vw-2*var(--gutter)))] gap-3 rounded-full pr-6 pl-2 elevation-2 transition-[scale,box-shadow,filter] duration-150 ease-out hover:elevation-3 active:scale-96 active:elevation-1"
        render={
          step.kind === 'piece' ? (
            <PieceLink entry={pieceById(step.pieceId) ?? { id: step.pieceId, kind: 'song' }} />
          ) : (
            <StepLink step={step} />
          )
        }
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-background/45">
          <Icon aria-hidden className="size-5" />
        </span>
        <span className="flex min-w-0 flex-col text-left leading-tight">
          <span className="text-xs font-medium">{t('continue')}</span>
          <span className="truncate font-display text-base">{title}</span>
        </span>
      </ButtonLink>
    </FloatingActions>
  )
}
