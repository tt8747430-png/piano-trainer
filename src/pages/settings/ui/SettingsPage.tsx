import { Link } from '@tanstack/react-router'
import { CloudUpload, LifeBuoy, Piano, SlidersHorizontal, UserRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAccount, useSync } from '@/shared/lib/account'
import { BackButton, RowLink, ScreenHeader } from '@/shared/ui'

/**
 * Settings, as an app's settings page reads: the account first (Sign in, or the learner signed in
 * with the sync's state), then a row to each group's page: Preferences, Playing, Sync and data, Help.
 */
export function SettingsPage() {
  const { t } = useTranslation('settings')
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader title={t('title')} back={<BackButton fallback={{ to: '/' }} />} />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <AccountCard />
        <nav aria-label={t('title')} className="flex flex-col card p-1.5">
          <RowLink
            title={t('groups.preferences.label')}
            detail={t('groups.preferences.line')}
            icon={SlidersHorizontal}
            paint="sand"
            render={<Link to="/settings/preferences" />}
          />
          <RowLink
            title={t('groups.playing.label')}
            detail={t('groups.playing.line')}
            icon={Piano}
            paint="lilac"
            render={<Link to="/settings/playing" />}
          />
          <RowLink
            title={t('groups.data.label')}
            detail={t('groups.data.line')}
            icon={CloudUpload}
            paint="grass"
            render={<Link to="/settings/data" />}
          />
          <RowLink
            title={t('groups.help.label')}
            detail={t('groups.help.line')}
            icon={LifeBuoy}
            paint="sky"
            render={<Link to="/settings/help" />}
          />
        </nav>
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
