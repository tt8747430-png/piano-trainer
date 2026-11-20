import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ReportReason } from '@/shared/api/public-library'
import { useOnline } from '@/shared/lib'
import { useAccount } from '@/shared/lib/account'
import { usePublicLibrary } from '@/shared/lib/public-library'
import { ButtonLink, ChoiceChips } from '@/shared/ui'
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
import { Textarea } from '@/shared/ui/primitives/textarea'

const REASONS = [
  'not-theirs',
  'offensive',
  'spam',
  'broken',
] as const satisfies readonly ReportReason[]
const NOTE_MAX = 1000

/** Reporting a Public library song to the editors: why, and a note; signed out, Sign in. */
export function ReportDialog({
  itemId,
  open,
  onOpenChange,
}: {
  itemId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { t } = useTranslation('songs')
  const library = usePublicLibrary()
  const { account } = useAccount()
  const online = useOnline()
  const [reason, setReason] = useState<ReportReason>('not-theirs')
  const [note, setNote] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle')
  const send = async () => {
    setState('sending')
    const result = await library.report(itemId, reason, note.trim())
    setState(result.ok ? 'sent' : 'failed')
  }
  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) setState('idle')
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('public.reportTitle')}</AlertDialogTitle>
          <AlertDialogDescription>
            {account ? t('public.reportBody') : t('public.signInToReport')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {account && state !== 'sent' ? (
          <div className="flex flex-col gap-3">
            <ChoiceChips
              label={t('public.reasons.label')}
              value={reason}
              options={REASONS.map((value) => ({ value, label: t(`public.reasons.${value}`) }))}
              onChange={setReason}
            />
            <label className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">{t('public.note')}</span>
              <Textarea
                value={note}
                maxLength={NOTE_MAX}
                onChange={(event) => setNote(event.target.value)}
              />
            </label>
          </div>
        ) : null}
        <p role="status" className="text-sm empty:hidden">
          {state === 'sent'
            ? t('public.reported')
            : state === 'failed'
              ? online
                ? t('public.failed')
                : t('public.offline')
              : ''}
        </p>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('public.cancel')}</AlertDialogCancel>
          {!account ? (
            <ButtonLink render={<Link to="/account/sign-in" />}>{t('public.signIn')}</ButtonLink>
          ) : state === 'sent' ? null : (
            <Button disabled={state === 'sending' || !online} onClick={() => void send()}>
              {t('public.send')}
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
