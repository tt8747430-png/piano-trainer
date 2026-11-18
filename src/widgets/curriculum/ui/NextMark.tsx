import { useTranslation } from 'react-i18next'

/**
 * Next, where Continue leads (the canvas's NEXTPILL): honey ink on a honey ring, 24 tall, never
 * filled, so Continue's is the one filled honey on the screen (Von Restorff). A lesson's row, a
 * course's cover and a course card wear the same.
 */
export function NextMark() {
  const { t } = useTranslation('learn')
  return (
    <span className="flex h-6 shrink-0 items-center rounded-pill px-3 text-xs font-bold text-honey-ink ring-[1.5px] ring-primary ring-inset">
      {t('upNext')}
    </span>
  )
}
