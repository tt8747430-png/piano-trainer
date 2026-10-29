import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { KeptVersion } from '@/shared/api/content-editing'
import type { NetResult } from '@/shared/api/network'
import { useLocale } from '@/shared/i18n'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/primitives/alert-dialog'
import { Button } from '@/shared/ui/primitives/button'

type Listed =
  | { readonly state: 'loading' }
  | { readonly state: 'failed'; readonly offline: boolean }
  | { readonly state: 'ready'; readonly versions: readonly KeptVersion[] }

/** The versions of a song's original kept, the newest first, each but the newest to restore. */
export function VersionsDialog({
  open,
  onOpenChange,
  title,
  busy,
  versions,
  onRestore,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  busy: boolean
  versions: () => Promise<NetResult<readonly KeptVersion[]>>
  onRestore: (version: string) => void
}) {
  const { t } = useTranslation('editor')
  const locale = useLocale()
  const [listed, setListed] = useState<Listed>({ state: 'loading' })
  useEffect(() => {
    if (!open) return
    let current = true
    void versions().then((result) => {
      if (!current) return
      setListed(
        result.ok
          ? { state: 'ready', versions: result.value }
          : { state: 'failed', offline: result.reason === 'offline' },
      )
    })
    return () => {
      current = false
      setListed({ state: 'loading' })
    }
  }, [open, versions])
  const date = new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' })
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('original.versionsTitle', { title })}</AlertDialogTitle>
          <AlertDialogDescription>{t('original.versionsBody')}</AlertDialogDescription>
        </AlertDialogHeader>
        {listed.state === 'loading' ? (
          <p className="text-sm text-muted-foreground">{t('original.versionsLoading')}</p>
        ) : listed.state === 'failed' ? (
          <p role="alert" className="text-sm">
            {t(listed.offline ? 'original.actionOffline' : 'original.actionFailed')}
          </p>
        ) : listed.versions.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('original.versionsNone')}</p>
        ) : (
          <ul className="flex max-h-72 flex-col divide-y divide-hairline overflow-y-auto">
            {listed.versions.map((kept, index) => (
              <li key={kept.version} className="flex items-center gap-3 py-2">
                <span className="min-w-0 flex-1 text-sm">
                  {t('original.publishedOn', { date: date.format(new Date(kept.publishedAt)) })}
                </span>
                {index === 0 ? (
                  <span className="text-sm text-muted-foreground">{t('original.latest')}</span>
                ) : (
                  <Button
                    variant="soft"
                    className="h-9"
                    disabled={busy}
                    onClick={() => onRestore(kept.version)}
                  >
                    {t('original.restore')}
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>{t('original.cancel')}</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
