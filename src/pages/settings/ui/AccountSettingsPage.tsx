import { Link } from '@tanstack/react-router'
import { KeyRound, LogIn, Mail, UserRoundPlus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocale } from '@/shared/i18n'
import { useOnline, useUp } from '@/shared/lib'
import { authProblem, useAccount, type AuthProblem } from '@/shared/lib/account'
import {
  Avatar,
  ConfirmDialog,
  DangerGroup,
  DangerRow,
  FormField,
  RowFace,
  RowLink,
  say,
  SettingsGroup as Group,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { SettingsScreen } from '@/widgets/settings-screen'
import { SyncGroup } from './SyncGroup'

/**
 * Settings › Account (ADR 0116, A15), as memory-palaces' edit profile reads: the learner's picture at
 * its top; Profile, their name, saved once changed, their email and Change password; Sync, its one
 * home (where it stands, Sync now, what syncs); then, each red and alone (R25), Sign out (on this
 * device, asked first) and Delete account… last, the email typed to confirm, its 30 days' grace in
 * its footnote. A guest is offered Sign in and Create an account.
 */
export function AccountSettingsPage() {
  const { t } = useTranslation('settings')
  const { account } = useAccount()
  const [scheduled, setScheduled] = useState<string | null>(null)
  return (
    <SettingsScreen title={t('accountPage.title')}>
      {account ? (
        <>
          <div className="flex flex-col items-center gap-3 pt-2 text-center">
            <Avatar name={account.name || account.email} size="hero" />
          </div>
          <Group title={t('accountPage.profileGroup')}>
            <NameForm key={account.id} name={account.name} />
          </Group>
          <Group flush>
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
          <SyncGroup />
          <SignOut />
          <DeleteAccount email={account.email} onScheduled={setScheduled} />
        </>
      ) : (
        <Guest scheduled={scheduled} />
      )}
    </SettingsScreen>
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

/** Sign out, on this device (R25): a red row in a group of its own, asking first, what stays said. */
function SignOut() {
  const { t } = useTranslation('settings')
  const { auth } = useAccount()
  const back = useUp()
  const [open, setOpen] = useState(false)
  return (
    <DangerGroup footnote={t('accountPage.signOutInfo')}>
      <DangerRow title={t('accountPage.signOut')} onClick={() => setOpen(true)} />
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={t('accountPage.signOutTitle')}
        body={t('accountPage.signOutInfo')}
        action={t('accountPage.signOut')}
        cancel={t('accountPage.signOutCancel')}
        onConfirm={() => void auth.signOut().then(back)}
      />
    </DangerGroup>
  )
}

/**
 * Delete account… (R25): the page's last group, a red row, its 30 days' grace in the footnote; the
 * learner types their email to confirm (R17), and the deletion is scheduled.
 */
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
  const remove = async () => {
    const result = await auth.requestDeletion()
    if (!result.ok) return say(t(`account:problem.${authProblem(result)}`))
    onScheduled(result.value.purgeAfter)
  }
  return (
    <DangerGroup footnote={t('accountPage.delete.footnote')}>
      <DangerRow
        title={t('accountPage.delete.button')}
        disabled={!online}
        reason={t('account:problem.offline')}
        onClick={() => setOpen(true)}
      />
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={t('accountPage.delete.title')}
        body={t('accountPage.delete.body')}
        action={t('accountPage.delete.confirm')}
        cancel={t('accountPage.delete.cancel')}
        typed={email}
        onConfirm={() => void remove()}
      />
    </DangerGroup>
  )
}
