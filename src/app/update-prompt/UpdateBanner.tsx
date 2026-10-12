import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/primitives/button'

export function UpdateBanner({ onUpdate, onLater }: { onUpdate: () => void; onLater: () => void }) {
  const { t } = useTranslation('common')
  return (
    <div role="status" className="pointer-events-auto flex items-center gap-2 card p-3 shadow-lg">
      <p className="flex-1 font-medium">{t('update.available')}</p>
      <Button variant="ghost" onClick={onLater}>
        {t('update.later')}
      </Button>
      <Button onClick={onUpdate}>{t('update.update')}</Button>
    </div>
  )
}
