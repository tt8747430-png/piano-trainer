import { CloudOff, Link2Off, TriangleAlert, UserRound, Users } from 'lucide-react'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { GroupInvite } from '@/shared/api/groups'
import { useAccount } from '@/shared/lib/account'
import { useGroups } from '@/shared/lib/groups'
import { BackButton, ButtonLink, Said, ScreenHeader } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/** An invite link's state: being read, read (its group), off or wrong, or unread. */
type Read =
  | { readonly kind: 'loading' }
  | { readonly kind: 'ready'; readonly invite: GroupInvite }
  | { readonly kind: 'gone' }
  | { readonly kind: 'failed'; readonly offline: boolean }

/**
 * An invite link opened (R30 S6, `/songs/groups/join?code=…`): the group's name and how many it has,
 * and Join. Signed out, Sign in first; a link that is off or wrong says so.
 */
export function JoinGroupPage() {
  const { t } = useTranslation('songs')
  const { code } = useSearch({ from: '/shell/songs/groups/join' })
  const { account, ready } = useAccount()
  const port = useGroups()
  const navigate = useNavigate()
  const [read, setRead] = useState<Read>({ kind: 'loading' })
  const [joining, setJoining] = useState(false)
  useEffect(() => {
    if (!account) return
    let current = true
    void port.invite(code).then((answer) => {
      if (!current) return
      if (!answer.ok) setRead({ kind: 'failed', offline: answer.reason === 'offline' })
      else setRead(answer.value ? { kind: 'ready', invite: answer.value } : { kind: 'gone' })
    })
    return () => {
      current = false
    }
  }, [port, code, account])
  const join = async () => {
    setJoining(true)
    const joined = await port.join(code)
    setJoining(false)
    if (joined.ok)
      void navigate({
        to: '/songs/groups/$groupId',
        params: { groupId: joined.value },
        replace: true,
      })
    else setRead({ kind: 'failed', offline: joined.reason === 'offline' })
  }
  const shown: Read | { readonly kind: 'guest' } = !ready
    ? { kind: 'loading' }
    : account
      ? read
      : { kind: 'guest' }
  return (
    <div className="page-column flex flex-col gap-6 pb-8">
      <ScreenHeader title={t('groups.title')} back={<BackButton />} />
      {shown.kind === 'guest' ? (
        <Said
          icon={UserRound}
          title={t('groups.guestTitle')}
          description={t('groups.guestLine')}
          primary
          action={
            <ButtonLink render={<Link to="/account/sign-in" />}>{t('groups.signIn')}</ButtonLink>
          }
        />
      ) : shown.kind === 'loading' ? (
        <p role="status" className="px-5 py-14 text-center text-muted-foreground">
          {t('groups.loading')}
        </p>
      ) : shown.kind === 'gone' ? (
        <Said icon={Link2Off} title={t('groups.joinGone')} />
      ) : shown.kind === 'failed' ? (
        <Said
          icon={shown.offline ? CloudOff : TriangleAlert}
          title={t(shown.offline ? 'groups.offlineTitle' : 'groups.failedTitle')}
          description={t(shown.offline ? 'groups.offlineLine' : 'groups.failedLine')}
        />
      ) : (
        <Said
          icon={Users}
          title={t('groups.joinTitle', { name: shown.invite.name })}
          description={t('groups.members', { count: shown.invite.members })}
          primary
          action={
            <Button disabled={joining} onClick={() => void join()}>
              {t('groups.join')}
            </Button>
          }
        />
      )}
    </div>
  )
}
