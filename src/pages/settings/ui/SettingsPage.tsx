import { Link } from '@tanstack/react-router'
import {
  Cable,
  CloudUpload,
  BookOpenText,
  Info,
  Languages,
  LifeBuoy,
  Piano,
  ScrollText,
  ShieldCheck,
  ShieldUser,
  SunMoon,
} from 'lucide-react'
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
import { useMidiSummary } from '@/features/connect-midi'
import { setLessonReading, setLocale, setTheme } from '@/features/set-preference'
import { APP_BUILD } from '@/shared/config'
import { LOCALES } from '@/shared/i18n'
import { useAccount, useSync } from '@/shared/lib/account'
import {
  Avatar,
  BackButton,
  ChoiceRow,
  Dropdown,
  RowFace,
  RowLink,
  ScreenHeader,
  SettingsGroup,
} from '@/shared/ui'

/**
 * Settings, one grouped list as an app's settings read (memory-palaces', iOS's): the account card
 * first, the learner and their Sync and data (as an Apple ID's card holds iCloud); then General, its
 * choices made in place (the language, the theme, how a lesson reads); Playing (the MIDI keyboard, the keyboard and recording); Help (How to use,
 * Privacy, Terms) and the app's version; and for an admin, the Admin area.
 */
export function SettingsPage() {
  const { t } = useTranslation(['settings', 'admin', 'learn'])
  const { account } = useAccount()
  const settings = useSettingsStoreApi()
  const locale = useSettings(selectLocale)
  const theme = useSettings(selectTheme)
  const reading = useSettings(selectLessonReading)
  const midi = useMidiSummary()
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader title={t('title')} back={<BackButton fallback={{ to: '/profile' }} />} />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-7">
        <AccountCard />
        <SettingsGroup flush title={t('sections.general')}>
          <ChoiceRow title={t('language.label')} icon={Languages} paint="sky">
            <Dropdown
              label={t('language.label')}
              bare
              align="end"
              value={locale}
              options={LOCALES.map((value) => ({ value, label: t(`language.${value}`) }))}
              onChange={(value) => setLocale(settings, value)}
            />
          </ChoiceRow>
          <ChoiceRow title={t('theme.label')} icon={SunMoon} paint="sand">
            <Dropdown
              label={t('theme.label')}
              bare
              align="end"
              value={theme}
              options={THEMES.map((value) => ({ value, label: t(`theme.${value}`) }))}
              onChange={(value) => setTheme(settings, value)}
            />
          </ChoiceRow>
          <ChoiceRow title={t('learn:reading.title')} icon={BookOpenText} paint="lilac">
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
        <SettingsGroup flush title={t('groups.playing.label')}>
          <RowLink
            title={t('midi')}
            icon={Cable}
            paint="lilac"
            value={midi}
            render={<Link to="/settings/midi" />}
          />
          <RowLink
            title={t('sections.keyboard')}
            icon={Piano}
            paint="lilac"
            render={<Link to="/settings/playing" />}
          />
        </SettingsGroup>
        <SettingsGroup flush title={t('groups.help.label')}>
          <RowLink
            title={t('help.howToUse')}
            icon={LifeBuoy}
            paint="sky"
            render={<Link to="/settings/how-to-use" />}
          />
          <RowLink
            title={t('help.privacy')}
            icon={ShieldCheck}
            paint="grass"
            render={<Link to="/legal/privacy" />}
          />
          <RowLink
            title={t('help.terms')}
            icon={ScrollText}
            paint="sand"
            render={<Link to="/legal/terms" />}
          />
          <div
            className="flex min-h-16 items-center gap-3 py-2 pr-3 pl-2"
            title={t('about.madeWith')}
          >
            <RowFace title={t('about.version')} icon={Info} paint="lilac" value={APP_BUILD} />
          </div>
        </SettingsGroup>
        {account?.role === 'admin' ? (
          <SettingsGroup flush>
            <RowLink
              title={t('admin:title')}
              icon={ShieldUser}
              paint="lilac"
              render={<Link to="/admin" />}
            />
          </SettingsGroup>
        ) : null}
      </div>
    </div>
  )
}

/**
 * The account card: signed out, Sign in and why; signed in, the learner by their initial, leading
 * to their Account. Under it Sync and data, saying where the sync stands.
 */
function AccountCard() {
  const { t } = useTranslation('settings')
  const { account } = useAccount()
  const { status } = useSync()
  return (
    <nav aria-label={t('account.label')} className="flex flex-col card p-1.5">
      {account ? (
        <RowLink
          title={account.name || account.email}
          detail={account.email}
          mark={<Avatar name={account.name || account.email} size="row" />}
          render={<Link to="/settings/account" />}
        />
      ) : (
        <RowLink
          title={t('account.signIn')}
          mark={<Avatar name={null} size="row" />}
          render={<Link to="/account/sign-in" />}
        />
      )}
      <RowLink
        title={t('groups.data.label')}
        icon={CloudUpload}
        paint="grass"
        value={account ? t(`sync.state.${status.state}`) : undefined}
        render={<Link to="/settings/data" />}
      />
    </nav>
  )
}
