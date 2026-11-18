import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useProgressStoreApi } from '@/entities/progress'
import { BackupFields } from '@/features/backup-data'
import { KeepOnDeviceFields } from '@/features/keep-on-device'
import { resetProgress } from '@/features/reset-progress'
import { ConfirmDialog, DangerGroup, DangerRow, SettingsGroup as Group } from '@/shared/ui'
import { SettingsScreen } from '@/widgets/settings-screen'
import { usePianoSound } from '../model/use-piano-sound'
import { PianoSoundGroup, RemovePianoRow } from './PianoSoundGroup'

/**
 * Settings › Storage and backup (A15, the board's P_STORAGE; owner, 2026-11-18, "refactor all the
 * settings"): what this device keeps (and keeping it safe), then the backup, the way to keep it
 * safe, then the piano's sound kept for offline; the two losses together at the foot and apart,
 * Remove downloaded piano and Reset progress, each asked first. Nothing of the account: its Sync is
 * on the Account.
 */
export function StoragePage() {
  const { t } = useTranslation('settings')
  const progress = useProgressStoreApi()
  const [confirming, setConfirming] = useState(false)
  const piano = usePianoSound()
  return (
    <SettingsScreen title={t('pages.storage')}>
      <KeepOnDeviceFields piano={piano.sound.state === 'known' ? piano.sound.kept : 0} />
      <Group flush title={t('backup.label')}>
        <BackupFields />
      </Group>
      <PianoSoundGroup />
      <DangerGroup className="mt-4">
        <RemovePianoRow />
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
