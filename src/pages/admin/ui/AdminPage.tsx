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
} from '@/widgets/settings-screen'

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
      {account?.role === 'admin' ? (
        <SettingsGroup flush className={SETTINGS_ROWS}>
          {ADMIN_SECTIONS.map((section) => (
            <RowLink
              key={section}
              title={t(`sections.${section}`)}
              icon={ADMIN_PICTURES[section].icon}
              paint={ADMIN_PICTURES[section].paint}
              render={<Link to="/admin/$section" params={{ section }} />}
            />
          ))}
        </SettingsGroup>
      ) : (
        <NotOpen kind="admins" line={t('notAdmin')} />
      )}
    </SettingsScreen>
  )
}
