import { useTranslation } from 'react-i18next'
import { TimingCalibration } from '@/features/connect-midi'
import { InfoTip } from '@/shared/ui'
import { SettingsScreen } from '@/widgets/settings-screen'

/**
 * Settings › Connect a piano › Calibrate timing (R34, ADR 0028): the piano's lateness measured by
 * tapping with a click, then taken off every take.
 */
export function TimingCalibrationPage() {
  const { t } = useTranslation('common')
  return (
    <SettingsScreen
      title={t('midiSettings.timing.label')}
      sub
      actions={
        <InfoTip name={t('midiSettings.timing.label')}>{t('midiSettings.timing.info')}</InfoTip>
      }
    >
      <TimingCalibration />
    </SettingsScreen>
  )
}
