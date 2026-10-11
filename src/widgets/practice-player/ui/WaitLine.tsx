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
    case 'right':
      return t('right')
    case 'finished':
      return feedback.slips === 0
        ? t('finishedClean')
        : t('finishedSlips', { count: feedback.slips })
  }
}

/**
 * Wait mode's one line: what to play, a wrong key, Right, or Finished (spec §2.7). A pass finished
 * says how many slips it had, offers Again, and the loop of the bars that had the most.
 */
export function WaitLine({
  feedback,
  onAgain,
  onLoop,
}: {
  feedback: WaitFeedback | null
  onAgain: () => void
  onLoop: (bars: BarRange) => void
}) {
  const { t } = useTranslation('player')
  const hardest = feedback?.kind === 'finished' ? feedback.hardest : null
  return (
    <div className="flex min-h-11 flex-wrap items-center justify-center gap-x-3 gap-y-2">
      <p
        aria-live="polite"
        className={cn('text-lg font-semibold', feedback?.kind === 'not' && 'text-destructive')}
      >
        {feedback ? lineOf(feedback, t) : null}
      </p>
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
