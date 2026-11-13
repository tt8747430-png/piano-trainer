import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { selectTheme, useSettings } from '@/entities/settings'
import { useMidiSummary } from '@/features/connect-midi'
import { APP_VERSION } from '@/shared/config'
import { useAccount } from '@/shared/lib/account'
import { useAppUpdate } from '@/shared/lib/app-update'
import { RowLink, SettingsGroup } from '@/shared/ui'
import {
  ADMIN_ENTRY,
  SETTINGS_GROUPS,
  type SettingsPageEntry,
  type SettingsPlace,
} from '../model/sections'
import { AccountCard } from './AccountCard'

/**
 * Settings' list (canvas 128, iOS's Settings): the account card first, then General, Piano, Library
 * and Support, each row its icon in a solid square and, where it has one, its value in grey before
 * the chevron (General's appearance, MIDI devices' connection, About's version or a waiting update);
 * for an administrator, Administration last. On a phone it is the screen, each row pushing its page;
 * on a laptop the same list is the pane beside the page, the page open lit (`place`). Only what
 * concerns the whole app: a screen's own settings are behind its gear (R29).
 */
export function SettingsList({ place = null }: { place?: SettingsPlace | null }) {
  const { t } = useTranslation(['settings', 'admin'])
  const { account } = useAccount()
  const midi = useMidiSummary()
  const { status } = useAppUpdate()
  const theme = useSettings(selectTheme)
  const valueOf = (page: SettingsPageEntry): string | undefined => {
    if (page.to === '/settings/general') return t(`settings:theme.${theme}`)
    if (page.to === '/settings/connect-piano') return midi
    if (page.to === '/settings/about')
      return status === 'ready' ? t('settings:about.update.ready') : APP_VERSION
    return undefined
  }
  return (
    <div className="flex flex-col gap-6">
      <AccountCard current={place?.kind === 'account'} />
      {SETTINGS_GROUPS.map((group) => (
        <SettingsGroup key={group.title} flush title={t(`settings:${group.title}`)}>
          {group.pages.map((page) => (
            <RowLink
              key={page.to}
              title={t(`settings:${page.title}`)}
              icon={page.icon}
              paint={page.paint}
              value={valueOf(page)}
              render={
                <Link
                  to={page.to}
                  data-current={place?.kind === 'page' && place.to === page.to ? '' : undefined}
                />
              }
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
            render={<Link to="/admin" data-current={place?.kind === 'admin' ? '' : undefined} />}
          />
        </SettingsGroup>
      ) : null}
    </div>
  )
}
