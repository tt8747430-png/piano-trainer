import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useProgressStoreApi } from '@/entities/progress'
import { BackupFields } from '@/features/backup-data'
import { KeepOnDeviceFields } from '@/features/keep-on-device'
import { resetProgress } from '@/features/reset-progress'
import { ConfirmDialog, DangerGroup, DangerRow, SettingsGroup as Group } from '@/shared/ui'
import { SettingsScreen } from '@/widgets/settings-screen'

/**
 * Settings › Storage and backup (A15): what this device keeps (and keeping it safe), Backup, and
 * resetting the progress. Nothing of the account: its Sync is on the Account.
 */
export function StoragePage() {
  const { t } = useTranslation('settings')
  const progress = useProgressStoreApi()
  const [confirming, setConfirming] = useState(false)
  return (
    <SettingsScreen title={t('pages.storage')}>
      <Group title={t('storage.label')} info={t('storage.info')}>
        <KeepOnDeviceFields />
      </Group>
      <Group title={t('backup.label')} info={t('backup.says')}>
        <BackupFields />
      </Group>
      <DangerGroup footnote={t('progress.body')}>
        <DangerRow title={t('progress.reset')} onClick={() => setConfirming(true)} />
        <ConfirmDialog
          open={confirming}
          onOpenChange={setConfirming}
          title={t('progress.title')}
          body={t('progress.body')}
          action={t('progress.confirm')}
          cancel={t('progress.cancel')}
          onConfirm={() => resetProgress(progress)}
        />
      </DangerGroup>
    </SettingsScreen>
  )
}
