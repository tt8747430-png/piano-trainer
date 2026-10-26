import { MicVocal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { selectPractice, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setPracticeToggle } from '@/features/set-preference'
import { ToggleTile } from '@/shared/ui'

/**
 * The recording toggle: a piece's recording played along in Listen, saved for every piece with one.
 * In another key it is off and closed, its tooltip saying in which key it plays (`ownKey`, null in
 * it); the Setup's How it plays says so too, beside its heading.
 */
export function RecordingToggle({ ownKey }: { ownKey: string | null }) {
  const { t } = useTranslation('player')
  const settings = useSettingsStoreApi()
  const { recording } = useSettings(selectPractice)
  return (
    <ToggleTile
      label={t('toggles.recording')}
      tip={ownKey ? t('ownKeyOnly', { key: ownKey }) : undefined}
      icon={MicVocal}
      pressed={recording && ownKey === null}
      disabled={ownKey !== null}
      onPressedChange={(on) => setPracticeToggle(settings, 'recording', on)}
    />
  )
}
