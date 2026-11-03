import { RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLocale } from '@/shared/i18n'
import { useOnline } from '@/shared/lib'
import { useSync } from '@/shared/lib/account'
import { RowFace, SettingsGroup } from '@/shared/ui'
import { SyncNowRow } from './SyncNowRow'

/**
 * The Account's Sync (ADR 0116, A15), its one home: where it stands (up to date, the changes waiting,
 * when it last got through), Sync now, and what syncs in the footnote.
 */
export function SyncGroup() {
  const { t } = useTranslation('settings')
  const locale = useLocale()
  const online = useOnline()
  const { status } = useSync()
  const when =
    status.lastSynced === null
      ? undefined
      : t('sync.last', {
          when: new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(
            new Date(status.lastSynced),
          ),
        })
  const state = online ? status.state : 'offline'
  return (
    <SettingsGroup flush title={t('sync.label')} footnote={t('sync.what')}>
      <div role="status" className="flex min-h-16 items-center gap-3 py-2 pr-3 pl-2">
        <RowFace
          title={t(`sync.state.${state}`)}
          detail={
            status.waiting > 0 && state !== 'syncing'
              ? t('sync.waiting', { count: status.waiting })
              : when
          }
          icon={RefreshCw}
          paint="grass"
        />
      </div>
      <SyncNowRow />
    </SettingsGroup>
  )
}
