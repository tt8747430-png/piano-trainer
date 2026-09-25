import { Link } from '@tanstack/react-router'
import { Play } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { ExplorerLink, useStepTitle, type PathStep } from '@/entities/path'
import { pieceById, pieceKey, skillsOfPiece } from '@/entities/piece'
import {
  selectAllAnswers,
  selectSuggestedStep,
  skillsToCheck,
  useProgress,
} from '@/entities/progress'
import { keyName } from '@/shared/lib/music'
import { ButtonLink } from '@/shared/ui'

/** The card's one action: a piece opens in the Player, a chord or scale step in its explorer. */
function ContinueButton({ step, label }: { step: PathStep; label: string }) {
  return (
    <ButtonLink
      size="pill"
      render={
        step.kind === 'piece' ? (
          <Link to="/play/$pieceId" params={{ pieceId: step.pieceId }} />
        ) : (
          <ExplorerLink step={step} />
        )
      }
    >
      <Play data-icon="inline-start" />
      {label}
    </ButtonLink>
  )
}

/** What to play next (spec §5), in one tap; the chords it still has to check, when it is a song. */
export function ContinueCard() {
  const { t } = useTranslation('path')
  const headingId = useId()
  const suggested = useProgress(selectSuggestedStep)
  const answers = useProgress(selectAllAnswers)
  const stepTitle = useStepTitle()

  if (!suggested) {
    return (
      <section className="flex flex-col items-start gap-3 rounded-3xl bg-secondary p-5 text-secondary-foreground">
        <p className="text-lg font-semibold">{t('allLearned')}</p>
        <ButtonLink variant="surface" render={<Link to="/songs" />}>
          {t('toSongs')}
        </ButtonLink>
      </section>
    )
  }

  const title = stepTitle(suggested.step)
  const piece = suggested.step.kind === 'piece' ? pieceById(suggested.step.pieceId) : undefined
  const toCheck = piece ? skillsToCheck(skillsOfPiece(piece), answers).length : 0
  const detail = piece
    ? [title.secondary, keyName(pieceKey(piece))].filter(Boolean).join(' · ')
    : t(`kind.${title.kind}`)

  return (
    <section
      aria-labelledby={headingId}
      className="flex flex-col gap-4 rounded-3xl bg-secondary p-5 text-secondary-foreground shadow-sm"
    >
      <div>
        <h2 id={headingId} className="text-xl font-bold text-balance text-foreground">
          {title.primary}
        </h2>
        <p className="mt-1">{detail}</p>
      </div>
      {toCheck > 0 ? (
        <ButtonLink
          variant="link"
          className="self-start px-0 text-secondary-foreground"
          render={<Link to="/check" search={{ of: suggested.id }} />}
        >
          <span aria-hidden className="size-2 rounded-full bg-attention" />
          {t('toCheck', { count: toCheck })}
        </ButtonLink>
      ) : null}
      <ContinueButton step={suggested.step} label={t('continue')} />
    </section>
  )
}
