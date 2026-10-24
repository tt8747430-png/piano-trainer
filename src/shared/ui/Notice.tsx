import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/primitives/button'

/**
 * A notice floating over the screen, as the app says a save went wrong (an alert): its one line, a
 * detail under it where it needs one, then Close and the actions it offers.
 */
export function Notice({
  line,
  detail,
  onClose,
  children,
}: {
  line: string
  detail?: string
  onClose: () => void
  /** What it offers after Close: a way to put it right. */
  children?: ReactNode
}) {
  const { t } = useTranslation('common')
  return (
    <div role="alert" className="pointer-events-auto flex flex-col gap-3 card p-4 shadow-lg">
      <p className="font-medium">{line}</p>
      {detail === undefined ? null : <p className="text-sm text-muted-foreground">{detail}</p>}
      <div className="flex justify-end gap-2">
        <Button variant="ghost" aria-label={t('notice.close')} onClick={onClose}>
          {t('close')}
        </Button>
        {children}
      </div>
    </div>
  )
}
