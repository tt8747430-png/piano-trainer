import { useTranslation } from 'react-i18next'
import { KeyboardSettingsFields } from '@/features/live-keyboard'
import { MetronomeSwitch, TuneSwitch } from '@/features/record-take'
import { SettingRows, SettingsGroup as Group } from '@/shared/ui'
import { SettingsScreen } from '@/widgets/settings-screen'

/** Settings › Keyboard and recording: Recording, then the Keyboard. */
export function PlayingPage() {
  const { t } = useTranslation('settings')
  return (
    <SettingsScreen title={t('sections.keyboard')}>
      <Group title={t('recording')}>
        <SettingRows>
          <MetronomeSwitch />
          <TuneSwitch />
        </SettingRows>
      </Group>
      <Group title={t('keyboard')}>
        <KeyboardSettingsFields />
      </Group>
    </SettingsScreen>
  )
}
