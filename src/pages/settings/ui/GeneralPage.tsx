import { useTranslation } from 'react-i18next'
import {
  selectLocale,
  selectTheme,
  THEMES,
  useSettings,
  useSettingsStoreApi,
} from '@/entities/settings'
import { setLocale, setTheme } from '@/features/set-preference'
import { LOCALES } from '@/shared/i18n'
import { SettingsGroup } from '@/shared/ui'
import { SettingsScreen } from '@/widgets/settings-screen'
import { AppearanceChoice, LanguageChoice } from './GeneralChoices'

/**
 * Settings › General (canvas 128, "these are very heavy to read"): Appearance as three small screens
 * (Match system split light and dark, Light, Dark), then Language as English | Русский, each its own
 * name, the chosen ringed in ink. How a lesson reads is the lesson's own Settings'; the library's
 * bars are Settings › Library's (R32).
 */
export function GeneralPage() {
  const { t } = useTranslation('settings')
  const settings = useSettingsStoreApi()
  const locale = useSettings(selectLocale)
  const theme = useSettings(selectTheme)
  return (
    <SettingsScreen title={t('pages.general')}>
      <SettingsGroup bare title={t('theme.label')}>
        <div data-setting="theme">
          <AppearanceChoice
            label={t('theme.label')}
            value={theme}
            options={THEMES.map((value) => ({ value, label: t(`theme.${value}`) }))}
            onChange={(value) => setTheme(settings, value)}
          />
        </div>
      </SettingsGroup>
      <SettingsGroup bare title={t('language.label')}>
        <div data-setting="locale">
          <LanguageChoice
            label={t('language.label')}
            value={locale}
            options={LOCALES.map((value) => ({ value, label: t(`language.${value}`) }))}
            onChange={(value) => setLocale(settings, value)}
          />
        </div>
      </SettingsGroup>
    </SettingsScreen>
  )
}
