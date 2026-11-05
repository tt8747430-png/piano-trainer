import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { Ellipsis, Link2, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FOLDER_PICTURE_ICONS, isFolderPicture } from '@/entities/library'
import { useGroupsData } from '@/features/share-folder'
import {
  GROUP_NAME_MAX,
  type GroupMember,
  type LearnerGroup,
  type SharedFolder,
} from '@/shared/api/groups'
import { shareLink } from '@/shared/lib'
import { useGroups } from '@/shared/lib/groups'
import {
  ActionMenu,
  BackButton,
  ConfirmDialog,
  MoreMenu,
  NameField,
  RowButton,
  RowLink,
  ScreenHeader,
  SettingsGroup,
  SwitchRow,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/** What the page asks before: leaving, deleting the group, or removing a member. */
type Asking =
  | { readonly kind: 'leave' }
  | { readonly kind: 'delete' }
  | { readonly kind: 'remove'; readonly member: GroupMember }

/**
 * A group's page (R30 S6): its name with ✎ (its owner renames it in place), its invite link (Copy; its
 * owner turns it on or off), the folders shared with it, and its members, each of whom its owner may
 * remove. More holds Leave group, or Delete group for its owner, each asked first.
 */
export function GroupPage() {
  const { t } = useTranslation('songs')
  const { groupId } = useParams({ from: '/shell/songs/groups/$groupId' })
  const { data, reload } = useGroupsData()
  const group = data.kind === 'ready' ? data.groups.find((each) => each.id === groupId) : undefined
  if (data.kind === 'ready' && !group)
    return (
      <div className="flex flex-col gap-6">
        <ScreenHeader title={t('groups.title')} back={<BackButton />} />
        <p className="text-muted-foreground">{t('groups.notFound')}</p>
      </div>
    )
  if (!group)
    return (
      <div className="flex flex-col gap-6">
        <ScreenHeader title={t('groups.title')} back={<BackButton />} />
        <p className="text-muted-foreground">
          {data.kind === 'failed'
            ? t(data.reason === 'offline' ? 'groups.offline' : 'groups.failed')
            : t('groups.loading')}
        </p>
      </div>
    )
  return (
    <GroupView
      group={group}
      shared={data.kind === 'ready' ? data.shared.filter((each) => each.groupId === group.id) : []}
      onChanged={reload}
    />
  )
}

function GroupView({
  group,
  shared,
  onChanged,
}: {
  group: LearnerGroup
  shared: readonly SharedFolder[]
  onChanged: () => void
}) {
  const { t } = useTranslation('songs')
  const port = useGroups()
  const navigate = useNavigate()
  const [members, setMembers] = useState<readonly GroupMember[]>([])
  const [editing, setEditing] = useState<string | null>(null)
  const [asking, setAsking] = useState<Asking | null>(null)
  const [said, setSaid] = useState<string | null>(null)
  const [round, setRound] = useState(0)
  useEffect(() => {
    let current = true
    void port.members(group.id).then((read) => {
      if (current && read.ok) setMembers(read.value)
    })
    return () => {
      current = false
    }
  }, [port, group.id, round])
  const after = (ok: boolean) => {
    if (!ok) setSaid(t('groups.failed'))
    onChanged()
    setRound((was) => was + 1)
  }
  const done = async () => {
    const name = editing?.trim()
    setEditing(null)
    if (name && name !== group.name) after((await port.rename(group.id, name)).ok)
  }
  const invite = async () => {
    const shared = await shareLink({
      title: t('groups.joinTitle', { name: group.name }),
      path: `/songs/groups/join?code=${group.inviteCode}`,
    })
    if (shared === 'copied') setSaid(t('groups.copied'))
    if (shared === 'failed') setSaid(t('groups.failed'))
  }
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 pb-8">
      <ScreenHeader
        title={group.name}
        back={<BackButton />}
        more={
          editing === null ? (
            <MoreMenu
              actions={[
                group.mine
                  ? {
                      key: 'delete',
                      label: t('groups.delete'),
                      destructive: true,
                      onSelect: () => setAsking({ kind: 'delete' }),
                    }
                  : {
                      key: 'leave',
                      label: t('groups.leave'),
                      destructive: true,
                      onSelect: () => setAsking({ kind: 'leave' }),
                    },
              ]}
            />
          ) : null
        }
        edit={
          group.mine
            ? {
                editing: editing !== null,
                onEdit: () => setEditing(group.name),
                onDone: () => void done(),
              }
            : undefined
        }
      />
      {editing !== null ? (
        <form
          onSubmit={(event) => {
            event.preventDefault()
            void done()
          }}
          className="card p-4"
        >
          <NameField
            label={t('groups.rename')}
            value={editing}
            maxLength={GROUP_NAME_MAX}
            enterKeyHint="done"
            onChange={(event) => setEditing(event.target.value)}
          />
        </form>
      ) : null}
      {said ? (
        <p role="status" className="text-sm text-muted-foreground">
          {said}
        </p>
      ) : null}
      <SettingsGroup flush>
        <RowButton
          icon={Link2}
          paint="sky"
          title={t('groups.invite')}
          detail={t('groups.inviteLine')}
          value={t('groups.copy')}
          disabled={!group.inviteOpen}
          onClick={() => void invite()}
        />
        {group.mine ? (
          <SwitchRow
            label={t('groups.linkOn')}
            checked={group.inviteOpen}
            onCheckedChange={(open) =>
              void port.setInviteOpen(group.id, open).then((r) => after(r.ok))
            }
          />
        ) : null}
      </SettingsGroup>
      <SettingsGroup flush title={t('groups.sharedHere')}>
        {shared.length === 0 ? (
          <p className="px-4 py-3 text-pretty text-muted-foreground">{t('groups.nothingShared')}</p>
        ) : (
          shared.map((folder) => {
            const Icon = isFolderPicture(folder.picture)
              ? FOLDER_PICTURE_ICONS[folder.picture]
              : Users
            return (
              <RowLink
                key={folder.id}
                icon={Icon}
                paint="yellow"
                title={folder.name}
                detail={`${folder.canEdit ? t('groups.canEdit') : t('groups.canView')} · ${t('folder.songCount', { count: folder.songs.length })}`}
                render={
                  <Link to="/songs/shared-folders/$sharedId" params={{ sharedId: folder.id }} />
                }
              />
            )
          })
        )}
      </SettingsGroup>
      <SettingsGroup flush title={t('groups.members', { count: members.length })}>
        {members.map((member) => (
          <div key={member.userId} className="flex min-h-14 items-center gap-3 px-4">
            <span
              aria-hidden
              className="grid size-9 shrink-0 place-items-center rounded-pill bg-paint-yellow font-display font-semibold text-on-paint-yellow"
            >
              {(Array.from(member.name.trim())[0] ?? '?').toLocaleUpperCase()}
            </span>
            <span className="min-w-0 flex-1 truncate font-medium">{member.name || '—'}</span>
            <span className="rounded-pill bg-muted px-2.5 py-0.5 text-sm text-muted-foreground">
              {member.owner ? t('groups.owner') : t('groups.member')}
            </span>
            {group.mine && !member.owner ? (
              <ActionMenu
                label={t('groups.moreFor', { name: member.name })}
                align="end"
                trigger={<Ellipsis aria-hidden />}
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={t('groups.moreFor', { name: member.name })}
                  />
                }
                actions={[
                  {
                    key: 'remove',
                    label: t('groups.remove'),
                    destructive: true,
                    onSelect: () => setAsking({ kind: 'remove', member }),
                  },
                ]}
              />
            ) : null}
          </div>
        ))}
      </SettingsGroup>
      <ConfirmDialog
        open={asking !== null}
        onOpenChange={(open) => {
          if (!open) setAsking(null)
        }}
        title={
          asking?.kind === 'remove'
            ? t('groups.removeTitle', { name: asking.member.name })
            : t(asking?.kind === 'delete' ? 'groups.deleteTitle' : 'groups.leaveTitle', {
                name: group.name,
              })
        }
        body={t(
          asking?.kind === 'remove'
            ? 'groups.removeBody'
            : asking?.kind === 'delete'
              ? 'groups.deleteBody'
              : 'groups.leaveBody',
        )}
        action={t(
          asking?.kind === 'remove'
            ? 'groups.remove'
            : asking?.kind === 'delete'
              ? 'groups.delete'
              : 'groups.leave',
        )}
        onConfirm={() => {
          const was = asking
          setAsking(null)
          if (!was) return
          if (was.kind === 'remove')
            void port.removeMember(group.id, was.member.userId).then((r) => after(r.ok))
          else
            void (was.kind === 'delete' ? port.remove(group.id) : port.leave(group.id)).then(
              (r) => {
                if (r.ok) void navigate({ to: '/songs/groups', replace: true })
                else after(false)
              },
            )
        }}
      />
    </div>
  )
}
