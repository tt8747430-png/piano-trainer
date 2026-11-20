import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocale } from '@/shared/i18n'
import { useAccount } from '@/shared/lib/account'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/primitives/alert-dialog'
import { Button } from '@/shared/ui/primitives/button'
import { dateSaid } from '@/shared/lib'

/**
 * Signed in to an account that is to be deleted (ADR 0116): the learner keeps it (the deletion is
 * cancelled) or signs out and lets it go. Asked once each sign-in; offline, it waits for the next.
 */
export function DeletionGate() {
  const { t } = useTranslation('settings')
  const locale = useLocale()
  const { account, auth } = useAccount()
  const [purgeAfter, setPurgeAfter] = useState<string | null>(null)
  const id = account?.id
  useEffect(() => {
    if (id === undefined) return
    let current = true
    void auth.pendingDeletion().then((result) => {
      if (current && result.ok) setPurgeAfter(result.value)
    })
    return () => {
      current = false
      setPurgeAfter(null)
    }
  }, [auth, id])
  const keep = async () => {
    const result = await auth.cancelDeletion()
    if (result.ok) setPurgeAfter(null)
  }
  const date = purgeAfter === null ? '' : dateSaid(purgeAfter, locale)
  return (
    <AlertDialog open={account !== null && purgeAfter !== null}>
      {/* The AppLayers board's gate, the welcome's box: 22 corners, 20 about, a 20 title, then Sign out
          and Keep account side by side, Keep account the screen's one honey act. */}
      <AlertDialogContent className="gap-3 rounded-sheet p-5">
        <AlertDialogHeader className="gap-3">
          <AlertDialogTitle className="text-xl">{t('deletionGate.title')}</AlertDialogTitle>
          <AlertDialogDescription>{t('deletionGate.body', { date })}</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="mt-1.5 flex gap-2 *:h-11 *:min-w-0 *:flex-1 *:rounded-full *:text-base *:font-bold">
          <AlertDialogCancel onClick={() => void auth.signOut()}>
            {t('deletionGate.signOut')}
          </AlertDialogCancel>
          <Button onClick={() => void keep()}>{t('deletionGate.keep')}</Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
