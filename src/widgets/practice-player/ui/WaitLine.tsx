import type { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
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
 * Wait mode's one line: what to play, a wrong key, Right, or the pass's score once played through
 * (its acts are Played through's sheet, `PlayedThrough`). With nothing to say (stopped) it takes no
 * room, its live region kept for what it says next (R32).
 */
export function WaitLine({ feedback }: { feedback: WaitFeedback | null }) {
  const { t } = useTranslation('player')
  return (
    <div className={cn('flex items-center justify-center', feedback && 'min-h-11')}>
      <p
        aria-live="polite"
        className={cn(
          'text-lg font-semibold',
          (feedback?.kind === 'not' || feedback?.kind === 'octave') && 'text-destructive',
        )}
      >
        {feedback ? lineOf(feedback, t) : null}
      </p>
    </div>
  )
}
