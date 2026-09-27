import { useTranslation } from 'react-i18next'
import {
  PLAYING_TOGGLES,
  selectPractice,
  useSettings,
  useSettingsStoreApi,
} from '@/entities/settings'
import { setPracticeToggle } from '@/features/set-preference'
import { Switch } from '@/shared/ui/primitives/switch'

const ROW = 'flex min-h-14 items-center justify-between border-b border-border text-lg'

/** How the Player plays, in the Setup sheet: swing (null where the meter cannot swing), and the saved switches. */
export function PlayingFields({
  swing,
  onSwing,
}: {
  swing: boolean | null
  onSwing: (on: boolean) => void
}) {
  const { t } = useTranslation('player')
  const settings = useSettingsStoreApi()
  const toggles = useSettings(selectPractice)
  return (
    <div>
      {swing === null ? null : (
        <label className={ROW}>
          {t('toggles.swing')}
          <Switch checked={swing} onCheckedChange={onSwing} />
        </label>
      )}
      {PLAYING_TOGGLES.map((toggle) => (
        <label key={toggle} className={ROW}>
          {t(`toggles.${toggle}`)}
          <Switch
            checked={toggles[toggle]}
            onCheckedChange={(on) => setPracticeToggle(settings, toggle, on)}
          />
        </label>
      ))}
    </div>
  )
}
