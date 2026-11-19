import type { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { useAccount } from '@/shared/lib/account'
import { NotOpen } from '@/widgets/content-editor'
import {
  isAdminSection,
  SettingsScreen,
  useSettingsPath,
  type AdminSection,
} from '@/widgets/settings-screen'
import { AccountsTab } from './AccountsTab'
import { ActivityTab } from './ActivityTab'
import { ComponentsTab } from './ComponentsTab'
import { DraftsTab } from './DraftsTab'
import { ErrorsTab } from './ErrorsTab'
import { FeedbackTab } from './FeedbackTab'
import { AdminGroupPage, GroupsTab } from './GroupsTab'
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

const OWN_SCREEN: ReadonlySet<AdminSection> = new Set(['groups', 'flags'])

/**
 * One section of Administration (R32): a Settings page under its name, the sidebar beside it on a
 * laptop, Back to Administration's list on a phone. An administrator's alone. The route turns away
 * a section it does not know, so the first stands in only while its name is read.
 */
export function AdminSectionPage() {
  const { t } = useTranslation('admin')
  const { account } = useAccount()
  // Its address, or the dialog's on a laptop, where the page behind holds the route.
  const [name = '', item] = useSettingsPath()
    .replace(/^\/admin\//, '')
    .split('/')
  const section: AdminSection = isAdminSection(name) ? name : 'overview'
  if (section === 'groups' && item && account?.role === 'admin') return <AdminGroupPage id={item} />
  const Section = SECTIONS[section]
  // Groups and Feature flags hold their New in the pane's title row, so each draws its own screen.
  if (OWN_SCREEN.has(section) && account?.role === 'admin') return <Section />
  return (
    <SettingsScreen title={t(`sections.${section}`)}>
      {account?.role === 'admin' ? <Section /> : <NotOpen kind="admins" line={t('notAdmin')} />}
    </SettingsScreen>
  )
}
