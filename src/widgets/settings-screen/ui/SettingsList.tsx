import { Link } from '@tanstack/react-router'
import {
  Cable,
  HardDrive,
  LifeBuoy,
  Piano,
  ScrollText,
  Settings2,
  ShieldCheck,
  ShieldUser,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useMidiSummary } from '@/features/connect-midi'
import { useAccount, useLearnerView } from '@/shared/lib/account'
import { RowLink, SettingsGroup, SwitchRow } from '@/shared/ui'
import { AccountCard } from './AccountCard'
import { UpdateRows } from './UpdateRows'

/**
 * Settings' list, as iOS's reads: the account card first, then a row for each page, each its icon in
 * a coloured square (R21): General (General, Storage and backup); Piano (the on-screen piano, with the computer keys
 * inside it, and a connected piano); Help. Only what concerns the whole app: the Player's, the editor's and
 * each Practice page's settings are behind their own gear (R29 Decided 22–23); Help (How to use, Privacy, Terms) and the app's version;
 * and for an admin, the Admin area. A phone's Settings screen is this list alone; a laptop's keeps it
 * beside the page chosen (`SettingsScreen`), the page shown marked.
 */
export function SettingsList() {
  const { t } = useTranslation(['settings', 'admin'])
  const { account } = useAccount()
  const learner = useLearnerView()
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
        <RowLink
          title={t('pages.storage')}
          icon={HardDrive}
          paint="grass"
          render={<Link to="/settings/storage" />}
        />
      </SettingsGroup>
      <SettingsGroup flush title={t('groups.piano.label')}>
        <RowLink
          title={t('pages.onScreenPiano')}
          icon={Piano}
          paint="lilac"
          render={<Link to="/settings/on-screen-piano" />}
        />
        <RowLink
          title={t('pages.connectPiano')}
          icon={Cable}
          paint="sky"
          value={midi}
          render={<Link to="/settings/connect-piano" />}
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
      {learner.can ? (
        <SettingsGroup flush>
          {/* An editor's or admin's look at the app as a learner sees it (R29 B5): this session only. */}
          <SwitchRow
            label={t('learnerView.label')}
            info={t('learnerView.info')}
            checked={learner.on}
            onCheckedChange={learner.set}
          />
        </SettingsGroup>
      ) : null}
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
