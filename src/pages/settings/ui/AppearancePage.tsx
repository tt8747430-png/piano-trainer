import { useTranslation } from 'react-i18next'
import { selectTheme, THEMES, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setTheme } from '@/features/set-preference'
import { GroupRow, SettingsGroup } from '@/shared/ui'
import { SettingsScreen, useSettingsDialog } from '@/widgets/settings-screen'
import { AppearanceChoice } from './GeneralChoices'

/**
 * Settings › Appearance, its own place as Apple's Display & Brightness (owner, 2026-11-17: "look
 * where the apple puts its settings"): the theme alone. On a phone its three small screens across
 * the column under the heading (the board's THEMES); in the laptop's dialog one Theme row with the
 * screens at its end (the board's LTHEME, claude.ai's Appearance).
 */
export function AppearancePage() {
  const { t } = useTranslation('settings')
  const settings = useSettingsStoreApi()
  const theme = useSettings(selectTheme)
  const inDialog = useSettingsDialog() !== null
  const choice = (
    <AppearanceChoice
      label={t('theme.label')}
      row={inDialog}
      value={theme}
      options={THEMES.map((value) => ({ value, label: t(`theme.${value}`) }))}
      onChange={(value) => setTheme(settings, value)}
    />
  )
  return (
    <SettingsScreen title={t('pages.appearance')}>
      {inDialog ? (
        <SettingsGroup flush>
          <GroupRow label={t('theme.row')} setting="theme">
            {choice}
          </GroupRow>
        </SettingsGroup>
      ) : (
        <SettingsGroup bare title={t('theme.label')}>
          <div data-setting="theme">{choice}</div>
        </SettingsGroup>
      )}
    </SettingsScreen>
  )
}
