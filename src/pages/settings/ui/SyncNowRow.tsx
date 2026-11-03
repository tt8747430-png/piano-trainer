import { useTranslation } from 'react-i18next'
import { useOnline } from '@/shared/lib'
import { useSync } from '@/shared/lib/account'
import { ActionRow } from '@/shared/ui'

/** Sync now (R24): a row that does something, greyed offline or while a sync runs. */
export function SyncNowRow() {
  const { t } = useTranslation(['settings', 'account'])
  const online = useOnline()
  const { status, syncNow } = useSync()
  return (
    <ActionRow
      title={t('sync.now')}
      disabled={!online || status.state === 'syncing'}
      reason={online ? undefined : t('account:problem.offline')}
      onClick={() => void syncNow()}
    />
  )
}
