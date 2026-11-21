import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'

/**
 * Next, where Continue leads (the canvas's NEXTPILL): honey ink on a honey ring, 24 tall, never
 * filled, so Continue's is the one filled honey on the screen (Von Restorff). A lesson's row and a
 * course's cover wear it; a course's row on the Courses wears it 26 tall at 13 (`size="row"`).
 */
export function NextMark({ size }: { size?: 'row' }) {
  const { t } = useTranslation('learn')
  return (
    <span
      className={cn(
        'flex shrink-0 items-center rounded-pill px-3 font-bold text-honey-ink ring-[1.5px] ring-primary ring-inset',
        size === 'row' ? 'h-6.5 text-footnote' : 'h-6 text-xs',
      )}
    >
      {t('upNext')}
    </span>
  )
}
