import { useTranslation } from 'react-i18next'
import { selectRecorder, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setRecorderTune } from '@/features/set-preference'
import { SwitchRow } from '@/shared/ui'

/**
 * Whether a song's tune plays under a take, saved for every take: one switch
 * in Settings › Recording and in the recording strip's settings where the song has a tune.
 */
export function TuneSwitch() {
  const { t } = useTranslation('common')
  const store = useSettingsStoreApi()
  const tune = useSettings((state) => selectRecorder(state).tune)
  return (
    <SwitchRow
      label={t('recorderSettings.tune')}
      info={t('recorderSettings.tuneInfo')}
      checked={tune}
      onCheckedChange={(on) => setRecorderTune(store, on)}
    />
  )
}
