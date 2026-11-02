import { useId, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './primitives/alert-dialog'
import { Input } from './primitives/input'

/**
 * The one dialog that asks before an act that loses or hides work (R17): its title the specific
 * question ("Archive 3 songs?"), one line of what happens and whether it can be undone, Cancel the
 * default (Esc closes it), and the act's own name on its button, red where it destroys. Where the
 * act cannot be taken back at all (deleting the account, published content) the learner types
 * `typed` before the button wakes.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  body,
  action,
  onConfirm,
  destructive = true,
  cancel,
  typed,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  body: ReactNode
  /** The act, named: Archive, Delete, Sign out; never OK or Yes. */
  action: string
  onConfirm: () => void
  destructive?: boolean
  /** Cancel's own words where the act's page has them ("Keep it"). */
  cancel?: string
  /** What must be typed first: the account's email, the song's title. */
  typed?: string
}) {
  const { t } = useTranslation('common')
  const [written, setWritten] = useState('')
  const field = useId()
  const ready = typed === undefined || written.trim() === typed
  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setWritten('')
        onOpenChange(next)
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription render={<div />}>{body}</AlertDialogDescription>
        </AlertDialogHeader>
        {typed === undefined ? null : (
          <div className="flex flex-col gap-2">
            <label htmlFor={field} className="text-sm text-muted-foreground">
              {t('confirm.type', { expect: typed })}
            </label>
            <Input
              id={field}
              value={written}
              autoComplete="off"
              onChange={(event) => setWritten(event.target.value)}
            />
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>{cancel ?? t('confirm.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            variant={destructive ? 'destructive' : 'default'}
            disabled={!ready}
            onClick={() => {
              setWritten('')
              onConfirm()
              onOpenChange(false)
            }}
          >
            {action}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
