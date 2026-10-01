import { useTranslation } from 'react-i18next'
import { selectPractice, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setPracticeToggle } from '@/features/set-preference'
import { SwitchRow } from '@/shared/ui'

/** The melody switch: a piece's tune an octave up as well, saved for every piece with one. */
export function MelodySwitch() {
  const { t } = useTranslation('player')
  const settings = useSettingsStoreApi()
  const { melody } = useSettings(selectPractice)
  return (
    <SwitchRow
      label={t('toggles.melody')}
      checked={melody}
      onCheckedChange={(on) => setPracticeToggle(settings, 'melody', on)}
    />
  )
}
