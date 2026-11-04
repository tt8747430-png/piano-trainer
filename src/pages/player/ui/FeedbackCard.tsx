import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Feedback } from '@/entities/take'
import { formatPercent, useLocale } from '@/shared/i18n'
import { Button } from '@/shared/ui/primitives/button'

/** The verdicts the summary counts after the share right, in this order. */
const COUNTED = ['wrong', 'missed', 'early', 'late'] as const

/**
 * A take's feedback in one line over the score's corner (R29 B8): "92 % right · 3 wrong · 2 late",
 * each verdict there is; its × hides the feedback. Floats: it keeps no room of the music's.
 */
export function FeedbackCard({ feedback, onClose }: { feedback: Feedback; onClose: () => void }) {
  const { t } = useTranslation('player')
  const locale = useLocale()
  const parts = [
    t('feedback.summary', { percent: formatPercent(locale, feedback.percent) }),
    ...COUNTED.flatMap((verdict) =>
      feedback.counts[verdict] > 0
        ? [t(`feedback.count.${verdict}`, { count: feedback.counts[verdict] })]
        : [],
    ),
  ]
  return (
    <div
      role="status"
      className="card absolute top-[calc(var(--tools-room,0px)+0.5rem)] right-0 z-20 flex max-w-full items-center gap-1 py-1 pr-1 pl-3 text-sm shadow-md"
    >
      <span className="min-w-0">{parts.join(' · ')}</span>
      <Button
        variant="ghost"
        size="icon"
        aria-label={t('feedback.close')}
        title={t('feedback.close')}
        onClick={onClose}
      >
        <X aria-hidden />
      </Button>
    </div>
  )
}
