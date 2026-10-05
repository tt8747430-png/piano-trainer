import { Music } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { selectPractice, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setPracticeToggle } from '@/features/set-preference'
import { ToggleTile } from '@/shared/ui'

/** The melody toggle: a piece's tune an octave up as well, saved for every piece with one. */
export function MelodyToggle() {
  const { t } = useTranslation('player')
  const settings = useSettingsStoreApi()
  const { melody } = useSettings(selectPractice)
  return (
    <ToggleTile
      label={t('toggles.melody')}
      icon={Music}
      pressed={melody}
      onPressedChange={(on) => setPracticeToggle(settings, 'melody', on)}
    />
  )
}
