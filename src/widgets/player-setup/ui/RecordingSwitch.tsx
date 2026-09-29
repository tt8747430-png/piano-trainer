import { useTranslation } from 'react-i18next'
import { selectPractice, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setPracticeToggle } from '@/features/set-preference'
import { Switch } from '@/shared/ui/primitives/switch'

/**
 * The recording switch: a piece's recording played along in Listen, saved for every piece with one.
 * In another key it is off, and says in which key it plays (`ownKey`, null in it).
 */
export function RecordingSwitch({ ownKey }: { ownKey: string | null }) {
  const { t } = useTranslation('player')
  const settings = useSettingsStoreApi()
  const { recording } = useSettings(selectPractice)
  return (
    <label className="flex min-h-14 items-center justify-between gap-3 border-b border-border text-lg">
      <span className="flex flex-col">
        {t('toggles.recording')}
        {ownKey ? (
          <span className="text-sm text-muted-foreground">{t('ownKeyOnly', { key: ownKey })}</span>
        ) : null}
      </span>
      <Switch
        checked={recording && ownKey === null}
        disabled={ownKey !== null}
        onCheckedChange={(on) => setPracticeToggle(settings, 'recording', on)}
      />
    </label>
  )
}
