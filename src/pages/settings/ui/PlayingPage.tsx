import { useTranslation } from 'react-i18next'
import { KeyboardSettingsFields } from '@/features/live-keyboard'
import { MetronomeSwitch, TuneSwitch } from '@/features/record-take'
import { SettingRows, SettingsGroup as Group } from '@/shared/ui'
import { SettingsScreen } from './SettingsScreen'

/** Settings › Keyboard and recording: Recording, and the Keyboard beside it from a laptop's width. */
export function PlayingPage() {
  const { t } = useTranslation('settings')
  return (
    <SettingsScreen title={t('sections.keyboard')}>
      <div className="flex flex-col gap-6">
        <Group title={t('recording')}>
          <SettingRows>
            <MetronomeSwitch />
            <TuneSwitch />
          </SettingRows>
        </Group>
      </div>
      <Group title={t('keyboard')}>
        <KeyboardSettingsFields />
      </Group>
    </SettingsScreen>
  )
}
