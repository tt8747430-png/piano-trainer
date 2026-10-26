import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * The Player's tools row (ADR 0102, Chordify's toolbar), under its bar at every size: the View, named
 * by the view shown, and the tools after it (`PlayerTool`s), in one row that never wraps. On a phone
 * held upright they share the row equally; from a tablet's width they stand packed at its start.
 */
export function PlayerTools({ children }: { children: ReactNode }) {
  const { t } = useTranslation('player')
  return (
    <div
      role="toolbar"
      aria-label={t('tools')}
      aria-orientation="horizontal"
      className="flex items-center gap-1 border-b border-hairline pb-1"
    >
      {children}
    </div>
  )
}
