import { Link } from '@tanstack/react-router'
import {
  Cable,
  CloudUpload,
  LifeBuoy,
  Piano,
  ScrollText,
  Settings2,
  ShieldCheck,
  ShieldUser,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useMidiSummary } from '@/features/connect-midi'
import { useAccount, useSync } from '@/shared/lib/account'
import { Avatar, RowLink, SettingsGroup } from '@/shared/ui'
import { UpdateRows } from './UpdateRows'

/**
 * Settings' list, as iOS's reads: the account card first, then a row for each page, each its icon in
 * a coloured square (R21): General; Playing; Help (How to use, Privacy, Terms) and the app's version;
 * and for an admin, the Admin area. A phone's Settings screen is this list alone; a laptop's keeps it
 * beside the page chosen (`SettingsScreen`), the page shown marked.
 */
export function SettingsList() {
  const { t } = useTranslation(['settings', 'admin'])
  const { account } = useAccount()
  const midi = useMidiSummary()
  return (
    <div className="flex flex-col gap-7 [&_a[aria-current=page]]:bg-muted">
      <AccountCard />
      <SettingsGroup flush title={t('sections.general')}>
        <RowLink
          title={t('sections.general')}
          icon={Settings2}
          paint="sky"
          render={<Link to="/settings/general" />}
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
      <SettingsGroup flush title={t('groups.help.label')} footnote={t('about.madeWith')}>
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
        <UpdateRows />
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
