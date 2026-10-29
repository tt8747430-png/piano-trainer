import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useProgressStoreApi } from '@/entities/progress'
import { BackupFields } from '@/features/backup-data'
import { KeepOnDeviceFields } from '@/features/keep-on-device'
import { resetProgress } from '@/features/reset-progress'
import { SettingsGroup as Group } from '@/shared/ui'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/ui/primitives/alert-dialog'
import { Button } from '@/shared/ui/primitives/button'
import { SettingsScreen } from './SettingsScreen'
import { SyncFields } from './SyncFields'

/**
 * Settings › Sync and data: the sync (ADR 0116), what this device keeps (and keeping it safe), Backup,
 * and resetting the progress.
 */
export function DataPage() {
  const { t } = useTranslation('settings')
  const progress = useProgressStoreApi()
  const [confirming, setConfirming] = useState(false)
  const reset = () => {
    resetProgress(progress)
    setConfirming(false)
  }
  return (
    <SettingsScreen title={t('groups.data.label')}>
      <Group title={t('sync.label')} info={t('sync.info')}>
        <SyncFields />
      </Group>
      <Group title={t('storage.label')} info={t('storage.info')}>
        <KeepOnDeviceFields />
      </Group>
      <Group title={t('backup.label')} info={t('backup.says')}>
        <BackupFields />
      </Group>
      <Group title={t('progress.label')}>
        <AlertDialog open={confirming} onOpenChange={setConfirming}>
          <AlertDialogTrigger render={<Button variant="destructive" className="self-start" />}>
            {t('progress.reset')}
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('progress.title')}</AlertDialogTitle>
              <AlertDialogDescription>{t('progress.body')}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('progress.cancel')}</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={reset}>
                {t('progress.confirm')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Group>
    </SettingsScreen>
  )
}
