import type { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
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
      return t('finished')
  }
}

/** Wait mode's one line: what to play, a wrong key, Right, or Finished with Again (spec §2.7). */
export function WaitLine({
  feedback,
  onAgain,
}: {
  feedback: WaitFeedback | null
  onAgain: () => void
}) {
  const { t } = useTranslation('player')
  return (
    <div className="flex min-h-11 items-center justify-center gap-3">
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
    </div>
  )
}
