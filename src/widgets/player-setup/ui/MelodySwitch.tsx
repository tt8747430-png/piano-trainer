import { useTranslation } from 'react-i18next'
import { selectPractice, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setPracticeToggle } from '@/features/set-preference'
import { Switch } from '@/shared/ui/primitives/switch'

/** The melody switch: a piece's tune an octave up as well, saved for every piece with one. */
export function MelodySwitch() {
  const { t } = useTranslation('player')
  const settings = useSettingsStoreApi()
  const { melody } = useSettings(selectPractice)
  return (
    <label className="flex min-h-14 items-center justify-between border-b border-border text-lg">
      {t('toggles.melody')}
      <Switch
        checked={melody}
        onCheckedChange={(on) => setPracticeToggle(settings, 'melody', on)}
      />
    </label>
  )
}
