import { Link } from '@tanstack/react-router'
import { KeyRound, LogIn, LogOut, Mail, Trash2, UserRoundPlus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocale } from '@/shared/i18n'
import { useGoBack, useOnline } from '@/shared/lib'
import { authProblem, useAccount, type AuthProblem } from '@/shared/lib/account'
import {
  Avatar,
  BackButton,
  FormField,
  RowButton,
  RowFace,
  RowLink,
  ScreenHeader,
  SettingsGroup as Group,
} from '@/shared/ui'
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
 * Settings › Account (ADR 0116), as memory-palaces' edit profile reads: the learner's picture at its
 * top; Profile, their name, saved once changed; Sign-in, their email and Change password; Sign out,
 * a row asking first (on this device, always); and Delete account…, a red row asking for their email,
 * its 30 days' grace told in the asking. A guest is offered Sign in and Create an account.
 */
export function AccountSettingsPage() {
  const { t } = useTranslation('settings')
  const { account } = useAccount()
  const [scheduled, setScheduled] = useState<string | null>(null)
  return (
    <div className="flex flex-col gap-2">
      <ScreenHeader
        title={t('accountPage.title')}
        back={<BackButton fallback={{ to: '/profile' }} />}
      />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-7">
        {account ? (
          <>
            <div className="flex flex-col items-center gap-3 pt-2 text-center">
              <Avatar name={account.name || account.email} size="hero" />
            </div>
            <Group title={t('accountPage.profileGroup')}>
              <NameForm key={account.id} name={account.name} />
            </Group>
            <Group flush title={t('accountPage.signInGroup')}>
              {/* The email under its name, broken anywhere a long one must be to fit a phone. */}
              <div className="flex min-h-16 items-center gap-3 py-2 pr-3 pl-2 wrap-anywhere">
                <RowFace
                  title={t('accountPage.email')}
                  icon={Mail}
                  paint="sky"
                  detail={account.email}
                />
              </div>
              <RowLink
                title={t('accountPage.password')}
                icon={KeyRound}
                paint="sand"
                render={<Link to="/account/new-password" />}
              />
            </Group>
            <Group flush>
              <SignOut />
            </Group>
            <Group flush>
              <DeleteAccount email={account.email} onScheduled={setScheduled} />
            </Group>
          </>
        ) : (
          <Guest scheduled={scheduled} />
        )}
      </div>
    </div>
  )
}

/** Signed out: the figure of a person, why (or when the account is to be deleted), Sign in and Create. */
function Guest({ scheduled }: { scheduled: string | null }) {
  const { t } = useTranslation('settings')
  const locale = useLocale()
  return (
    <>
      <div className="flex flex-col items-center gap-3 pt-2 text-center">
        <Avatar name={null} size="hero" />
        <p role="status" className="max-w-sm text-pretty text-muted-foreground">
          {scheduled === null
            ? t('accountPage.signedOut')
            : t('accountPage.delete.scheduled', {
                date: new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(
                  new Date(scheduled),
                ),
              })}
        </p>
      </div>
      <Group flush>
        <RowLink
          title={t('accountPage.signIn')}
          icon={LogIn}
          paint="yellow"
          render={<Link to="/account/sign-in" />}
        />
        <RowLink
          title={t('accountPage.create')}
          icon={UserRoundPlus}
          paint="grass"
          render={<Link to="/account/create" />}
        />
      </Group>
    </>
  )
}

/** The learner's name, saved to their account: Save beside it once it is changed. */
function NameForm({ name: saved }: { name: string }) {
  const { t } = useTranslation(['settings', 'account'])
  const { auth } = useAccount()
  const online = useOnline()
  const [name, setName] = useState(saved)
  const [last, setLast] = useState(saved)
  const [state, setState] = useState<'idle' | 'busy' | 'saved' | AuthProblem>('idle')
  const save = async () => {
    setState('busy')
    const result = await auth.updateName(name.trim())
    if (result.ok) setLast(name.trim())
    setState(result.ok ? 'saved' : authProblem(result))
  }
  const changed = name.trim() !== '' && name.trim() !== last
  const problem = state !== 'idle' && state !== 'busy' && state !== 'saved' ? state : null
  return (
    <form
      noValidate
      className="flex flex-col gap-2"
      onSubmit={(event) => {
        event.preventDefault()
        if (changed) void save()
      }}
    >
      <div className="flex items-end gap-2">
        <FormField
          className="min-w-0 flex-1"
          label={t('accountPage.profile')}
          autoComplete="name"
          value={name}
          onChange={(event) => {
            setName(event.target.value)
            setState('idle')
          }}
          error={name.trim() === '' ? t('account:invalid.name') : undefined}
        />
        {changed ? (
          <Button type="submit" size="lg" className="h-12" disabled={!online || state === 'busy'}>
            {t('accountPage.save')}
          </Button>
        ) : null}
      </div>
      <p role="status" className="text-sm text-muted-foreground empty:hidden">
        {state === 'saved' ? t('accountPage.saved') : ''}
      </p>
      {problem === null ? null : (
        <p role="alert" className="text-sm text-destructive">
          {t(`account:problem.${problem}`)}
        </p>
      )}
    </form>
  )
}

/** Sign out, on this device: a row, asking first and saying what stays. */
function SignOut() {
  const { t } = useTranslation('settings')
  const { auth } = useAccount()
  const back = useGoBack({ to: '/settings' })
  const [open, setOpen] = useState(false)
  return (
    <>
      <RowButton
        title={t('accountPage.signOut')}
        icon={LogOut}
        paint="sand"
        onClick={() => setOpen(true)}
      />
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('accountPage.signOutTitle')}</AlertDialogTitle>
            <AlertDialogDescription>{t('accountPage.signOutInfo')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('accountPage.signOutCancel')}</AlertDialogCancel>
            <Button
              onClick={() => {
                setOpen(false)
                void auth.signOut().then(back)
              }}
            >
              {t('accountPage.signOut')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

/** Delete account…: a red row; the learner types their email to confirm; the deletion is scheduled. */
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
    <>
      <RowButton
        title={t('accountPage.delete.button')}
        icon={Trash2}
        paint="sand"
        destructive
        disabled={!online}
        reason={t('account:problem.offline')}
        onClick={() => setOpen(true)}
      />
      <AlertDialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          setTyped('')
          setProblem(null)
        }}
      >
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
    </>
  )
}
