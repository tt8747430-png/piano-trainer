import { useTranslation } from 'react-i18next'
import { selectPractice, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setPracticeToggle } from '@/features/set-preference'
import { SwitchRow } from '@/shared/ui'

/**
 * The recording switch: a piece's recording played along in Listen, saved for every piece with one.
 * In another key it is off, and says in which key it plays (`ownKey`, null in it).
 */
export function RecordingSwitch({ ownKey }: { ownKey: string | null }) {
  const { t } = useTranslation('player')
  const settings = useSettingsStoreApi()
  const { recording } = useSettings(selectPractice)
  return (
    <SwitchRow
      label={t('toggles.recording')}
      detail={ownKey ? t('ownKeyOnly', { key: ownKey }) : undefined}
      checked={recording && ownKey === null}
      disabled={ownKey !== null}
      onCheckedChange={(on) => setPracticeToggle(settings, 'recording', on)}
    />
  )
}
