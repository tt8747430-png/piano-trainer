import { useTranslation } from 'react-i18next'
import {
  PLAYING_TOGGLES,
  selectPractice,
  useSettings,
  useSettingsStoreApi,
} from '@/entities/settings'
import { setPracticeToggle } from '@/features/set-preference'
import { SwitchRow } from '@/shared/ui'

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
        <SwitchRow label={t('toggles.swing')} checked={swing} onCheckedChange={onSwing} />
      )}
      {PLAYING_TOGGLES.map((toggle) => (
        <SwitchRow
          key={toggle}
          label={t(`toggles.${toggle}`)}
          checked={toggles[toggle]}
          onCheckedChange={(on) => setPracticeToggle(settings, toggle, on)}
        />
      ))}
    </div>
  )
}
