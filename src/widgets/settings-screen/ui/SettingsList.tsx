import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useMidiSummary } from '@/features/connect-midi'
import { APP_VERSION } from '@/shared/config'
import { useAccount } from '@/shared/lib/account'
import { useAppUpdate } from '@/shared/lib/app-update'
import { RowLink, SettingsGroup } from '@/shared/ui'
import { ADMIN_ENTRY, SETTINGS_GROUPS, type SettingsPageEntry } from '../model/sections'
import { AccountCard } from './AccountCard'

/**
 * Settings' list on a phone (R32, iOS's Settings): the account card first, then General, Piano,
 * Library and Support, each row its icon in a coloured square and, where it has one, its value
 * before the chevron (MIDI devices' connection, About's version or a waiting update); for an
 * administrator, Administration last. Each row pushes its page, whose Back comes here. Only what
 * concerns the whole app: a screen's own settings are behind its gear (R29).
 */
export function SettingsList() {
  const { t } = useTranslation(['settings', 'admin'])
  const { account } = useAccount()
  const midi = useMidiSummary()
  const { status } = useAppUpdate()
  const valueOf = (page: SettingsPageEntry): string | undefined => {
    if (page.to === '/settings/connect-piano') return midi
    if (page.to === '/settings/about')
      return status === 'ready' ? t('settings:about.update.ready') : APP_VERSION
    return undefined
  }
  return (
    <div className="flex flex-col gap-7">
      <AccountCard />
      {SETTINGS_GROUPS.map((group) => (
        <SettingsGroup key={group.title} flush title={t(`settings:${group.title}`)}>
          {group.pages.map((page) => (
            <RowLink
              key={page.to}
              title={t(`settings:${page.title}`)}
              icon={page.icon}
              paint={page.paint}
              value={valueOf(page)}
              render={<Link to={page.to} />}
            />
          ))}
        </SettingsGroup>
      ))}
      {account?.role === 'admin' ? (
        <SettingsGroup flush>
          <RowLink
            title={t('admin:title')}
            icon={ADMIN_ENTRY.icon}
            paint={ADMIN_ENTRY.paint}
            render={<Link to="/admin" />}
          />
        </SettingsGroup>
      ) : null}
    </div>
  )
}
