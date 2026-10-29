import { ArrowDown, ArrowDownLeft, ArrowDownRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  FLOATING_PLACES,
  selectFloating,
  selectLocale,
  selectTheme,
  THEMES,
  useSettings,
  useSettingsStoreApi,
  type Theme,
} from '@/entities/settings'
import { setFloating, setLocale, setTheme } from '@/features/set-preference'
import { LOCALES, type Locale } from '@/shared/i18n'
import {
  Segmented,
  SettingField,
  SettingRows,
  SettingsGroup as Group,
  SwitchRow,
} from '@/shared/ui'
import { SettingsScreen } from './SettingsScreen'

const LOCALE_LABEL = { en: 'language.en', ru: 'language.ru' } as const satisfies Record<
  Locale,
  string
>
const THEME_LABEL = {
  system: 'theme.system',
  light: 'theme.light',
  dark: 'theme.dark',
} as const satisfies Record<Theme, string>

/** Each place the floating actions can stand, drawn as the corner of the screen's foot it is. */
const PLACE_ICON = {
  left: ArrowDownLeft,
  center: ArrowDown,
  right: ArrowDownRight,
} as const

/** Settings › Preferences: the language, the theme, and how the screens look (ADR 0096). */
export function PreferencesPage() {
  const { t } = useTranslation('settings')
  const settings = useSettingsStoreApi()
  const locale = useSettings(selectLocale)
  const theme = useSettings(selectTheme)
  const floating = useSettings(selectFloating)
  return (
    <SettingsScreen title={t('groups.preferences.label')}>
      <Group title={t('language.label')}>
        <Segmented
          label={t('language.label')}
          value={locale}
          options={LOCALES.map((value) => ({ value, label: t(`${LOCALE_LABEL[value]}`) }))}
          onChange={(value) => setLocale(settings, value)}
        />
      </Group>
      <Group title={t('theme.label')}>
        <Segmented
          label={t('theme.label')}
          value={theme}
          options={THEMES.map((value) => ({ value, label: t(`${THEME_LABEL[value]}`) }))}
          onChange={(value) => setTheme(settings, value)}
        />
      </Group>
      <Group title={t('appearance.label')}>
        <SettingRows>
          <SettingField label={t('floating.place')} info={t('floating.placeInfo')}>
            <Segmented
              label={t('floating.place')}
              value={floating.place}
              options={FLOATING_PLACES.map((value) => {
                const Icon = PLACE_ICON[value]
                return {
                  value,
                  label: t(`floating.places.${value}`),
                  icon: <Icon aria-hidden className="size-5" />,
                }
              })}
              onChange={(place) => setFloating(settings, { place })}
            />
          </SettingField>
          <SwitchRow
            label={t('floating.labels')}
            info={t('floating.labelsNote')}
            checked={floating.labels}
            onCheckedChange={(labels) => setFloating(settings, { labels })}
          />
        </SettingRows>
      </Group>
    </SettingsScreen>
  )
}
