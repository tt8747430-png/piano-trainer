import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * The score's tools (ADR 0102, Chordify's toolbar), the score bar's middle (`ScoreBar`, ADR 0115):
 * the View, named by the view shown, and the tools after it (`PlayerTool`s), in one row that never
 * wraps. On a phone held upright they share the row equally; from a tablet's width they stand packed
 * at its start. The score editor's row is the same, named for its tools (`label`, ADR 0110).
 */
export function PlayerTools({ label, children }: { label?: string; children: ReactNode }) {
  const { t } = useTranslation('player')
  return (
    <div
      role="toolbar"
      aria-label={label ?? t('tools')}
      aria-orientation="horizontal"
      className="flex items-center gap-1"
    >
      {children}
    </div>
  )
}
