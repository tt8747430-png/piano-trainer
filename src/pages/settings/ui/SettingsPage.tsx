import { useTranslation } from 'react-i18next'
import {
  type Locale,
  LOCALES,
  selectLocale,
  selectTheme,
  type Theme,
  THEMES,
  useSettings,
  useSettingsStoreApi,
} from '@/entities/settings'
import { setLocale, setTheme } from '@/features/set-preference'
import { ScreenTitle } from '@/shared/ui'
import { ChoiceGroup } from './ChoiceGroup'

const LOCALE_LABEL = {
  en: 'language.en',
  ru: 'language.ru',
} as const satisfies Record<Locale, string>

const THEME_LABEL = {
  system: 'theme.system',
  light: 'theme.light',
  dark: 'theme.dark',
} as const satisfies Record<Theme, string>

export function SettingsPage() {
  const { t } = useTranslation('settings')
  const store = useSettingsStoreApi()
  const locale = useSettings(selectLocale)
  const theme = useSettings(selectTheme)

  return (
    <>
      <ScreenTitle>{t('title')}</ScreenTitle>
      <div className="flex flex-col gap-6">
        <ChoiceGroup
          legend={t('language.label')}
          name="locale"
          value={locale}
          choices={LOCALES.map((value) => ({ value, label: t(LOCALE_LABEL[value]) }))}
          onChange={(value) => setLocale(store, value)}
        />
        <ChoiceGroup
          legend={t('theme.label')}
          name="theme"
          value={theme}
          choices={THEMES.map((value) => ({ value, label: t(THEME_LABEL[value]) }))}
          onChange={(value) => setTheme(store, value)}
        />
      </div>
    </>
  )
}
