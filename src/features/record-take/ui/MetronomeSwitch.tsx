import { useTranslation } from 'react-i18next'
import { selectRecorder, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setRecorderClick } from '@/features/set-preference'
import { SwitchRow } from '@/shared/ui'

/**
 * Whether the click goes on after a take's count-in (ADR 0028), saved for every take: one switch in
 * Settings › Recording and in the recording strip's settings, which change it while a take records.
 */
export function MetronomeSwitch() {
  const { t } = useTranslation('common')
  const store = useSettingsStoreApi()
  const click = useSettings((state) => selectRecorder(state).click)
  return (
    <SwitchRow
      label={t('recorderSettings.click')}
      info={t('recorderSettings.clickInfo')}
      checked={click}
      onCheckedChange={(on) => setRecorderClick(store, on)}
    />
  )
}
