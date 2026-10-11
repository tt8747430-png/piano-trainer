import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocale } from '@/shared/i18n'
import { downloadFile, safeLocalStorage } from '@/shared/lib'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/primitives/alert-dialog'
import { Button } from '@/shared/ui/primitives/button'
import {
  backupName,
  hasOtherVersions,
  readBackup,
  restoreBackup,
  writeBackup,
  type Backup,
} from '../model/backup'

/** Asks the browser to keep the app's storage when it runs short of room; it may say no. */
const keepStorage = () => void navigator.storage?.persist?.().catch(() => {})

/**
 * Settings' backup: everything the learner made and practised saved as one file, and a file put back
 * in place of what is on the device, once they say so; the app opens again over it (`onRestored`).
 */
export function BackupFields({
  storage = safeLocalStorage(),
  onRestored = () => window.location.reload(),
}: {
  storage?: Storage
  onRestored?: () => void
}) {
  const { t } = useTranslation('settings')
  const locale = useLocale()
  const file = useRef<HTMLInputElement>(null)
  const [found, setFound] = useState<Backup | null>(null)
  const [failed, setFailed] = useState<'notBackup' | 'noRoom' | null>(null)

  const save = () => {
    const now = new Date()
    downloadFile(
      new TextEncoder().encode(writeBackup(storage, now)),
      backupName(now),
      'application/json',
    )
    keepStorage()
  }
  const open = async (chosen: File | undefined) => {
    if (!chosen) return
    const backup = readBackup(await chosen.text())
    setFailed(backup === null ? 'notBackup' : null)
    setFound(backup)
  }
  const restore = () => {
    if (!found) return
    if (!restoreBackup(storage, found)) {
      setFailed('noRoom')
      setFound(null)
      return
    }
    keepStorage()
    onRestored()
  }
  const made = found?.made ? new Date(found.made) : null
  const madeText =
    made && !Number.isNaN(made.getTime())
      ? made.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
      : null

  return (
    <>
      <p className="text-muted-foreground">{t('backup.says')}</p>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={save}>
          {t('backup.save')}
        </Button>
        <Button variant="outline" onClick={() => file.current?.click()}>
          {t('backup.restore')}
        </Button>
        <input
          ref={file}
          type="file"
          accept="application/json,.json"
          aria-hidden
          className="sr-only"
          tabIndex={-1}
          onChange={(event) => {
            void open(event.target.files?.[0])
            event.target.value = ''
          }}
        />
      </div>
      {failed ? (
        <p role="alert" className="text-destructive">
          {t(`backup.${failed}`)}
        </p>
      ) : null}
      <AlertDialog
        open={found !== null}
        onOpenChange={(opened) => (opened ? null : setFound(null))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('backup.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {madeText ? t('backup.body', { made: madeText }) : t('backup.bodyUndated')}
              {found && hasOtherVersions(found) ? ` ${t('backup.otherVersions')}` : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('backup.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={restore}>{t('backup.confirm')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
