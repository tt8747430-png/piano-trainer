import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * The Player's foot bar (R29 B8, the reference's labelled bar): its tools side by side, each its icon
 * over its name (`FootTool`), across the screen's foot under the music and the keys. Its tools are
 * the learner's (B10, Settings › Tool bar), the rest under More.
 */
export function PlayerFoot({ children }: { children: ReactNode }) {
  const { t } = useTranslation('player')
  return (
    <div
      role="toolbar"
      aria-label={t('foot.label')}
      data-area="foot"
      className="-mx-gutter flex min-w-0 items-stretch justify-around gap-0 border-t border-hairline px-1 pt-1 pb-[max(--spacing(1),env(safe-area-inset-bottom))]"
    >
      {children}
    </div>
  )
}
