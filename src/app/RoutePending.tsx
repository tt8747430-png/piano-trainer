import { useTranslation } from 'react-i18next'

/** The board's Loading: the page's shape in sand, fading down, while a screen's chunk loads (after 300ms). */
const BLOCKS = [
  { height: 36, opacity: 0.9 },
  { height: 96, opacity: 0.8 },
  { height: 24, opacity: 0.7 },
  { height: 56, opacity: 0.6 },
  { height: 56, opacity: 0.5 },
  { height: 56, opacity: 0.4 },
] as const

export function RoutePending() {
  const { t } = useTranslation('common')
  return (
    <div role="status" aria-label={t('loading')} className="flex flex-col gap-3 py-2">
      {BLOCKS.map(({ height, opacity }, index) => (
        <span key={index} className="rounded-card bg-muted" style={{ height, opacity }} />
      ))}
    </div>
  )
}
