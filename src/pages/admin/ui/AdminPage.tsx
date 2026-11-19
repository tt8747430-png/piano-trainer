import { Link, Navigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { LAPTOP, useMediaQuery } from '@/shared/lib'
import { useAccount } from '@/shared/lib/account'
import { RowLink, SettingsGroup } from '@/shared/ui'
import { NotOpen } from '@/widgets/content-editor'
import {
  ADMIN_PICTURES,
  ADMIN_SECTIONS,
  SETTINGS_ROWS,
  SettingsScreen,
  type AdminSection,
} from '@/widgets/settings-screen'
import { useOverview } from '../model/use-overview'

/**
 * The sections, one group of Settings' rows; Content reports, Error log and Drafts carry what waits
 * in them (the open reports, the week's errors, the unpublished drafts), as the Admin board.
 */
function Sections() {
  const { t } = useTranslation('admin')
  const { loaded } = useOverview()
  const waiting = (section: AdminSection): string | undefined => {
    if (loaded.kind !== 'ready') return undefined
    const count =
      section === 'reports'
        ? loaded.value.reports
        : section === 'errors'
          ? loaded.value.errorsThisWeek
          : section === 'drafts'
            ? loaded.value.unpublished
            : 0
    return count > 0 ? String(count) : undefined
  }
  return (
    <SettingsGroup flush className={SETTINGS_ROWS}>
      {ADMIN_SECTIONS.map((section) => (
        <RowLink
          key={section}
          title={t(`sections.${section}`)}
          icon={ADMIN_PICTURES[section].icon}
          paint={ADMIN_PICTURES[section].paint}
          value={waiting(section)}
          render={<Link to="/admin/$section" params={{ section }} />}
        />
      ))}
    </SettingsGroup>
  )
}

/**
 * Administration (ADR 0116, R32), an administrator's alone: on a phone the list of its sections, one group of Settings' 52 rows as the Admin board, each
 * pushing its page; on a laptop the sidebar lists them, so this opens the first. Anyone else is told
 * it is an administrator's; the server refuses them all the same.
 */
export function AdminPage() {
  const { t } = useTranslation('admin')
  const { account } = useAccount()
  const wide = useMediaQuery(LAPTOP)
  if (account?.role === 'admin' && wide)
    return <Navigate to="/admin/$section" params={{ section: 'overview' }} replace />
  return (
    <SettingsScreen title={t('title')}>
      {account?.role === 'admin' ? <Sections /> : <NotOpen kind="admins" line={t('notAdmin')} />}
    </SettingsScreen>
  )
}
