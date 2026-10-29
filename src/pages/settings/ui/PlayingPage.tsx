import { Link } from '@tanstack/react-router'
import { Cable } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useMidiSummary } from '@/features/connect-midi'
import { KeyboardSettingsFields } from '@/features/live-keyboard'
import { MetronomeSwitch, TuneSwitch } from '@/features/record-take'
import { RowLink, SettingRows, SettingsGroup as Group } from '@/shared/ui'
import { SettingsScreen } from './SettingsScreen'

/**
 * Settings › Playing: the MIDI keyboard (a row to its own screen, its state at its right, ADR 0034),
 * Recording, and the Keyboard beside them from a laptop's width.
 */
export function PlayingPage() {
  const { t } = useTranslation('settings')
  const midiSummary = useMidiSummary()
  return (
    <SettingsScreen title={t('groups.playing.label')}>
      <div className="flex flex-col gap-6">
        <nav aria-label={t('midi')} className="card p-1.5">
          <RowLink
            title={t('midi')}
            icon={Cable}
            paint="lilac"
            value={midiSummary}
            render={<Link to="/settings/midi" />}
          />
        </nav>
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
