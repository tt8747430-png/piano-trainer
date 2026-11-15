import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocale } from '@/shared/i18n'
import { useAccount } from '@/shared/lib/account'
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
  const date =
    purgeAfter === null
      ? ''
      : new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(new Date(purgeAfter))
  return (
    <AlertDialog open={account !== null && purgeAfter !== null}>
      {/* The AppLayers board's gate, the welcome's box: 22 corners, 24 above and 20 about, a 20 title. */}
      <AlertDialogContent className="gap-3 rounded-[22px] px-5 pt-6 pb-5">
        <AlertDialogHeader className="gap-3">
          <AlertDialogTitle className="text-xl">{t('deletionGate.title')}</AlertDialogTitle>
          <AlertDialogDescription>{t('deletionGate.body', { date })}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-1.5">
          <AlertDialogCancel onClick={() => void auth.signOut()}>
            {t('deletionGate.signOut')}
          </AlertDialogCancel>
          <Button onClick={() => void keep()}>{t('deletionGate.keep')}</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
