import { useNavigate, useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { GraduationCap } from 'lucide-react'
import { useAccount, useLearnerView } from '@/shared/lib/account'
import { BackButton, Dropdown, RoundButton, ScreenHeader } from '@/shared/ui'
import { NotOpen } from '@/widgets/content-editor'
import { ADMIN_TABS, type AdminTab } from '../model/admin-tab'
import { AccountsTab } from './AccountsTab'
import { ActivityTab } from './ActivityTab'
import { ComponentsTab } from './ComponentsTab'
import { DraftsTab } from './DraftsTab'
import { ErrorsTab } from './ErrorsTab'
import { GroupsTab } from './GroupsTab'
import { OverviewTab } from './OverviewTab'
import { ReportsTab } from './ReportsTab'
import { SwitchesTab } from './SwitchesTab'

const TABS: Readonly<Record<AdminTab, () => React.JSX.Element>> = {
  overview: OverviewTab,
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
  const navigate = useNavigate()
  const learner = useLearnerView()
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('title')}
        back={<BackButton />}
        tools={
          learner.can ? (
            <RoundButton
              label={t('viewAsLearner')}
              icon={GraduationCap}
              onClick={() => {
                learner.set(true)
                void navigate({ to: '/' })
              }}
            />
          ) : undefined
        }
      />
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        {account?.role === 'admin' ? (
          <>
            {/* Nine sections: one menu at the content's head, never a second bar row (R29-P1). */}
            <Dropdown
              label={t('section')}
              value={tab}
              onChange={(each) =>
                void navigate({ to: '/admin', search: { tab: each }, replace: true })
              }
              options={ADMIN_TABS.map((each) => ({ value: each, label: t(`tabs.${each}`) }))}
              className="self-start"
            />
            <Tab />
          </>
        ) : (
          <NotOpen line={t('notAdmin')} />
        )}
      </div>
    </div>
  )
}
