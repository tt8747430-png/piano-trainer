import { Link } from '@tanstack/react-router'
import { BookOpenText, Play } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { StepLink, skillsOfStep, STEP_PAINT, useStepTitle, type Step } from '@/entities/course'
import { pieceById, pieceKey, skillsOfPiece } from '@/entities/piece'
import {
  knownCount,
  selectAllAnswers,
  selectSuggestedStep,
  skillsToCheck,
  useProgress,
} from '@/entities/progress'
import { localText, useLocale } from '@/shared/i18n'
import { cn, OPEN_PLAINLY } from '@/shared/lib'
import { keySymbol } from '@/shared/lib/music'
import { ButtonLink, PAINT } from '@/shared/ui'

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
      {step.kind === 'lesson' ? (
        <BookOpenText data-icon="inline-start" />
      ) : (
        <Play data-icon="inline-start" />
      )}
      {label}
    </ButtonLink>
  )
}

/**
 * What to play next (spec §5), in one tap: what the step is, its course and stage, how many of a chord step's
 * chords are known; the chords a song still has to check.
 */
export function ContinueCard() {
  const { t } = useTranslation(['learn', 'common'])
  const headingId = useId()
  const suggested = useProgress(selectSuggestedStep)
  const answers = useProgress(selectAllAnswers)
  const stepTitle = useStepTitle()
  const locale = useLocale()

  if (!suggested) {
    return (
      <section className="flex flex-col items-start gap-3 card p-5">
        <p className="font-display text-2xl font-semibold">{t('allLearned')}</p>
        <ButtonLink variant="outline" render={<Link to="/songs" />}>
          {t('toSongs')}
        </ButtonLink>
      </section>
    )
  }

  const title = stepTitle(suggested.step)
  const piece = suggested.step.kind === 'piece' ? pieceById(suggested.step.pieceId) : undefined
  const toCheck = piece ? skillsToCheck(skillsOfPiece(piece), answers).length : 0
  const skills = skillsOfStep(suggested.step)
  const detail = [
    piece || suggested.step.kind === 'lesson' ? title.secondary : t(`kind.${title.kind}`),
    piece ? keySymbol(pieceKey(piece)) : null,
    suggested.step.kind === 'chords'
      ? t('known', { known: knownCount(skills, answers), total: skills.length })
      : null,
    // A practice step says the course it closes; a lesson's course is in its place already.
    suggested.step.kind === 'lesson' ? null : localText(suggested.course.title, locale),
    t(`common:stage.${suggested.stage}`),
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
              render={<Link to="/check" search={{ of: suggested.id }} />}
            >
              <span aria-hidden className="size-2 rounded-full bg-attention" />
              {t('toCheck', { count: toCheck })}
            </ButtonLink>
          ) : null}
        </div>
        <ContinueButton step={suggested.step} label={t('continue')} />
      </div>
    </section>
  )
}
