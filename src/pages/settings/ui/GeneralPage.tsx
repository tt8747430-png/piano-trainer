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
import { ChoiceCard } from '@/shared/ui'
import { SettingsScreen } from '@/widgets/settings-screen'

/** Settings › General: what changes the whole app, each a card with every choice in sight (R29). How a
 * lesson reads is the lesson's own Settings'. */
export function GeneralPage() {
  const { t } = useTranslation('settings')
  const settings = useSettingsStoreApi()
  const locale = useSettings(selectLocale)
  const theme = useSettings(selectTheme)
  return (
    <SettingsScreen title={t('sections.general')}>
      <ChoiceCard
        title={t('theme.label')}
        setting="theme"
        value={theme}
        options={THEMES.map((value) => ({ value, label: t(`theme.${value}`) }))}
        onChange={(value) => setTheme(settings, value)}
      />
      <ChoiceCard
        title={t('language.label')}
        setting="locale"
        value={locale}
        options={LOCALES.map((value) => ({ value, label: t(`language.${value}`) }))}
        onChange={(value) => setLocale(settings, value)}
      />
    </SettingsScreen>
  )
}
