import { FastForward } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { selectTrainer, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setAutoNext } from '@/features/set-preference'
import { SettingRows, SettingsGroup, SwitchRow } from '@/shared/ui'
import { PracticeSettingsScreen } from './PracticeSettingsScreen'

/**
 * Exercises' and the Quiz's Settings (A24): how every drill goes, whatever it asks. A drill's own
 * choices (its level, rounds and time limit) are what it asks, so they stay on its setup.
 */
export function TrainersSettingsPage() {
  const { t } = useTranslation(['practice', 'quiz'])
  const store = useSettingsStoreApi()
  const { autoNext } = useSettings(selectTrainer)
  return (
    <PracticeSettingsScreen title={t('practice:settings.trainers')}>
      <SettingsGroup>
        <SettingRows>
          <SwitchRow
            setting="trainer.autoNext"
            icon={<FastForward />}
            label={t('quiz:autoNext')}
            info={t('quiz:timing.autoNextInfo')}
            checked={autoNext}
            onCheckedChange={(on) => setAutoNext(store, on)}
          />
        </SettingRows>
      </SettingsGroup>
    </PracticeSettingsScreen>
  )
}
