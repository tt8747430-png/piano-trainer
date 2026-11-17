import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useProgressStoreApi } from '@/entities/progress'
import { BackupFields } from '@/features/backup-data'
import { KeepOnDeviceFields } from '@/features/keep-on-device'
import { resetProgress } from '@/features/reset-progress'
import { ConfirmDialog, DangerGroup, DangerRow, SettingsGroup as Group } from '@/shared/ui'
import { SettingsScreen } from '@/widgets/settings-screen'
import { usePianoSound } from '../model/use-piano-sound'
import { PianoSoundGroup } from './PianoSoundGroup'

/**
 * Settings › Storage and backup (A15, the board's P_STORAGE): what this device keeps (and keeping it
 * safe), the piano's sound kept for offline, Backup, and resetting the progress; nothing of the
 * account: its Sync is on the Account.
 */
export function StoragePage() {
  const { t } = useTranslation('settings')
  const progress = useProgressStoreApi()
  const [confirming, setConfirming] = useState(false)
  const piano = usePianoSound()
  return (
    <SettingsScreen title={t('pages.storage')}>
      <KeepOnDeviceFields piano={piano.sound.state === 'known' ? piano.sound.kept : 0} />
      <PianoSoundGroup />
      <Group flush title={t('backup.label')} info={t('backup.says')}>
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
