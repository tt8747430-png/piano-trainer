import type { AccountRole } from '../auth'
import { netResult, type NetOptions } from '../network'
import type { Json, PianoClient } from '../supabase'
import type { AdminAccount, AdminPort, FeaturesPort, Report } from './types'

const thrown = (error: { message: string }, status: number) =>
  Object.assign(new Error(error.message), { status })

/** An Edge Function's error, with the status its response had: a 4xx is a refusal. */
async function functionError(error: unknown): Promise<Error> {
  const context = error instanceof Object && 'context' in error ? error.context : undefined
  if (context instanceof Response) {
    const answer: unknown = await context.json().catch(() => ({}))
    const message =
      answer instanceof Object && 'error' in answer && typeof answer.error === 'string'
        ? answer.error
        : 'The admin function failed'
    return Object.assign(new Error(message), { status: context.status })
  }
  return error instanceof Error ? error : new Error('The admin function failed')
}

/** The admin's tools on Supabase (ADR 0116): the `admin` function for accounts, the tables for the rest. */
export function createSupabaseAdmin(client: PianoClient, { online }: NetOptions = {}): AdminPort {
  const ask = <T>(run: () => Promise<T>) => netResult(run, online ? { online } : {})
  const invoke = async <T>(body: Record<string, unknown>): Promise<T> => {
    const { data, error } = await client.functions.invoke<T>('admin', { body })
    if (error || data === null) throw await functionError(error)
    return data
  }
  /** Writes what the admin did to the log; a change that went through stands if its line does not. */
  const note = async (action: string, target: string, detail: Json = {}) => {
    const { data } = await client.auth.getSession()
    const admin = data.session?.user.id
    if (admin) await client.from('admin_log').insert({ admin_id: admin, action, target, detail })
  }
  const check = ({ error, status }: { error: { message: string } | null; status: number }) => {
    if (error) throw thrown(error, status)
  }
  return {
    accounts: (query) =>
      ask(
        async () =>
          (await invoke<{ accounts: AdminAccount[] }>({ action: 'list-accounts', query })).accounts,
      ),
    setRole: (userId, role: AccountRole) =>
      ask(async () => {
        await invoke({ action: 'set-role', userId, role })
      }),
    groups: () =>
      ask(async () => {
        const { data, error, status } = await client
          .from('groups')
          .select('id, name, group_members(user_id)')
          .order('name')
        if (error) throw thrown(error, status)
        return data.map((group) => ({
          id: group.id,
          name: group.name,
          members: group.group_members.map((member) => member.user_id),
        }))
      }),
    createGroup: (name) =>
      ask(async () => {
        const { data, error, status } = await client
          .from('groups')
          .insert({ name })
          .select('id, name')
          .single()
        if (error) throw thrown(error, status)
        await note('create-group', name)
        return { ...data, members: [] }
      }),
    deleteGroup: (id) =>
      ask(async () => {
        check(await client.from('groups').delete().eq('id', id))
        await note('delete-group', id)
      }),
    setMember: (groupId, userId, member) =>
      ask(async () => {
        check(
          member
            ? await client
                .from('group_members')
                .upsert({ group_id: groupId, user_id: userId }, { ignoreDuplicates: true })
            : await client
                .from('group_members')
                .delete()
                .eq('group_id', groupId)
                .eq('user_id', userId),
        )
        await note(member ? 'add-member' : 'remove-member', groupId, { userId })
      }),
    switches: () =>
      ask(async () => {
        const { data, error, status } = await client
          .from('feature_switches')
          .select('key, label, state, groups')
          .order('key')
        if (error) throw thrown(error, status)
        return data.map((row) => ({
          key: row.key,
          label: row.label,
          state:
            row.state === 'everyone' || row.state === 'groups' ? row.state : ('nobody' as const),
          groups: row.groups,
        }))
      }),
    saveSwitch: ({ key, label, state, groups }) =>
      ask(async () => {
        check(
          await client.from('feature_switches').upsert({ key, label, state, groups: [...groups] }),
        )
        await note('save-switch', key, { state })
      }),
    deleteSwitch: (key) =>
      ask(async () => {
        check(await client.from('feature_switches').delete().eq('key', key))
        await note('delete-switch', key)
      }),
    reports: () =>
      ask(async () => {
        const { data, error, status } = await client
          .from('public_reports')
          .select(
            'item_id, reporter_id, reason, note, reported_at, public_items(title, author_id, author_name, hidden)',
          )
          .order('reported_at', { ascending: false })
        if (error) throw thrown(error, status)
        return data.flatMap((row): Report[] =>
          row.public_items
            ? [
                {
                  itemId: row.item_id,
                  itemTitle: row.public_items.title,
                  authorId: row.public_items.author_id,
                  authorName: row.public_items.author_name,
                  hidden: row.public_items.hidden,
                  reporterId: row.reporter_id,
                  reason: row.reason,
                  note: row.note,
                  reportedAt: row.reported_at,
                },
              ]
            : [],
        )
      }),
    hide: (itemId, hidden) =>
      ask(async () => {
        check(await client.rpc('hide_public_item', { p_item: itemId, p_hidden: hidden }))
        await note(hidden ? 'hide' : 'show', itemId)
      }),
    block: (userId) =>
      ask(async () => {
        check(
          await client
            .from('publish_blocks')
            .upsert({ user_id: userId }, { ignoreDuplicates: true }),
        )
        await note('block', userId)
      }),
    dismiss: (itemId, reporterId) =>
      ask(async () => {
        check(
          await client
            .from('public_reports')
            .delete()
            .eq('item_id', itemId)
            .eq('reporter_id', reporterId),
        )
        await note('dismiss', itemId, { reporterId })
      }),
    activity: () =>
      ask(async () => {
        const { data, error, status } = await client
          .from('admin_log')
          .select('at, action, target')
          .order('at', { ascending: false })
          .limit(100)
        if (error) throw thrown(error, status)
        return data
      }),
  }
}

/** The feature switches on for the caller, by `my_features()`. */
export function createSupabaseFeatures(
  client: PianoClient,
  { online }: NetOptions = {},
): FeaturesPort {
  return {
    mine: () =>
      netResult(
        async () => {
          const { data, error, status } = await client.rpc('my_features')
          if (error) throw thrown(error, status)
          return data
        },
        online ? { online } : {},
      ),
  }
}
