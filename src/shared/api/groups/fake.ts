import { netResult } from '../network'
import type { Json } from '../supabase'
import type { FolderShare, GroupMember, GroupsPort, LearnerGroup, SharedFolder } from './types'

const refused = (message: string) => Object.assign(new Error(message), { status: 403 })

interface Stored {
  id: string
  owner: string
  name: string
  picture: string
  paint: string
  inviteCode: string
  inviteOpen: boolean
  members: { userId: string; name: string }[]
}

interface StoredShare extends Omit<FolderShare, 'songs'> {
  songs: Json[]
  id: string
  groupId: string
  owner: string
  canEdit: boolean
  updatedAt: string
}

/**
 * The groups in memory for tests, keeping the server's rules (the migration's policies): `who()` is
 * who is signed in, `names` how each is named, `online` the connection.
 */
export function createFakeGroups({
  who = () => 'ana',
  names = { ana: 'Ana', mihai: 'Mihai', ira: 'Ira' },
  online = () => true,
}: {
  who?: () => string | null
  names?: Readonly<Record<string, string>>
  online?: () => boolean
} = {}): GroupsPort & { readonly store: { groups: Stored[]; shares: StoredShare[] } } {
  const store = { groups: [] as Stored[], shares: [] as StoredShare[] }
  let next = 1
  const ask = <T>(run: (me: string) => T) =>
    netResult(
      async () => {
        const me = who()
        if (!me) throw refused('Not signed in')
        return run(me)
      },
      { online },
    )
  const member = (group: Stored, me: string) => group.members.some((each) => each.userId === me)
  const groupOf = (id: string, me: string) => {
    const group = store.groups.find((each) => each.id === id)
    if (!group || !member(group, me)) throw refused('Not a member')
    return group
  }
  const owned = (id: string, me: string) => {
    const group = groupOf(id, me)
    if (group.owner !== me) throw refused('Not its owner')
    return group
  }
  const view = (group: Stored, me: string): LearnerGroup => ({
    id: group.id,
    name: group.name,
    picture: group.picture,
    paint: group.paint,
    mine: group.owner === me,
    inviteCode: group.inviteCode,
    inviteOpen: group.inviteOpen,
    members: group.members.length,
  })
  return {
    store,
    groups: () =>
      ask((me) => store.groups.filter((group) => member(group, me)).map((g) => view(g, me))),
    members: (groupId) =>
      ask((me) =>
        groupOf(groupId, me).members.map((each): GroupMember => ({
          userId: each.userId,
          name: each.name,
          owner: each.userId === groupOf(groupId, me).owner,
          me: each.userId === me,
        })),
      ),
    create: (name) =>
      ask((me) => {
        const group: Stored = {
          id: `group-${next++}`,
          owner: me,
          name: name.trim(),
          picture: 'users',
          paint: 'lilac',
          inviteCode: `code-${next}`,
          inviteOpen: true,
          members: [{ userId: me, name: names[me] ?? '' }],
        }
        store.groups.push(group)
        return view(group, me)
      }),
    rename: (groupId, name) =>
      ask((me) => {
        owned(groupId, me).name = name.trim()
      }),
    setInviteOpen: (groupId, open) =>
      ask((me) => {
        owned(groupId, me).inviteOpen = open
      }),
    remove: (groupId) =>
      ask((me) => {
        owned(groupId, me)
        store.groups = store.groups.filter((each) => each.id !== groupId)
        store.shares = store.shares.filter((each) => each.groupId !== groupId)
      }),
    leave: (groupId) =>
      ask((me) => {
        const group = groupOf(groupId, me)
        if (group.owner === me) throw refused('The owner deletes the group')
        group.members = group.members.filter((each) => each.userId !== me)
      }),
    removeMember: (groupId, userId) =>
      ask((me) => {
        const group = owned(groupId, me)
        group.members = group.members.filter((each) => each.userId !== userId || userId === me)
      }),
    invite: (code) =>
      ask(() => {
        const group = store.groups.find((each) => each.inviteCode === code && each.inviteOpen)
        return group ? { id: group.id, name: group.name, members: group.members.length } : null
      }),
    join: (code) =>
      ask((me) => {
        const group = store.groups.find((each) => each.inviteCode === code && each.inviteOpen)
        if (!group) throw Object.assign(new Error('No such open invite'), { status: 404 })
        if (!member(group, me)) group.members.push({ userId: me, name: names[me] ?? '' })
        return group.id
      }),
    shared: () =>
      ask((me) =>
        store.shares
          .filter((share) => {
            const group = store.groups.find((each) => each.id === share.groupId)
            return group !== undefined && member(group, me)
          })
          .map((share): SharedFolder => ({
            id: share.id,
            groupId: share.groupId,
            folderKey: share.folderKey,
            name: share.name,
            picture: share.picture,
            paint: share.paint,
            songs: share.songs,
            canEdit: share.canEdit,
            mine: share.owner === me,
            ownerName: names[share.owner] ?? '',
            updatedAt: share.updatedAt,
          })),
      ),
    share: (groupId, folder, canEdit) =>
      ask((me) => {
        groupOf(groupId, me)
        const was = store.shares.find(
          (each) =>
            each.groupId === groupId && each.owner === me && each.folderKey === folder.folderKey,
        )
        const at = new Date().toISOString()
        if (was) Object.assign(was, folder, { songs: [...folder.songs], canEdit, updatedAt: at })
        else
          store.shares.push({
            ...folder,
            songs: [...folder.songs],
            id: `share-${next++}`,
            groupId,
            owner: me,
            canEdit,
            updatedAt: at,
          })
      }),
    unshare: (groupId, folderKey) =>
      ask((me) => {
        store.shares = store.shares.filter(
          (each) =>
            !(each.groupId === groupId && each.owner === me && each.folderKey === folderKey),
        )
      }),
    writeSongs: (sharedId, songs) =>
      ask((me) => {
        const share = store.shares.find((each) => each.id === sharedId)
        const group = share && store.groups.find((each) => each.id === share.groupId)
        if (!share || !group || !member(group, me) || !(share.owner === me || share.canEdit))
          throw refused('Not yours to write')
        share.songs = [...songs]
        share.updatedAt = new Date().toISOString()
      }),
  }
}
