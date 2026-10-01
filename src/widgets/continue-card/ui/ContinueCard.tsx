import { Link } from '@tanstack/react-router'
import { Play } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { ExplorerLink, STEP_PAINT, useStepTitle, type PathStep } from '@/entities/path'
import { pieceById, pieceKey, skillsOfPiece } from '@/entities/piece'
import {
  selectAllAnswers,
  selectSuggestedStep,
  skillsToCheck,
  useProgress,
} from '@/entities/progress'
import { cn, OPEN_PLAINLY } from '@/shared/lib'
import { keySymbol } from '@/shared/lib/music'
import { ButtonLink, PAINT } from '@/shared/ui'

/** The card's one action: a piece opens in the Player, a chord or scale step in its explorer. */
function ContinueButton({ step, label }: { step: PathStep; label: string }) {
  return (
    <ButtonLink
      size="pill"
      className="lg:min-w-64"
      render={
        step.kind === 'piece' ? (
          <Link to="/play/$pieceId" params={{ pieceId: step.pieceId }} state={OPEN_PLAINLY} />
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
  const detail = piece
    ? [title.secondary, keySymbol(pieceKey(piece))].filter(Boolean).join(' · ')
    : t(`kind.${title.kind}`)

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
      {/* On a laptop the card runs the page's width: what the step is on the left, Continue on the right. */}
      <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
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
