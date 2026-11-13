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
import { PictureChoice, Segmented, SettingField, SettingsGroup, ThemePicture } from '@/shared/ui'
import { SettingsScreen } from '@/widgets/settings-screen'

/**
 * Settings › General (canvas 128, "these are very heavy to read"): Appearance as three small screens
 * (Match system split light and dark, Light, Dark), then Language as English | Русский. How a lesson
 * reads is the lesson's own Settings'; the library's bars are Settings › Library's (R32).
 */
export function GeneralPage() {
  const { t } = useTranslation('settings')
  const settings = useSettingsStoreApi()
  const locale = useSettings(selectLocale)
  const theme = useSettings(selectTheme)
  return (
    <SettingsScreen title={t('pages.general')}>
      <SettingsGroup>
        <PictureChoice
          label={t('theme.label')}
          setting="theme"
          value={theme}
          options={THEMES.map((value) => ({
            value,
            label: t(`theme.${value}`),
            picture: <ThemePicture theme={value} />,
          }))}
          onChange={(value) => setTheme(settings, value)}
        />
        <SettingField label={t('language.label')} setting="locale">
          <Segmented
            label={t('language.label')}
            value={locale}
            options={LOCALES.map((value) => ({ value, label: t(`language.${value}`) }))}
            onChange={(value) => setLocale(settings, value)}
          />
        </SettingField>
      </SettingsGroup>
    </SettingsScreen>
  )
}
