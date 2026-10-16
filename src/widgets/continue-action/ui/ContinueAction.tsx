import { Link } from '@tanstack/react-router'
import { BookOpenText, Play } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { selectLearned, useProgress } from '@/entities/progress'
import { StepLink } from '@/entities/step'
import { OPEN_PLAINLY } from '@/shared/lib'
import { ButtonLink, FloatingActions, useFloatingLabels } from '@/shared/ui'
import { continueStep, useStepTitle } from '@/widgets/curriculum'

/**
 * What to do next (ADR 0053), floating in the thumb's reach over Learn: one honey button saying
 * Continue over the step it opens: the next lesson of the journey or of the course last worked in,
 * read; its next guided song, in the Player. Where the floating actions say no names, it is its
 * picture alone, round, named by its tooltip. Nothing floats once everything is learned.
 */
export function ContinueAction() {
  const { t } = useTranslation('learn')
  const learned = useProgress(selectLearned)
  const stepTitle = useStepTitle()
  const labels = useFloatingLabels()
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
        aria-label={labels ? undefined : name}
        title={labels ? undefined : name}
        className={
          labels
            ? 'h-14 max-w-[min(20rem,calc(100vw-2*var(--gutter)))] gap-3 rounded-full pr-6 pl-2 shadow-lg shadow-foreground/15'
            : 'size-14 gap-0 rounded-full p-0 shadow-lg shadow-foreground/15'
        }
        render={
          step.kind === 'piece' ? (
            <Link to="/play/$pieceId" params={{ pieceId: step.pieceId }} state={OPEN_PLAINLY} />
          ) : (
            <StepLink step={step} />
          )
        }
      >
        {labels ? (
          <>
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-background/45">
              <Icon aria-hidden className="size-5" />
            </span>
            <span className="flex min-w-0 flex-col text-left leading-tight">
              <span className="text-xs font-medium">{t('continue')}</span>
              <span className="truncate font-display text-base">{title}</span>
            </span>
          </>
        ) : (
          <Icon aria-hidden className="size-6" />
        )}
      </ButtonLink>
    </FloatingActions>
  )
}
