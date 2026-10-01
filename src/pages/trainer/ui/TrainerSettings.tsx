import { Settings2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { selectTrainer, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setAutoNext } from '@/features/set-preference'
import { RoundButton, Sheet, SheetContent, SheetTrigger, SwitchRow } from '@/shared/ui'

/** How every trainer goes, in a sheet behind its button: auto-next, saved. */
export function TrainerSettings() {
  const { t } = useTranslation('quiz')
  const store = useSettingsStoreApi()
  const { autoNext } = useSettings(selectTrainer)
  return (
    <Sheet>
      <SheetTrigger render={<RoundButton label={t('settings')} icon={Settings2} />} />
      <SheetContent title={t('settings')}>
        <SwitchRow
          label={t('autoNext')}
          checked={autoNext}
          onCheckedChange={(on) => setAutoNext(store, on)}
        />
      </SheetContent>
    </Sheet>
  )
}
