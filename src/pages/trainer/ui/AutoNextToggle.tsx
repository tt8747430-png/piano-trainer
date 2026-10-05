import { FastForward } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { selectTrainer, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setAutoNext } from '@/features/set-preference'
import { Toggle } from '@/shared/ui/primitives/toggle'

/** Whether every trainer goes on to its next round by itself: a toggle in sight, saved. */
export function AutoNextToggle() {
  const { t } = useTranslation('quiz')
  const store = useSettingsStoreApi()
  const { autoNext } = useSettings(selectTrainer)
  return (
    <Toggle pressed={autoNext} onPressedChange={(on) => setAutoNext(store, on)}>
      <FastForward aria-hidden />
      {t('autoNext')}
    </Toggle>
  )
}
