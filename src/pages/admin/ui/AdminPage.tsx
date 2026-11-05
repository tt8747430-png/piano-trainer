import { Link, Navigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { LAPTOP, useMediaQuery } from '@/shared/lib'
import { useAccount } from '@/shared/lib/account'
import { RowLink, SettingsGroup } from '@/shared/ui'
import { NotOpen } from '@/widgets/content-editor'
import {
  ADMIN_PICTURES,
  ADMIN_SECTIONS,
  SettingsScreen,
  type AdminSection,
} from '@/widgets/settings-screen'

/** The sections in their two groups: the people and the content, then the logs and the tools. */
const GROUPS: readonly (readonly AdminSection[])[] = [
  ADMIN_SECTIONS.slice(0, 5),
  ADMIN_SECTIONS.slice(5),
]

/**
 * Administration (ADR 0116, R32), an administrator's alone: on a phone the list of its sections, each
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
        GROUPS.map((sections) => (
          <SettingsGroup key={sections.join()} flush>
            {sections.map((section) => (
              <RowLink
                key={section}
                title={t(`sections.${section}`)}
                icon={ADMIN_PICTURES[section].icon}
                paint={ADMIN_PICTURES[section].paint}
                render={<Link to="/admin/$section" params={{ section }} />}
              />
            ))}
          </SettingsGroup>
        ))
      ) : (
        <NotOpen line={t('notAdmin')} />
      )}
    </SettingsScreen>
  )
}
