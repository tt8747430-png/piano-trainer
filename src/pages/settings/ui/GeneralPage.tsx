import { useTranslation } from 'react-i18next'
import {
  selectLocale,
  selectTheme,
  THEMES,
  useSettings,
  useSettingsStoreApi,
} from '@/entities/settings'
import { TypingSwitch } from '@/features/live-keyboard'
import { setLocale, setTheme } from '@/features/set-preference'
import { ShortcutsButton } from '@/features/shortcuts-help'
import { LOCALES } from '@/shared/i18n'
import { hasFinePointer } from '@/shared/lib'
import { SettingsGroup } from '@/shared/ui'
import { SettingsScreen } from '@/widgets/settings-screen'
import { AppearanceChoice, LanguageChoice } from './GeneralChoices'

/**
 * Settings › General (canvas 128, "these are very heavy to read"): Appearance as three small screens
 * (Match system split light and dark, Light, Dark), then Language as English | Русский, each its own
 * name, the chosen ringed in ink; on a computer, Computer keyboard last (the board's P_GENERAL): its
 * switch and Shortcuts, what the letters do behind its ⓘ (none on a phone, which has no letters to
 * play). How a lesson reads is the lesson's own Settings'; the library's bars are Settings › Library's.
 */
export function GeneralPage() {
  const { t } = useTranslation(['settings', 'common'])
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
      {hasFinePointer() ? (
        <SettingsGroup
          flush
          title={t('pages.computerKeys')}
          info={`${t('common:keyboardSettings.typingNote')} ${t('common:keyboardSettings.typingHint')}`}
        >
          <TypingSwitch />
          <ShortcutsButton />
        </SettingsGroup>
      ) : null}
    </SettingsScreen>
  )
}
