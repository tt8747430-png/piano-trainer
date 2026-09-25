import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/primitives/button'

export function UpdateBanner({ onUpdate, onLater }: { onUpdate: () => void; onLater: () => void }) {
  const { t } = useTranslation('common')
  return (
    <div
      role="status"
      className="fixed inset-x-4 bottom-28 z-40 mx-auto flex max-w-md items-center gap-2 rounded-3xl bg-card p-3 shadow-lg ring-1 ring-border lg:bottom-4"
    >
      <p className="flex-1 font-medium">{t('update.available')}</p>
      <Button variant="ghost" onClick={onLater}>
        {t('update.later')}
      </Button>
      <Button onClick={onUpdate}>{t('update.update')}</Button>
    </div>
  )
}
