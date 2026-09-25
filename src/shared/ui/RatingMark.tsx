import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'

const LOOK = {
  known: 'size-4 bg-primary text-primary-foreground',
  gap: 'size-2.5 bg-attention',
  unknown: 'size-2.5 ring-2 ring-inset ring-border',
} as const

/** Known (a check), a gap (an amber dot) or not checked yet (a ring), named in words. */
export function RatingMark({ rating }: { rating: 'known' | 'gap' | 'unknown' }) {
  const { t } = useTranslation('common')
  return (
    <span className="inline-flex items-center">
      <span aria-hidden className={cn('inline-grid place-items-center rounded-full', LOOK[rating])}>
        {rating === 'known' ? <Check className="size-3" strokeWidth={3} /> : null}
      </span>
      <span className="sr-only">{t(`rating.${rating}`)}</span>
    </span>
  )
}
