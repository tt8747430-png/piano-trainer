import { useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useAccount } from '@/shared/lib/account'
import { BackButton, NavTab, NavTabs, ScreenHeader } from '@/shared/ui'
import { ADMIN_TABS, type AdminTab } from '../model/admin-tab'
import { AccountsTab } from './AccountsTab'
import { ActivityTab } from './ActivityTab'
import { ComponentsTab } from './ComponentsTab'
import { DraftsTab } from './DraftsTab'
import { ErrorsTab } from './ErrorsTab'
import { GroupsTab } from './GroupsTab'
import { ReportsTab } from './ReportsTab'
import { SwitchesTab } from './SwitchesTab'

const TABS: Readonly<Record<AdminTab, () => React.JSX.Element>> = {
  accounts: AccountsTab,
  groups: GroupsTab,
  switches: SwitchesTab,
  reports: ReportsTab,
  errors: ErrorsTab,
  activity: ActivityTab,
  drafts: DraftsTab,
  components: ComponentsTab,
}

/**
 * The Admin area (ADR 0116), an admin's alone: Accounts, Groups, Switches, Reports, Errors and Activity, a
 * tab each. Anyone else is told it is an admin's; the server refuses them all the same.
 */
export function AdminPage() {
  const { t } = useTranslation('admin')
  const { account } = useAccount()
  const { tab } = useSearch({ from: '/shell/admin' })
  const Tab = TABS[tab]
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('title')}
        back={<BackButton fallback={{ to: '/settings' }} />}
        tabs={
          account?.role === 'admin' ? (
            <NavTabs label={t('title')}>
              {ADMIN_TABS.map((each) => (
                <NavTab
                  key={each}
                  to="/admin"
                  search={{ tab: each }}
                  replace
                  current={each === tab}
                >
                  {t(`tabs.${each}`)}
                </NavTab>
              ))}
            </NavTabs>
          ) : undefined
        }
      />
      <div className="mx-auto w-full max-w-3xl">
        {account?.role === 'admin' ? <Tab /> : <p role="status">{t('notAdmin')}</p>}
      </div>
    </div>
  )
}
