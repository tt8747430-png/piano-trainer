import { Link } from '@tanstack/react-router'
import { KeyRound, LogIn, Mail, ShieldCheck, UserRoundPlus } from 'lucide-react'
import { useReducer, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocale } from '@/shared/i18n'
import { useOnline, useUp } from '@/shared/lib'
import { authProblem, useAccount, useLearnerProfile, useLearnerView } from '@/shared/lib/account'
import {
  Avatar,
  ConfirmDialog,
  DangerGroup,
  DangerRow,
  RowFace,
  RowLink,
  say,
  SettingsGroup as Group,
  SwitchRow,
} from '@/shared/ui'
import { SettingsScreen } from '@/widgets/settings-screen'
import { DELETE_CLOSED, deleteAccountMachine } from '../model/delete-account-machine'
import { SyncGroup } from './SyncGroup'

/**
 * Settings › Account (ADR 0116, A15), as memory-palaces' edit profile reads: the learner's picture at
 * its top; Profile, their name, saved once changed, their email and Change password; Sync, its one
 * home (where it stands, Sync now, what syncs); then, each red and alone (R25), Sign out (on this
 * device, asked first) and Delete account… last, the email typed to confirm, its 30 days' grace in
 * its footnote. An editor or administrator has Editorial access before Sync (R32). A guest is offered
 * Sign in and Create account.
 */
export function AccountSettingsPage() {
  const { t } = useTranslation(['settings', 'account'])
  const { account } = useAccount()
  const [scheduled, setScheduled] = useState<string | null>(null)
  return (
    <SettingsScreen title={t('accountPage.title')}>
      {account ? (
        <>
          <ProfileRow />
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
              render={<Link to="/settings/account/password" />}
            />
            <RowLink
              title={t('account:privacy.title')}
              icon={ShieldCheck}
              paint="grass"
              render={<Link to="/settings/privacy" />}
            />
          </Group>
          <EditorialAccess />
          <SyncGroup />
          <SignOut />
          <DeleteAccount onScheduled={setScheduled} />
        </>
      ) : (
        <Guest scheduled={scheduled} />
      )}
    </SettingsScreen>
  )
}

/**
 * Editorial access (R32): the role an editor or an administrator holds, and Preview as learner, the
 * app as a learner sees it for this session (R29 B5) — its one home, beside the role it depends on.
 * A learner sees neither. Its role is the account's real one, the preview hiding it from the rest.
 */
function EditorialAccess() {
  const { t } = useTranslation('settings')
  const learner = useLearnerView()
  if (!learner.can || learner.role === null) return null
  return (
    <Group flush title={t('accountPage.editorial')}>
      <dl className="flex min-h-16 items-center justify-between gap-4 px-4 py-2">
        <dt className="text-lg font-semibold">{t('accountPage.role')}</dt>
        <dd className="text-end text-muted-foreground">{t(`accountPage.roles.${learner.role}`)}</dd>
      </dl>
      <SwitchRow
        label={t('learnerView.label')}
        info={t('learnerView.info')}
        checked={learner.on}
        onCheckedChange={learner.set}
      />
    </Group>
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

/** The learner's picture and name, the page's first row: Edit profile (B1). */
function ProfileRow() {
  const { t } = useTranslation('account')
  const { account } = useAccount()
  const { state } = useLearnerProfile()
  const profile = state.kind === 'ready' ? state.profile : null
  const name = profile?.name || account?.name || account?.email || ''
  return (
    <Group flush>
      <RowLink
        mark={<Avatar name={name} picture={profile?.avatar ?? null} size="row" />}
        title={name}
        detail={t('editProfile.title')}
        render={<Link to="/settings/account/profile" />}
      />
    </Group>
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
function DeleteAccount({ onScheduled }: { onScheduled: (purgeAfter: string) => void }) {
  const { t } = useTranslation(['settings', 'account'])
  const { auth } = useAccount()
  const online = useOnline()
  const [state, send] = useReducer(deleteAccountMachine, DELETE_CLOSED)
  const remove = async () => {
    send({ type: 'confirm', online })
    if (!online) return say(t('account:problem.offline'))
    const result = await auth.requestDeletion()
    if (result.ok) {
      send({ type: 'deleted', purgeAfter: result.value.purgeAfter })
      return onScheduled(result.value.purgeAfter)
    }
    send({ type: 'refused', reason: result.reason })
    say(t(`account:problem.${authProblem(result)}`))
  }
  return (
    <DangerGroup footnote={t('accountPage.delete.footnote')}>
      <DangerRow
        title={t('accountPage.delete.button')}
        disabled={!online || state.kind === 'deleting'}
        reason={t('account:problem.offline')}
        onClick={() => send({ type: 'open' })}
      />
      <ConfirmDialog
        open={state.kind === 'confirm'}
        onOpenChange={(open) => send(open ? { type: 'open' } : { type: 'cancel' })}
        title={t('accountPage.delete.title')}
        body={t('accountPage.delete.body')}
        action={t('accountPage.delete.confirm')}
        cancel={t('accountPage.delete.cancel')}
        typed={t('accountPage.delete.word')}
        onConfirm={() => void remove()}
      />
    </DangerGroup>
  )
}
