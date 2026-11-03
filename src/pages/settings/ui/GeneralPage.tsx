import { BookOpenText, Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  LESSON_READINGS,
  selectLessonReading,
  selectLocale,
  selectTheme,
  THEMES,
  useSettings,
  useSettingsStoreApi,
} from '@/entities/settings'
import { setLessonReading, setLocale, setTheme } from '@/features/set-preference'
import { LOCALES } from '@/shared/i18n'
import { ChoiceRow, Dropdown, PictureChoice, SettingsGroup, ThemePicture } from '@/shared/ui'
import { SettingsScreen } from '@/widgets/settings-screen'

/** Settings › General: the language and how a lesson reads, chosen in place; the theme as three
 * small screens (R21). */
export function GeneralPage() {
  const { t } = useTranslation(['settings', 'learn'])
  const settings = useSettingsStoreApi()
  const locale = useSettings(selectLocale)
  const theme = useSettings(selectTheme)
  const reading = useSettings(selectLessonReading)
  return (
    <SettingsScreen title={t('sections.general')}>
      <SettingsGroup flush>
        <ChoiceRow title={t('language.label')} icon={Languages} paint="sky" setting="locale">
          <Dropdown
            label={t('language.label')}
            bare
            align="end"
            value={locale}
            options={LOCALES.map((value) => ({ value, label: t(`language.${value}`) }))}
            onChange={(value) => setLocale(settings, value)}
          />
        </ChoiceRow>
        <ChoiceRow
          title={t('learn:reading.title')}
          icon={BookOpenText}
          paint="lilac"
          setting="lessonReading"
        >
          <Dropdown
            label={t('learn:reading.title')}
            bare
            align="end"
            value={reading}
            options={LESSON_READINGS.map((value) => ({
              value,
              label: t(`learn:reading.${value}`),
            }))}
            onChange={(value) => setLessonReading(settings, value)}
          />
        </ChoiceRow>
      </SettingsGroup>
      <SettingsGroup>
        <PictureChoice
          setting="theme"
          label={t('theme.label')}
          value={theme}
          options={THEMES.map((value) => ({
            value,
            label: t(`theme.${value}`),
            picture: <ThemePicture theme={value} />,
          }))}
          onChange={(value) => setTheme(settings, value)}
        />
      </SettingsGroup>
    </SettingsScreen>
  )
}
