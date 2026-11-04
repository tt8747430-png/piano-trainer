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
 * Settings › Storage and backup (A15): what this device keeps (and keeping it safe), the recorded
 * grand piano for offline (A27), Backup, and resetting the progress and removing the piano's samples.
 * Nothing of the account: its Sync is on the Account.
 */
export function StoragePage() {
  const { t } = useTranslation('settings')
  const progress = useProgressStoreApi()
  const piano = usePianoSound()
  const [confirming, setConfirming] = useState<'progress' | 'piano' | null>(null)
  const pianoKept = piano.sound.state === 'known' && piano.sound.kept > 0
  return (
    <SettingsScreen title={t('pages.storage')}>
      <Group flush title={t('storage.label')} info={t('storage.info')}>
        <KeepOnDeviceFields />
      </Group>
      <PianoSoundGroup sound={piano.sound} onDownload={() => void piano.download()} />
      <Group flush title={t('backup.label')} info={t('backup.says')}>
        <BackupFields />
      </Group>
      <DangerGroup footnote={pianoKept ? t('pianoSound.footnote') : t('progress.body')}>
        <DangerRow title={t('progress.reset')} onClick={() => setConfirming('progress')} />
        {pianoKept ? (
          <DangerRow title={t('pianoSound.remove')} onClick={() => setConfirming('piano')} />
        ) : null}
        <ConfirmDialog
          open={confirming === 'progress'}
          onOpenChange={(open) => setConfirming(open ? 'progress' : null)}
          title={t('progress.title')}
          body={t('progress.body')}
          action={t('progress.confirm')}
          cancel={t('progress.cancel')}
          onConfirm={() => resetProgress(progress)}
        />
        <ConfirmDialog
          open={confirming === 'piano'}
          onOpenChange={(open) => setConfirming(open ? 'piano' : null)}
          title={t('pianoSound.title')}
          body={t('pianoSound.body')}
          action={t('pianoSound.confirm')}
          cancel={t('pianoSound.cancel')}
          onConfirm={() => void piano.remove()}
        />
      </DangerGroup>
    </SettingsScreen>
  )
}
