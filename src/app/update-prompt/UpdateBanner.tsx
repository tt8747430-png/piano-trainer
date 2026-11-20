import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/primitives/button'

/**
 * A new version waits: Later or Update, as the AppLayers board draws it, an ink band with the honey
 * Update. Once Update is tapped the band says the app is restarting until it does, so the tap is
 * never met with nothing.
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
    <div
      role="status"
      className="pointer-events-auto flex min-h-13 items-center gap-2 rounded-card bg-foreground py-1.5 ps-4 pe-1.5 text-[0.9375rem] text-background shadow-(--elevation-3)"
    >
      <p className="flex-1 font-semibold">
        {t(installing ? 'update.restarting' : 'update.available')}
      </p>
      {installing ? null : (
        <>
          <Button
            variant="ghost"
            className="px-3 text-[0.9375rem] font-normal text-background hover:bg-background/10 hover:text-background"
            onClick={onLater}
          >
            {t('update.later')}
          </Button>
          <Button className="px-4 text-[0.9375rem]" onClick={onUpdate}>
            {t('update.update')}
          </Button>
        </>
      )}
    </div>
  )
}
