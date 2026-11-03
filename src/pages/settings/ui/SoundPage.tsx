import { Link } from '@tanstack/react-router'
import { Timer } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { MetronomeSwitch, TuneSwitch } from '@/features/record-take'
import { RowLink, SettingRows, SettingsGroup } from '@/shared/ui'
import { SettingsScreen } from '@/widgets/settings-screen'

/**
 * Settings › Sound and recording (R22): how a take is recorded (the metronome after the count-in, the
 * song's melody under it), and a row to the Metronome, whose sounds keep their one home there (R18).
 */
export function SoundPage() {
  const { t } = useTranslation('settings')
  return (
    <SettingsScreen title={t('pages.sound')}>
      <SettingsGroup title={t('recording')}>
        <SettingRows>
          <MetronomeSwitch />
          <TuneSwitch />
        </SettingRows>
      </SettingsGroup>
      <SettingsGroup flush>
        <RowLink
          title={t('pages.metronome')}
          icon={Timer}
          paint="sand"
          render={<Link to="/practice/metronome" />}
        />
      </SettingsGroup>
    </SettingsScreen>
  )
}
