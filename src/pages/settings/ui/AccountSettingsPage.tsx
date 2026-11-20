import { Link } from '@tanstack/react-router'
import { useReducer, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocale } from '@/shared/i18n'
import { dateSaid, useOnline } from '@/shared/lib'
import { authProblem, useAccount, useLearnerProfile, useLearnerView } from '@/shared/lib/account'
import {
  Avatar,
  ConfirmDialog,
  DangerGroup,
  DangerRow,
  GroupRow,
  RowLink,
  say,
  SettingsGroup as Group,
  SwitchRow,
  ThingHead,
} from '@/shared/ui'
import { SettingsScreen } from '@/widgets/settings-screen'
import { DELETE_CLOSED, deleteAccountMachine } from '../model/delete-account-machine'
import { SyncGroup } from './SyncGroup'

/**
 * Settings › Account (ADR 0116, A15), in the shape every Settings page has (owner, 2026-11-18,
 * "refactor the account settings and also refactor all the settings"; the board's ACC_IN): who it is
 * at the head (the 64 picture, the name, the email), then Profile (Edit profile, Privacy), Sign-in and
 * security (Email ›, Change password ›), Sync, Editorial access for an editor (R32), Sign out (asked
 * first) and Delete account… alone 16 further down, the email typed to confirm. A guest is told they
 * are not signed in and why it matters, then Sign in and Create account.
 */
export function AccountSettingsPage() {
  const { t } = useTranslation(['settings', 'account'])
  const { account } = useAccount()
  const [scheduled, setScheduled] = useState<string | null>(null)
  const privacy = usePrivacyValue()
  return (
    <SettingsScreen title={t('accountPage.title')}>
      {account ? (
        <>
          <AccountHead />
          <Group flush title={t('accountPage.profile')}>
            <RowLink
              title={t('accountPage.editProfile')}
              render={<Link to="/settings/account/profile" />}
            />
            <RowLink
              title={t('accountPage.privacy')}
              value={privacy}
              render={<Link to="/settings/privacy" />}
            />
          </Group>
          <Group flush title={t('accountPage.security')}>
            <RowLink
              title={t('accountPage.email')}
              value={account.email}
              render={<Link to="/settings/account/email" />}
            />
            <RowLink
              title={t('accountPage.password')}
              render={<Link to="/settings/account/password" />}
            />
          </Group>
          <SyncGroup />
          <EditorialAccess />
          <SignOut />
          <DeleteAccount onScheduled={setScheduled} />
        </>
      ) : (
        <Guest scheduled={scheduled} />
      )}
    </SettingsScreen>
  )
}

/** Privacy's value at its row's end: whether the profile shows, read from the server's `public`. */
function usePrivacyValue(): string | undefined {
  const { t } = useTranslation('account')
  const { state } = useLearnerProfile()
  if (state.kind !== 'ready') return undefined
  return t(state.profile.public ? 'privacy.shown' : 'privacy.hidden')
}

/** Who the account is, the page's head (the board's THINGHEAD): the 64 picture, the name, the email. */
function AccountHead() {
  const { account } = useAccount()
  const { state } = useLearnerProfile()
  const profile = state.kind === 'ready' ? state.profile : null
  const name = profile?.name || account?.name || account?.email || ''
  return (
    <ThingHead
      mark={<Avatar name={name} picture={profile?.avatar ?? null} size="account" />}
      name={name}
      line={account?.email}
    />
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
      <GroupRow label={t('accountPage.role')}>
        <span className="text-muted-foreground">{t(`accountPage.roles.${learner.role}`)}</span>
      </GroupRow>
      <SwitchRow
        label={t('learnerView.label')}
        info={t('learnerView.info')}
        checked={learner.on}
        onCheckedChange={learner.set}
      />
    </Group>
  )
}

/**
 * Signed out (the board's ACC_OUT): the figure of a person, "You are not signed in." and why it
 * matters (or when the account is to be deleted), then Sign in and Create account as rows.
 */
function Guest({ scheduled }: { scheduled: string | null }) {
  const { t } = useTranslation('settings')
  const locale = useLocale()
  return (
    <>
      <div className="flex flex-col items-center gap-2 px-4 pt-6 pb-2 text-center">
        <Avatar name={null} size="account" />
        <p className="text-lg font-bold">{t('accountPage.signedOut')}</p>
        <p role="status" className="max-w-75 text-[0.9375rem] text-pretty text-muted-foreground">
          {scheduled === null
            ? t('accountPage.signedOutWhy')
            : t('accountPage.delete.scheduled', {
                date: dateSaid(scheduled, locale),
              })}
        </p>
      </div>
      <Group flush>
        <RowLink title={t('accountPage.signIn')} render={<Link to="/account/sign-in" />} />
        <RowLink title={t('accountPage.create')} render={<Link to="/account/create" />} />
      </Group>
    </>
  )
}

/**
 * Sign out, on this device (R25): a red row in a group of its own, asking first, its dialog saying
 * what stays; the page then shows the guest.
 */
function SignOut() {
  const { t } = useTranslation('settings')
  const { auth } = useAccount()
  const [open, setOpen] = useState(false)
  return (
    <DangerGroup className="mt-0">
      <DangerRow title={t('accountPage.signOut')} onClick={() => setOpen(true)} />
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={t('accountPage.signOutTitle')}
        body={t('accountPage.signOutInfo')}
        action={t('accountPage.signOut')}
        cancel={t('accountPage.signOutCancel')}
        onConfirm={() => void auth.signOut()}
      />
    </DangerGroup>
  )
}

/**
 * Delete account… (R25): the page's last group, alone 16 below Sign out, a red row; its dialog says
 * the 30 days' grace, the learner types the word to confirm (R17), and the deletion is scheduled.
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
    <DangerGroup className="mt-4">
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
