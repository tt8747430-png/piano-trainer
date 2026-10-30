import { Link } from '@tanstack/react-router'
import {
  ArrowDown,
  ArrowDownLeft,
  ArrowDownRight,
  Cable,
  CloudUpload,
  Info,
  Languages,
  LifeBuoy,
  Piano,
  ScrollText,
  ShieldCheck,
  SunMoon,
  Tags,
  UserRound,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  FLOATING_PLACES,
  selectFloating,
  selectLocale,
  selectTheme,
  THEMES,
  useSettings,
  useSettingsStoreApi,
} from '@/entities/settings'
import { useMidiSummary } from '@/features/connect-midi'
import { setFloating, setLocale, setTheme } from '@/features/set-preference'
import { APP_BUILD } from '@/shared/config'
import { LOCALES } from '@/shared/i18n'
import { useAccount, useSync } from '@/shared/lib/account'
import {
  BackButton,
  ChoiceRow,
  Dropdown,
  RowFace,
  RowLink,
  ScreenHeader,
  SettingsGroup,
  SwitchRow,
  TileMark,
} from '@/shared/ui'

/** Each place the floating actions can stand, drawn as the corner of the screen's foot it is. */
const PLACE_ICON = { left: ArrowDownLeft, center: ArrowDown, right: ArrowDownRight } as const

/**
 * Settings, one grouped list as an app's settings read (memory-palaces'): the account first; then
 * General, its choices made in place (the language, the theme, where the floating buttons stand and
 * whether they say their names); Playing (the MIDI keyboard, the keyboard and recording); Sync and
 * data; Help (How to use, Privacy, Terms) and the app's version; and for an admin, the Admin area.
 */
export function SettingsPage() {
  const { t } = useTranslation(['settings', 'admin'])
  const { account } = useAccount()
  const { status } = useSync()
  const settings = useSettingsStoreApi()
  const locale = useSettings(selectLocale)
  const theme = useSettings(selectTheme)
  const floating = useSettings(selectFloating)
  const midi = useMidiSummary()
  const FloatingIcon = PLACE_ICON[floating.place]
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
          <ChoiceRow title={t('floating.place')} icon={FloatingIcon} paint="grass">
            <Dropdown
              label={t('floating.place')}
              bare
              align="end"
              value={floating.place}
              options={FLOATING_PLACES.map((value) => ({
                value,
                label: t(`floating.places.${value}`),
              }))}
              onChange={(place) => setFloating(settings, { place })}
            />
          </ChoiceRow>
          <SwitchRow
            icon={<TileMark icon={Tags} paint="grass" />}
            label={t('floating.labels')}
            info={t('floating.labelsNote')}
            checked={floating.labels}
            onCheckedChange={(labels) => setFloating(settings, { labels })}
            className="gap-3 border-0 pr-3 pl-2 font-semibold"
          />
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
        <SettingsGroup flush title={t('groups.data.label')}>
          <RowLink
            title={t('groups.data.label')}
            icon={CloudUpload}
            paint="grass"
            value={account ? t(`sync.state.${status.state}`) : undefined}
            render={<Link to="/settings/data" />}
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
            <RowFace title={t('about.version')} icon={Info} paint="sand" value={APP_BUILD} />
          </div>
        </SettingsGroup>
        {account?.role === 'admin' ? (
          <SettingsGroup flush>
            <RowLink
              title={t('admin:title')}
              detail={t('admin:line')}
              icon={ShieldCheck}
              paint="lilac"
              render={<Link to="/admin" />}
            />
          </SettingsGroup>
        ) : null}
      </div>
    </div>
  )
}

/** Signed out, Sign in and why; signed in, the learner and where their sync stands. */
function AccountCard() {
  const { t } = useTranslation('settings')
  const { account } = useAccount()
  const { status } = useSync()
  return (
    <nav aria-label={t('account.label')} className="card p-1.5">
      {account ? (
        <RowLink
          title={account.name || account.email}
          detail={`${account.email} · ${t(`sync.state.${status.state}`)}`}
          icon={UserRound}
          paint="yellow"
          render={<Link to="/settings/account" />}
        />
      ) : (
        <RowLink
          title={t('account.signIn')}
          detail={t('account.signInLine')}
          icon={UserRound}
          paint="yellow"
          render={<Link to="/account/sign-in" />}
        />
      )}
    </nav>
  )
}
