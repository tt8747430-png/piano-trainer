import { Ellipsis } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { GroupMember, LearnerGroup } from '@/shared/api/groups'
import type { NetFailure } from '@/shared/api/network'
import { useGroups } from '@/shared/lib/groups'
import { ActionMenu, SettingsGroup } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { RowsLoading } from './GroupsState'

/** Asking before a member is removed. */
export type MemberAsk = { readonly kind: 'remove'; readonly member: GroupMember }

/** The members as they are read: being read, read, or unread (and why). */
type Read =
  | { readonly kind: 'loading' }
  | { readonly kind: 'failed'; readonly reason: NetFailure }
  | { readonly kind: 'ready'; readonly members: readonly GroupMember[] }

/** Its owner first, then the learner, then the rest in the order they joined. */
const ordered = (members: readonly GroupMember[]) =>
  [...members].sort((a, b) => Number(b.owner) - Number(a.owner) || Number(b.me) - Number(a.me))

/**
 * A group's members (R32-C): each its initial on a paint, its name (Member where it has none), You
 * and Owner where they are; the group's owner removes anyone else from their More, asked first. While
 * they are read, their outlines; unread, what happened and Try again.
 */
export function GroupMembers({
  group,
  onAsk,
}: {
  group: LearnerGroup
  onAsk: (member: GroupMember) => void
}) {
  const { t } = useTranslation('songs')
  const port = useGroups()
  const [read, setRead] = useState<Read>({ kind: 'loading' })
  const [round, setRound] = useState(0)
  useEffect(() => {
    let current = true
    void port.members(group.id).then((answer) => {
      if (!current) return
      setRead(
        answer.ok
          ? { kind: 'ready', members: answer.value }
          : { kind: 'failed', reason: answer.reason },
      )
    })
    return () => {
      current = false
    }
  }, [port, group.id, round])
  const count = read.kind === 'ready' ? read.members.length : group.members
  return (
    <SettingsGroup flush title={`${t('groups.membersTitle')} (${count})`}>
      {read.kind === 'loading' ? (
        <div className="p-3">
          <RowsLoading label={t('groups.loading')} rows={2} />
        </div>
      ) : read.kind === 'failed' ? (
        <div className="flex flex-wrap items-center gap-3 px-4 py-3">
          <p role="alert" className="flex-1 text-muted-foreground">
            {t(read.reason === 'offline' ? 'groups.offline' : 'groups.membersFailed')}
          </p>
          <Button
            variant="soft"
            onClick={() => {
              setRead({ kind: 'loading' })
              setRound((was) => was + 1)
            }}
          >
            {t('groups.retry')}
          </Button>
        </div>
      ) : (
        <ul className="flex flex-col">
          {ordered(read.members).map((member) => {
            const name = member.name.trim() || t('groups.member')
            return (
              <li key={member.userId} className="flex min-h-16 items-center gap-3 px-4 py-2">
                <span
                  aria-hidden
                  className="grid size-10 shrink-0 place-items-center rounded-pill bg-paint-yellow font-display text-lg font-semibold text-on-paint-yellow"
                >
                  {(Array.from(name)[0] ?? '?').toLocaleUpperCase()}
                </span>
                <span className="min-w-0 flex-1 truncate font-medium">
                  {name}
                  {member.me ? (
                    <span className="ms-1.5 font-normal text-muted-foreground">
                      ({t('groups.you')})
                    </span>
                  ) : null}
                </span>
                {member.owner ? (
                  <span className="rounded-pill bg-muted px-2.5 py-0.5 text-sm text-muted-foreground">
                    {t('groups.owner')}
                  </span>
                ) : null}
                {group.mine && !member.owner ? (
                  <ActionMenu
                    label={t('groups.moreFor', { name })}
                    align="end"
                    trigger={<Ellipsis aria-hidden />}
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={t('groups.moreFor', { name })}
                      />
                    }
                    actions={[
                      {
                        key: 'remove',
                        label: t('groups.remove'),
                        destructive: true,
                        onSelect: () => onAsk(member),
                      },
                    ]}
                  />
                ) : null}
              </li>
            )
          })}
        </ul>
      )}
    </SettingsGroup>
  )
}
