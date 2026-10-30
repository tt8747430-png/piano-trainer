import { BookOpenText, Play } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { PieceLink, pieceById } from '@/entities/piece'
import { selectLearned, useProgress } from '@/entities/progress'
import { StepLink } from '@/entities/step'
import { localText, useLocale } from '@/shared/i18n'
import {
  continueStep,
  courseProgress,
  journeyProgress,
  LearnedMeter,
  useStepTitle,
} from '@/widgets/curriculum'

/**
 * What to do next (ADR 0053), Learn's first row: one card that is the link, Continue and the
 * journey or course it is on, the step it opens, how far that track is learned, and a round honey
 * mark at its end: the next lesson of the journey or of the course last worked in, read; its next
 * guided song, on its page. Nothing once everything is learned.
 */
export function ContinueAction() {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const id = useId()
  const learned = useProgress(selectLearned)
  const stepTitle = useStepTitle()
  const next = continueStep(learned)
  if (!next) return null
  const { step } = next
  const read = step.kind === 'lesson' || step.kind === 'course-lesson'
  const Icon = read ? BookOpenText : Play
  const title = stepTitle(step).primary
  const track = 'course' in next ? next.course : next.journey
  const progress =
    'course' in next ? courseProgress(next.course, learned) : journeyProgress(next.journey, learned)
  const face = (
    <>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-sm text-muted-foreground">
          {t('continue')} · {localText(track.title, locale)}
        </span>
        <h2 id={id} className="font-display text-xl leading-tight text-balance">
          {title}
        </h2>
        <LearnedMeter progress={progress} />
      </span>
      <span
        aria-hidden
        className="grid size-12 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-transform duration-200 ease-out group-hover:scale-105 group-active:scale-95 [&_svg]:size-5"
      >
        <Icon className={read ? undefined : 'fill-current'} />
      </span>
    </>
  )
  const className =
    'group flex items-center gap-4 card bg-gradient-to-b from-secondary/60 to-card p-4 transition-colors duration-200 ease-out hover:border-input'
  return (
    <section aria-labelledby={id}>
      {step.kind === 'piece' ? (
        <PieceLink
          entry={pieceById(step.pieceId) ?? { id: step.pieceId, kind: 'song' }}
          aria-label={`${t('continue')} ${title}`}
          className={className}
        >
          {face}
        </PieceLink>
      ) : (
        <StepLink step={step} aria-label={`${t('continue')} ${title}`} className={className}>
          {face}
        </StepLink>
      )}
    </section>
  )
}
