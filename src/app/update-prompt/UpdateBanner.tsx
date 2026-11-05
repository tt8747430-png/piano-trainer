import { LoaderCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/primitives/button'

/**
 * A new version waits: Later or Update. Once Update is tapped the banner says the app is restarting
 * until it does, so the tap is never met with nothing.
 */
export function UpdateBanner({
  installing,
  onUpdate,
  onLater,
}: {
  installing: boolean
  onUpdate: () => void
  onLater: () => void
}) {
  const { t } = useTranslation('common')
  return (
    <div role="status" className="pointer-events-auto flex items-center gap-2 card p-3 shadow-lg">
      <p className="flex-1 font-medium">{t('update.available')}</p>
      {installing ? null : (
        <Button variant="ghost" onClick={onLater}>
          {t('update.later')}
        </Button>
      )}
      <Button onClick={onUpdate} disabled={installing}>
        {installing ? <LoaderCircle aria-hidden className="animate-spin" /> : null}
        {t(installing ? 'update.restarting' : 'update.update')}
      </Button>
    </div>
  )
}
