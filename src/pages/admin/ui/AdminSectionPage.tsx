import { useParams } from '@tanstack/react-router'
import type { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { useAccount } from '@/shared/lib/account'
import { NotOpen } from '@/widgets/content-editor'
import { isAdminSection, SettingsScreen, type AdminSection } from '@/widgets/settings-screen'
import { AccountsTab } from './AccountsTab'
import { ActivityTab } from './ActivityTab'
import { ComponentsTab } from './ComponentsTab'
import { DraftsTab } from './DraftsTab'
import { ErrorsTab } from './ErrorsTab'
import { FeedbackTab } from './FeedbackTab'
import { GroupsTab } from './GroupsTab'
import { OverviewTab } from './OverviewTab'
import { ReportsTab } from './ReportsTab'
import { SwitchesTab } from './SwitchesTab'

const SECTIONS: Readonly<Record<AdminSection, () => JSX.Element>> = {
  overview: OverviewTab,
  accounts: AccountsTab,
  groups: GroupsTab,
  flags: SwitchesTab,
  reports: ReportsTab,
  feedback: FeedbackTab,
  errors: ErrorsTab,
  activity: ActivityTab,
  drafts: DraftsTab,
  components: ComponentsTab,
}

/**
 * One section of Administration (R32): a Settings page under its name, the sidebar beside it on a
 * laptop, Back to Administration's list on a phone. An administrator's alone. The route turns away
 * a section it does not know, so the first stands in only while its name is read.
 */
export function AdminSectionPage() {
  const { t } = useTranslation('admin')
  const { account } = useAccount()
  const { section: name } = useParams({ from: '/shell/admin/$section' })
  const section: AdminSection = isAdminSection(name) ? name : 'overview'
  const Section = SECTIONS[section]
  return (
    <SettingsScreen title={t(`sections.${section}`)}>
      {account?.role === 'admin' ? <Section /> : <NotOpen line={t('notAdmin')} />}
    </SettingsScreen>
  )
}
