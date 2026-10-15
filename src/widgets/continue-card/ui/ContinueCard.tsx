import { Link } from '@tanstack/react-router'
import { BookOpenText, Play } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { pieceById, pieceKey, skillsOfPiece } from '@/entities/piece'
import {
  knownCount,
  selectAllAnswers,
  selectLearned,
  skillsToCheck,
  useProgress,
} from '@/entities/progress'
import { skillsOfStep, STEP_PAINT, StepLink, type Step } from '@/entities/step'
import { localText, useLocale } from '@/shared/i18n'
import { cn, OPEN_PLAINLY } from '@/shared/lib'
import { keySymbol } from '@/shared/lib/music'
import { ButtonLink, PAINT } from '@/shared/ui'
import { continueStep, useStepTitle } from '@/widgets/curriculum'

/** The card's one action: a lesson opens to be read, a piece in the Player, a chord or scale step in its explorer. */
function ContinueButton({ step, label }: { step: Step; label: string }) {
  return (
    <ButtonLink
      size="pill"
      className="w-full"
      render={
        step.kind === 'piece' ? (
          <Link to="/play/$pieceId" params={{ pieceId: step.pieceId }} state={OPEN_PLAINLY} />
        ) : (
          <StepLink step={step} />
        )
      }
    >
      {/* A lesson is read, everything else played. */}
      {step.kind === 'lesson' || step.kind === 'course-lesson' ? (
        <BookOpenText data-icon="inline-start" />
      ) : (
        <Play data-icon="inline-start" />
      )}
      {label}
    </ButtonLink>
  )
}

/**
 * What to do next (ADR 0053), in one tap: the next lesson of the journey, or of the course last worked
 * in, or its next guided song; where it is and its level; how many of a check's chords are known, and
 * the chords a song still has to check.
 */
export function ContinueCard() {
  const { t } = useTranslation(['learn', 'common'])
  const headingId = useId()
  const learned = useProgress(selectLearned)
  const answers = useProgress(selectAllAnswers)
  const stepTitle = useStepTitle()
  const locale = useLocale()
  const next = continueStep(learned)

  if (!next) {
    return (
      <section className="flex flex-col items-start gap-3 card p-5">
        <p className="font-display text-2xl font-semibold">{t('allLearned')}</p>
        <ButtonLink variant="outline" render={<Link to="/songs" />}>
          {t('toSongs')}
        </ButtonLink>
      </section>
    )
  }

  const { step } = next
  const title = stepTitle(step)
  const piece = step.kind === 'piece' ? pieceById(step.pieceId) : undefined
  const toCheck = piece ? skillsToCheck(skillsOfPiece(piece), answers).length : 0
  const skills = skillsOfStep(step)
  const stage = 'course' in next ? next.course.stage : next.journey.stage
  const read = step.kind === 'lesson' || step.kind === 'course-lesson'
  const detail = [
    read || piece ? title.secondary : t(`kind.${title.kind}`),
    piece ? keySymbol(pieceKey(piece)) : null,
    step.kind === 'chords'
      ? t('known', { known: knownCount(skills, answers), total: skills.length })
      : null,
    // A song says the course it is guided in; a check, its journey.
    piece && 'course' in next ? localText(next.course.title, locale) : null,
    !read && !piece && 'journey' in next ? localText(next.journey.title, locale) : null,
    t(`common:stage.${stage}`),
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <section aria-labelledby={headingId} className="overflow-hidden card">
      {/* The book's header band: the card's own title, on the wash of its step's paint. */}
      <h2
        id={headingId}
        className={cn(
          'border-b border-border px-5 py-3 text-3xl text-balance',
          PAINT[STEP_PAINT[title.kind]].fill,
        )}
      >
        {title.primary}
      </h2>
      <div className="flex flex-col gap-4 p-5">
        <div className="flex flex-col gap-2">
          <p className="text-lg">{detail}</p>
          {toCheck > 0 ? (
            <ButtonLink
              variant="link"
              className="self-start px-0"
              render={<Link to="/check" search={{ of: next.id }} />}
            >
              <span aria-hidden className="size-2 rounded-full bg-attention" />
              {t('toCheck', { count: toCheck })}
            </ButtonLink>
          ) : null}
        </div>
        <ContinueButton step={step} label={t('continue')} />
      </div>
    </section>
  )
}
