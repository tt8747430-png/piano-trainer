import { useTranslation } from 'react-i18next'
import { SettingsScreen } from '@/widgets/settings-screen'
import { PlayerSettings, type VolumeTrack } from '@/widgets/player-settings'

/**
 * Settings › Player (B7): how the Player always plays, every song's: the same page a song's gear opens
 * in the Player, its volumes the piano's two staves and a recording's (a song's own staves are named
 * on its own).
 */
export function PlayerSettingsPage() {
  const { t } = useTranslation(['settings', 'music', 'player'])
  const tracks: readonly VolumeTrack[] = [
    { id: 'treble', label: t('music:view.upper') },
    { id: 'bass', label: t('music:view.lower') },
    { id: 'recording', label: t('player:sound.recording') },
  ]
  return (
    <SettingsScreen title={t('pages.player')}>
      <PlayerSettings tracks={tracks} />
    </SettingsScreen>
  )
}
