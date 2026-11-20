import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { selectTheme, useSettings } from '@/entities/settings'
import { useMidiSummary } from '@/features/connect-midi'
import { useAccount } from '@/shared/lib/account'
import { useAppUpdate } from '@/shared/lib/app-update'
import { RowLink, SettingsGroup } from '@/shared/ui'
import { ADMIN_ENTRY, SETTINGS_GROUPS, type SettingsPageEntry } from '../model/sections'
import { AccountCard } from './AccountCard'

/** Settings' rows stand 52 with 8 over and under, as the board's `SROW` (a list row elsewhere is 48). */
export const SETTINGS_ROWS =
  '[&_[data-slot=settings-card]>*]:min-h-13 [&_[data-slot=settings-card]>*]:py-2'

/**
 * Settings' list on a phone (the Settings board, iOS's Settings): the account card first, then App,
 * Piano, Library and Support, each row its icon in a solid square and, where it has one, its value in
 * grey before the chevron (Appearance's theme, MIDI devices' connection, and beside General only an
 * update waiting); for an administrator, Administration last. Each row pushes its page; a laptop
 * shows the same places in its Settings dialog's nav. Only what concerns the whole app: a screen's
 * own settings are behind its gear (R29).
 */
export function SettingsList() {
  const { t } = useTranslation(['settings', 'admin'])
  const { account } = useAccount()
  const midi = useMidiSummary()
  const { status } = useAppUpdate()
  const theme = useSettings(selectTheme)
  const valueOf = (page: SettingsPageEntry): string | undefined => {
    if (page.to === '/settings/appearance') return t(`settings:theme.${theme}`)
    if (page.to === '/settings/connect-piano') return midi
    if (page.to === '/settings/general' && status === 'ready')
      return t('settings:about.update.ready')
    return undefined
  }
  return (
    <div className="flex flex-col gap-4">
      <AccountCard />
      {SETTINGS_GROUPS.map((group) => (
        <SettingsGroup
          key={group.title}
          flush
          title={t(`settings:${group.title}`)}
          className={SETTINGS_ROWS}
        >
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
        <SettingsGroup flush className={SETTINGS_ROWS}>
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
