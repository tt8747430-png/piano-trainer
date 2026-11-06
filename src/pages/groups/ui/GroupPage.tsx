import { useNavigate, useParams } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GroupMark, useGroupsData } from '@/features/share-folder'
import { GROUP_NAME_MAX, type LearnerGroup, type SharedFolder } from '@/shared/api/groups'
import { useGroups } from '@/shared/lib/groups'
import { BackButton, ConfirmDialog, MoreMenu, NameField, ScreenHeader } from '@/shared/ui'
import { GroupMembers, type MemberAsk } from './GroupMembers'
import { GroupsState, RowsLoading } from './GroupsState'
import { GroupShared } from './GroupShared'
import { InviteCard } from './InviteCard'

/** What the page asks before: leaving, deleting the group, or removing a member. */
type Asking = { readonly kind: 'leave' } | { readonly kind: 'delete' } | MemberAsk

/**
 * A group's page (R30 S6, R32-C): its bar (its name, ✎ for its owner, renaming it in place; More with
 * Leave group, or Delete group for its owner, each asked first); its picture with how many it has;
 * its invite link; the folders shared with it and Share a folder…; its members. From a laptop's width
 * the head and the invite are the left column, the folders and members the right. While it is being
 * read, failed, offline, or gone, the page says so.
 */
export function GroupPage() {
  const { t } = useTranslation('songs')
  const { groupId } = useParams({ from: '/shell/songs/groups/$groupId' })
  const { data, reload } = useGroupsData()
  const group = data.kind === 'ready' ? data.groups.find((each) => each.id === groupId) : undefined
  if (!group)
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <ScreenHeader title={t('groups.title')} back={<BackButton />} />
        {data.kind === 'loading' ? (
          <RowsLoading label={t('groups.loading')} />
        ) : data.kind === 'ready' ? (
          <p className="text-muted-foreground">{t('groups.groupGone')}</p>
        ) : (
          <GroupsState data={data} onRetry={reload} />
        )}
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
  const [editing, setEditing] = useState<string | null>(null)
  const [asking, setAsking] = useState<Asking | null>(null)
  const [said, setSaid] = useState<string | null>(null)
  const [round, setRound] = useState(0)
  const after = (ok: boolean) => {
    setSaid(ok ? null : t('groups.failed'))
    onChanged()
    setRound((was) => was + 1)
  }
  const done = async () => {
    const name = editing?.trim()
    setEditing(null)
    if (name && name !== group.name) after((await port.rename(group.id, name)).ok)
  }
  const confirm = () => {
    const was = asking
    setAsking(null)
    if (!was) return
    if (was.kind === 'remove')
      void port.removeMember(group.id, was.member.userId).then((r) => after(r.ok))
    else
      void (was.kind === 'delete' ? port.remove(group.id) : port.leave(group.id)).then((r) => {
        if (r.ok) void navigate({ to: '/songs/groups', replace: true })
        else after(false)
      })
  }
  const ask = asking?.kind === 'remove' ? 'remove' : (asking?.kind ?? 'leave')
  return (
    <div className="flex flex-col gap-6 pb-8">
      <ScreenHeader
        title={group.name}
        large
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
      {said ? (
        <p role="alert" className="text-sm text-destructive">
          {said}
        </p>
      ) : null}
      <div className="flex flex-col gap-7 lg:grid lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:items-start lg:gap-x-12">
        <div className="flex flex-col gap-6">
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
          <div className="flex items-center gap-4">
            <GroupMark look={group} />
            <p className="text-muted-foreground">
              {t('groups.members', { count: group.members })}
              {group.mine ? ` · ${t('groups.owner')}` : ''}
            </p>
          </div>
          <InviteCard group={group} onSaid={setSaid} onChanged={after} />
        </div>
        <div className="flex flex-col gap-6">
          <GroupShared group={group} shared={shared} onChanged={onChanged} />
          <GroupMembers
            key={round}
            group={group}
            onAsk={(member) => setAsking({ kind: 'remove', member })}
          />
        </div>
      </div>
      <ConfirmDialog
        open={asking !== null}
        onOpenChange={(open) => {
          if (!open) setAsking(null)
        }}
        title={
          asking?.kind === 'remove'
            ? t('groups.removeTitle', { name: asking.member.name || t('groups.member') })
            : t(ask === 'delete' ? 'groups.deleteTitle' : 'groups.leaveTitle', {
                name: group.name,
              })
        }
        body={t(`groups.${ask}Body`)}
        action={t(`groups.${ask}`)}
        onConfirm={confirm}
      />
    </div>
  )
}
