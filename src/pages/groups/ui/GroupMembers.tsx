import { Ellipsis } from 'lucide-react'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import type { GroupMember, LearnerGroup } from '@/shared/api/groups'
import { useLoaded } from '@/shared/lib'
import { useGroups } from '@/shared/lib/groups'
import { ActionMenu, RowsLoading, SettingsGroup } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/** Asking before a member is removed. */
export type MemberAsk = { readonly kind: 'remove'; readonly member: GroupMember }

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
  const { loaded: read, reload } = useLoaded(
    useCallback(() => port.members(group.id), [port, group.id]),
  )
  const count = read.kind === 'ready' ? read.value.length : group.members
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
          <Button variant="soft" onClick={reload}>
            {t('groups.retry')}
          </Button>
        </div>
      ) : (
        <ul className="flex flex-col">
          {ordered(read.value).map((member) => {
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
