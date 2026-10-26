import { Music } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { selectPractice, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setPracticeToggle } from '@/features/set-preference'
import { ToggleTile } from '@/shared/ui'

/**
 * The Tune toggle (ADR 0097): a piece's tune, its top single staff, heard along with the hands; saved
 * for every piece with one.
 */
export function TuneToggle() {
  const { t } = useTranslation('player')
  const settings = useSettingsStoreApi()
  const { tune } = useSettings(selectPractice)
  return (
    <ToggleTile
      label={t('toggles.tune')}
      icon={Music}
      pressed={tune}
      onPressedChange={(on) => setPracticeToggle(settings, 'tune', on)}
    />
  )
}
