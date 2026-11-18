import { useTranslation } from 'react-i18next'
import { selectLocale, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { TypingSwitch } from '@/features/live-keyboard'
import { setLocale } from '@/features/set-preference'
import { ShortcutsButton } from '@/features/shortcuts-help'
import { LOCALES } from '@/shared/i18n'
import { hasFinePointer } from '@/shared/lib'
import { GroupRow, GroupSegmented, Segmented, SettingsGroup } from '@/shared/ui'
import { SettingsScreen, UpdateRows, useSettingsDialog } from '@/widgets/settings-screen'

/**
 * Settings › General, placed as Apple places it and ordered by use (owner, 2026-11-18, "refactor all
 * the settings"; the board's P_GENERAL): Language first, one segmented English | Русский, the shape
 * Touch and Pedal wear (under its name on a phone, at the App language row's end in the laptop's
 * dialog); on a computer, Computer keyboard, its switch and Shortcuts, what the letters do behind its
 * ⓘ (none on a phone, which has no letters to play); Software update, the rarest, last. The theme
 * is Appearance's own place.
 */
export function GeneralPage() {
  const { t } = useTranslation(['settings', 'common'])
  const settings = useSettingsStoreApi()
  const locale = useSettings(selectLocale)
  const inDialog = useSettingsDialog() !== null
  const languages = LOCALES.map((value) => ({ value, label: t(`language.${value}`) }))
  return (
    <SettingsScreen title={t('pages.general')}>
      {inDialog ? (
        <SettingsGroup flush title={t('language.label')}>
          <GroupRow label={t('language.app')} setting="locale">
            <div className="w-60 shrink-0">
              <Segmented
                label={t('language.app')}
                value={locale}
                options={languages}
                onChange={(value) => setLocale(settings, value)}
              />
            </div>
          </GroupRow>
        </SettingsGroup>
      ) : (
        <SettingsGroup flush>
          <GroupSegmented
            setting="locale"
            label={t('language.label')}
            value={locale}
            options={languages}
            onChange={(value) => setLocale(settings, value)}
          />
        </SettingsGroup>
      )}
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
      <SettingsGroup flush title={t('about.update.label')}>
        <UpdateRows />
      </SettingsGroup>
    </SettingsScreen>
  )
}
