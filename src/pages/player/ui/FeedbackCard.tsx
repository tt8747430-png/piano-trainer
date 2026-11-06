import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Feedback } from '@/entities/take'
import { formatPercent, useLocale } from '@/shared/i18n'
import { VERDICT_INK, VERDICT_SHAPE } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/** The verdicts the summary counts after the share right, in this order. */
const COUNTED = ['wrong', 'missed', 'early', 'late'] as const

/**
 * A take's feedback in one line over the score's corner (R29 B8): "● 92 % right · × 3 wrong · ▸ 2 late",
 * each verdict there is, after the shape the score marks it with (R34); its × hides the feedback. Floats: it keeps no room of the music's.
 */
export function FeedbackCard({ feedback, onClose }: { feedback: Feedback; onClose: () => void }) {
  const { t } = useTranslation('player')
  const locale = useLocale()
  const counted = COUNTED.filter((verdict) => feedback.counts[verdict] > 0)
  return (
    <div
      role="status"
      className="card absolute top-2 right-0 z-20 flex max-w-full items-center gap-1 py-1 pr-1 pl-3 text-sm shadow-md"
    >
      <span className="min-w-0">
        <Shape verdict="right" />
        {t('feedback.summary', { percent: formatPercent(locale, feedback.percent) })}
        {counted.map((verdict) => (
          <span key={verdict}>
            {' · '}
            <Shape verdict={verdict} />
            {t(`feedback.count.${verdict}`, { count: feedback.counts[verdict] })}
          </span>
        ))}
      </span>
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

/** A verdict's shape before its words, in its ink: the legend of the shapes on the score. */
function Shape({ verdict }: { verdict: keyof typeof VERDICT_SHAPE }) {
  return (
    <span aria-hidden className="me-1 font-bold" style={{ color: VERDICT_INK[verdict] }}>
      {VERDICT_SHAPE[verdict]}
    </span>
  )
}
