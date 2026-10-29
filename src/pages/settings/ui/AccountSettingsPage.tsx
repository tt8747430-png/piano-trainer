import { Link } from '@tanstack/react-router'
import { KeyRound } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocale } from '@/shared/i18n'
import { useGoBack, useOnline } from '@/shared/lib'
import { authProblem, useAccount, type AuthProblem } from '@/shared/lib/account'
import { ButtonLink, FormField, RowLink, SettingsGroup as Group } from '@/shared/ui'
import {
  AlertDialog,
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

/**
 * Settings › Account (ADR 0116): the learner's name, their email, changing the password, signing
 * out (on this device, always), and deleting the account after its 30 days' grace.
 */
export function AccountSettingsPage() {
  const { t } = useTranslation('settings')
  const { account, auth } = useAccount()
  const locale = useLocale()
  const back = useGoBack({ to: '/settings' })
  const [scheduled, setScheduled] = useState<string | null>(null)
  if (!account)
    return (
      <SettingsScreen title={t('accountPage.title')}>
        <div className="flex flex-col gap-3 card p-5">
          <p role="status">
            {scheduled === null
              ? t('accountPage.signedOut')
              : t('accountPage.delete.scheduled', {
                  date: new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(
                    new Date(scheduled),
                  ),
                })}
          </p>
          <ButtonLink className="self-start" render={<Link to="/account/sign-in" />}>
            {t('account.signIn')}
          </ButtonLink>
        </div>
      </SettingsScreen>
    )
  return (
    <SettingsScreen title={t('accountPage.title')}>
      <div className="flex flex-col gap-6">
        <Group title={t('accountPage.title')}>
          <NameForm key={account.id} name={account.name} />
          <dl className="mt-4 flex flex-col gap-0.5">
            <dt className="text-sm text-muted-foreground">{t('accountPage.email')}</dt>
            <dd className="font-medium break-all">{account.email}</dd>
          </dl>
        </Group>
        <nav aria-label={t('accountPage.password')} className="card p-1.5">
          <RowLink
            title={t('accountPage.password')}
            icon={KeyRound}
            paint="sand"
            render={<Link to="/account/new-password" />}
          />
        </nav>
      </div>
      <div className="flex flex-col gap-6">
        <Group title={t('accountPage.signOut')} info={t('accountPage.signOutInfo')}>
          <Button
            variant="outline"
            className="self-start"
            onClick={() => void auth.signOut().then(back)}
          >
            {t('accountPage.signOut')}
          </Button>
        </Group>
        <Group title={t('accountPage.delete.label')} info={t('accountPage.delete.info')}>
          <DeleteAccount email={account.email} onScheduled={setScheduled} />
        </Group>
      </div>
    </SettingsScreen>
  )
}

/** The learner's name, saved to their account. */
function NameForm({ name: saved }: { name: string }) {
  const { t } = useTranslation(['settings', 'account'])
  const { auth } = useAccount()
  const online = useOnline()
  const [name, setName] = useState(saved)
  const [state, setState] = useState<'idle' | 'busy' | 'saved' | AuthProblem>('idle')
  const save = async () => {
    setState('busy')
    const result = await auth.updateName(name.trim())
    setState(result.ok ? 'saved' : authProblem(result))
  }
  const problem = state !== 'idle' && state !== 'busy' && state !== 'saved' ? state : null
  return (
    <form
      noValidate
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        void save()
      }}
    >
      <FormField
        label={t('accountPage.profile')}
        autoComplete="name"
        value={name}
        onChange={(event) => {
          setName(event.target.value)
          setState('idle')
        }}
        error={name.trim() === '' ? t('account:invalid.name') : undefined}
      />
      <div className="flex items-center gap-3">
        <Button
          type="submit"
          disabled={!online || state === 'busy' || name.trim() === '' || name.trim() === saved}
        >
          {t('accountPage.save')}
        </Button>
        <p role="status" className="text-sm text-muted-foreground">
          {state === 'saved' ? t('accountPage.saved') : ''}
        </p>
      </div>
      {problem === null ? null : (
        <p role="alert" className="text-sm text-destructive">
          {t(`account:problem.${problem}`)}
        </p>
      )}
    </form>
  )
}

/** Delete account: the learner types their email to confirm; the deletion is scheduled. */
function DeleteAccount({
  email,
  onScheduled,
}: {
  email: string
  onScheduled: (purgeAfter: string) => void
}) {
  const { t } = useTranslation(['settings', 'account'])
  const { auth } = useAccount()
  const online = useOnline()
  const [open, setOpen] = useState(false)
  const [typed, setTyped] = useState('')
  const [busy, setBusy] = useState(false)
  const [problem, setProblem] = useState<AuthProblem | null>(null)
  const matches = typed.trim().toLowerCase() === email.toLowerCase()
  const remove = async () => {
    setBusy(true)
    setProblem(null)
    const result = await auth.requestDeletion()
    setBusy(false)
    if (!result.ok) return setProblem(authProblem(result))
    setOpen(false)
    onScheduled(result.value.purgeAfter)
  }
  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        setTyped('')
        setProblem(null)
      }}
    >
      <AlertDialogTrigger
        render={<Button variant="destructive" className="self-start" disabled={!online} />}
      >
        {t('accountPage.delete.button')}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('accountPage.delete.title')}</AlertDialogTitle>
          <AlertDialogDescription>{t('accountPage.delete.body')}</AlertDialogDescription>
        </AlertDialogHeader>
        <FormField
          label={t('accountPage.delete.field')}
          type="email"
          autoComplete="off"
          value={typed}
          onChange={(event) => setTyped(event.target.value)}
        />
        {problem === null ? null : (
          <p role="alert" className="text-sm text-destructive">
            {t(`account:problem.${problem}`)}
          </p>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>{t('accountPage.delete.cancel')}</AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={!matches || busy || !online}
            onClick={() => void remove()}
          >
            {t('accountPage.delete.confirm')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
