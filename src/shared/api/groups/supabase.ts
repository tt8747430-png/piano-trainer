import { netResult, type NetOptions } from '../network'
import type { Backend, PianoClient } from '../supabase'
import type { GroupMember, GroupsPort, LearnerGroup, SharedFolder } from './types'

const thrown = (error: { message: string }, status: number) =>
  Object.assign(new Error(error.message), { status })

/** A query's answer, its error thrown with its status so the network result can say what failed. */
const answered = <T>({
  data,
  error,
  status,
}: {
  data: T | null
  error: { message: string } | null
  status: number
}) => {
  if (error) throw thrown(error, status)
  if (data === null) throw thrown({ message: 'No answer' }, status)
  return data
}
const done = ({ error, status }: { error: { message: string } | null; status: number }) => {
  if (error) throw thrown(error, status)
}

// Its members' ids, counted here: an embedded `count` is an aggregate, which PostgREST refuses unless
// the project turns aggregates on.
const GROUP =
  'id, name, picture, paint, owner, invite_code, invite_open, learner_group_members(user_id)'

/**
 * The learner's groups on Supabase (R30 S6): `learner_groups`, `learner_group_members` and
 * `shared_folders` under their policies, and the invite functions `learner_group_invite` and
 * `join_learner_group`.
 */
export function createSupabaseGroups(backend: Backend, { online }: NetOptions = {}): GroupsPort {
  const ask = <T>(run: (client: PianoClient, me: string) => Promise<T>) =>
    netResult(
      async () => {
        const client = await backend()
        const { data } = await client.auth.getSession()
        const me = data.session?.user.id
        if (!me) throw thrown({ message: 'Not signed in' }, 401)
        return run(client, me)
      },
      online ? { online } : {},
    )
  const groupOf = (
    row: {
      id: string
      name: string
      picture: string
      paint: string
      owner: string
      invite_code: string
      invite_open: boolean
      learner_group_members: { user_id: string }[]
    },
    me: string,
  ): LearnerGroup => ({
    id: row.id,
    name: row.name,
    picture: row.picture,
    paint: row.paint,
    mine: row.owner === me,
    inviteCode: row.invite_code,
    inviteOpen: row.invite_open,
    members: row.learner_group_members.length,
  })
  return {
    groups: () =>
      ask(async (client, me) =>
        answered(await client.from('learner_groups').select(GROUP).order('created_at')).map((row) =>
          groupOf(row, me),
        ),
      ),
    members: (groupId) =>
      ask(async (client, me) =>
        answered(
          await client
            .from('learner_group_members')
            .select('user_id, name, role')
            .eq('group_id', groupId)
            .order('joined_at'),
        ).map((row): GroupMember => ({
          userId: row.user_id,
          name: row.name,
          owner: row.role === 'owner',
          me: row.user_id === me,
        })),
      ),
    create: (name) =>
      ask(async (client, me) =>
        groupOf(
          answered(
            await client
              .from('learner_groups')
              .insert({ name: name.trim() })
              .select(GROUP)
              .single(),
          ),
          me,
        ),
      ),
    rename: (groupId, name) =>
      ask(async (client) =>
        done(await client.from('learner_groups').update({ name: name.trim() }).eq('id', groupId)),
      ),
    setInviteOpen: (groupId, open) =>
      ask(async (client) =>
        done(await client.from('learner_groups').update({ invite_open: open }).eq('id', groupId)),
      ),
    remove: (groupId) =>
      ask(async (client) => done(await client.from('learner_groups').delete().eq('id', groupId))),
    leave: (groupId) =>
      ask(async (client, me) =>
        done(
          await client
            .from('learner_group_members')
            .delete()
            .eq('group_id', groupId)
            .eq('user_id', me),
        ),
      ),
    removeMember: (groupId, userId) =>
      ask(async (client) =>
        done(
          await client
            .from('learner_group_members')
            .delete()
            .eq('group_id', groupId)
            .eq('user_id', userId),
        ),
      ),
    invite: (code) =>
      ask(async (client) => {
        const rows = answered(await client.rpc('learner_group_invite', { p_code: code }))
        return rows[0] ?? null
      }),
    join: (code) =>
      ask(async (client) => answered(await client.rpc('join_learner_group', { p_code: code }))),
    shared: () =>
      ask(async (client, me) => {
        const rows = answered(
          await client
            .from('shared_folders')
            .select(
              'id, group_id, owner, folder_key, name, picture, paint, can_edit, songs, updated_at',
            )
            .order('updated_at', { ascending: false }),
        )
        // Who shared each, as their groups name them.
        const owners = [...new Set(rows.map((row) => row.owner))]
        const named =
          owners.length === 0
            ? []
            : answered(
                await client
                  .from('learner_group_members')
                  .select('user_id, name')
                  .in('user_id', owners),
              )
        const nameOf = new Map(named.map((row) => [row.user_id, row.name]))
        return rows.map((row): SharedFolder => ({
          id: row.id,
          groupId: row.group_id,
          folderKey: row.folder_key,
          name: row.name,
          picture: row.picture,
          paint: row.paint,
          songs: Array.isArray(row.songs) ? row.songs : [],
          canEdit: row.can_edit,
          mine: row.owner === me,
          ownerName: nameOf.get(row.owner) ?? '',
          updatedAt: row.updated_at,
        }))
      }),
    share: (groupId, folder, canEdit) =>
      ask(async (client) =>
        done(
          await client.from('shared_folders').upsert(
            {
              group_id: groupId,
              folder_key: folder.folderKey,
              name: folder.name,
              picture: folder.picture,
              paint: folder.paint,
              songs: [...folder.songs],
              can_edit: canEdit,
            },
            { onConflict: 'group_id,owner,folder_key' },
          ),
        ),
      ),
    unshare: (groupId, folderKey) =>
      ask(async (client, me) =>
        done(
          await client
            .from('shared_folders')
            .delete()
            .eq('group_id', groupId)
            .eq('owner', me)
            .eq('folder_key', folderKey),
        ),
      ),
    writeSongs: (sharedId, songs) =>
      ask(async (client) =>
        done(
          await client
            .from('shared_folders')
            .update({ songs: [...songs] })
            .eq('id', sharedId),
        ),
      ),
  }
}
