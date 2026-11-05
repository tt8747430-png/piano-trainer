import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { GroupInvite } from '@/shared/api/groups'
import { useAccount } from '@/shared/lib/account'
import { useGroups } from '@/shared/lib/groups'
import { BackButton, ButtonLink, ScreenHeader } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/shared/ui/primitives/empty'

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
  const { account } = useAccount()
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
  const shown: Read | { readonly kind: 'guest' } = account ? read : { kind: 'guest' }
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 pb-8">
      <ScreenHeader title={t('groups.title')} back={<BackButton />} />
      <Empty>
        {shown.kind === 'guest' ? (
          <>
            <EmptyHeader>
              <EmptyTitle>{t('groups.guestTitle')}</EmptyTitle>
              <EmptyDescription>{t('groups.guestLine')}</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <ButtonLink render={<Link to="/account/sign-in" />}>{t('groups.signIn')}</ButtonLink>
            </EmptyContent>
          </>
        ) : shown.kind === 'loading' ? (
          <EmptyHeader>
            <EmptyDescription>{t('groups.loading')}</EmptyDescription>
          </EmptyHeader>
        ) : shown.kind === 'gone' ? (
          <EmptyHeader>
            <EmptyTitle>{t('groups.joinGone')}</EmptyTitle>
          </EmptyHeader>
        ) : shown.kind === 'failed' ? (
          <EmptyHeader>
            <EmptyTitle>{t(shown.offline ? 'groups.offline' : 'groups.failed')}</EmptyTitle>
          </EmptyHeader>
        ) : (
          <>
            <EmptyHeader>
              <EmptyTitle>{t('groups.joinTitle', { name: shown.invite.name })}</EmptyTitle>
              <EmptyDescription>
                {t('groups.members', { count: shown.invite.members })}
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button size="lg" disabled={joining} onClick={() => void join()}>
                {t('groups.join')}
              </Button>
            </EmptyContent>
          </>
        )}
      </Empty>
    </div>
  )
}
