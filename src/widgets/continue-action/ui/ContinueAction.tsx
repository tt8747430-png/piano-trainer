import { BookOpenText, ChevronRight, Play } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { PieceLink, pieceById } from '@/entities/piece'
import { selectLearned, useProgress } from '@/entities/progress'
import { StepLink } from '@/entities/step'
import { localText, useLocale } from '@/shared/i18n'
import { ButtonLink } from '@/shared/ui'
import {
  continueStep,
  courseProgress,
  journeyProgress,
  LearnedMeter,
  useStepTitle,
} from '@/widgets/curriculum'

/**
 * What to do next (ADR 0053), Learn's hero card (as Noji's and simpleclub's homes lead with one): the
 * journey or course it is on, the step it opens, how far that track is learned, and one full-width
 * honey button, Continue: the next lesson of the journey or of the course last worked in, read; its
 * next guided song, on its page. Nothing once everything is learned.
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
  return (
    <section
      aria-labelledby={id}
      className="flex flex-col gap-4 card bg-gradient-to-b from-secondary/60 to-card p-5"
    >
      <div className="flex flex-col gap-1">
        <p className="flex items-center gap-0.5 text-sm text-muted-foreground">
          {localText(track.title, locale)}
          <ChevronRight aria-hidden className="size-4" />
        </p>
        <h2 id={id} className="font-display text-2xl text-balance">
          {title}
        </h2>
      </div>
      <LearnedMeter progress={progress} />
      <ButtonLink
        size="lg"
        className="w-full rounded-2xl text-base"
        aria-label={`${t('continue')} ${title}`}
        render={
          step.kind === 'piece' ? (
            <PieceLink entry={pieceById(step.pieceId) ?? { id: step.pieceId, kind: 'song' }} />
          ) : (
            <StepLink step={step} />
          )
        }
      >
        <Icon data-icon="inline-start" aria-hidden />
        {t('continue')}
      </ButtonLink>
    </section>
  )
}
