import type { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import type { BarRange } from '@/features/practice'
import { cn } from '@/shared/lib'
import { Button } from '@/shared/ui/primitives/button'
import type { WaitFeedback } from '../model/wait-feedback'

function lineOf(feedback: WaitFeedback, t: TFunction<'player'>): string {
  switch (feedback.kind) {
    case 'play':
      return t('playThese', { notes: feedback.notes.join(' ') })
    case 'not':
      return t('notThat', { note: feedback.note })
    case 'octave':
      return t(feedback.way === 'lower' ? 'octaveLower' : 'octaveHigher')
    case 'right':
      return t('right')
    case 'finished':
      return feedback.score === 100
        ? t('finishedClean')
        : t('finishedScore', { score: feedback.score })
  }
}

/**
 * Wait mode's one line: what to play, a wrong key, Right, or Finished. A pass finished
 * says its score and the song's best, offers Again, and the loop of the bars that had the most. With nothing
 * to say (stopped) it takes no room, its live region kept for what it says next (R32).
 */
export function WaitLine({
  feedback,
  bestBefore = null,
  onAgain,
  onLoop,
}: {
  feedback: WaitFeedback | null
  /** The song's best pass before this one, when there was one: New best, or the best to beat. */
  bestBefore?: number | null
  onAgain: () => void
  onLoop: (bars: BarRange) => void
}) {
  const { t } = useTranslation('player')
  const hardest = feedback?.kind === 'finished' ? feedback.hardest : null
  const score = feedback?.kind === 'finished' ? feedback.score : null
  const best =
    score === null || bestBefore === null || score === bestBefore
      ? null
      : score > bestBefore
        ? t('newBest')
        : t('bestScore', { score: bestBefore })
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-center gap-x-3 gap-y-2',
        feedback && 'min-h-11',
      )}
    >
      <p
        aria-live="polite"
        className={cn(
          'text-lg font-semibold',
          (feedback?.kind === 'not' || feedback?.kind === 'octave') && 'text-destructive',
        )}
      >
        {feedback ? lineOf(feedback, t) : null}
      </p>
      {best ? <span className="text-sm text-muted-foreground tabular-nums">{best}</span> : null}
      {feedback?.kind === 'finished' ? (
        <Button variant="soft" onClick={onAgain}>
          {t('again')}
        </Button>
      ) : null}
      {hardest ? (
        <Button variant="outline" onClick={() => onLoop(hardest)}>
          {hardest.first === hardest.last
            ? t('loopBar', { first: hardest.first + 1 })
            : t('loopBars', { first: hardest.first + 1, last: hardest.last + 1 })}
        </Button>
      ) : null}
    </div>
  )
}
