import { useTranslation } from 'react-i18next'
import { EditingGroup } from '@/widgets/editor-settings'
import { SettingsScreen } from '@/widgets/settings-screen'

/**
 * Settings › Score editor (B7): how the editor always writes, for every score; a score's own Settings
 * hold the same group beside its names, instruments and layout.
 */
export function ScoreEditorSettingsPage() {
  const { t } = useTranslation('settings')
  return (
    <SettingsScreen title={t('pages.scoreEditor')}>
      <EditingGroup />
    </SettingsScreen>
  )
}
