import { netResult, type NetOptions } from '../network'
import type { Json, Backend, PianoClient } from '../supabase'
import type { PublicEntry, PublicLibrary, Published } from './types'

const ENTRY = 'id, kind, title, author_name, saves, published_at, meta'
const LIMIT = 100

interface EntryRow {
  readonly id: string
  readonly kind: string
  readonly title: string
  readonly author_name: string
  readonly saves: number
  readonly published_at: string
  readonly meta: Json
}

const text = (value: Json | undefined) => (typeof value === 'string' ? value : undefined)

function entryOf(row: EntryRow): PublicEntry {
  const meta =
    typeof row.meta === 'object' && row.meta !== null && !Array.isArray(row.meta) ? row.meta : {}
  const key = text(meta.key)
  const meter = text(meta.meter)
  const rh = text(meta.rh)
  const lh = text(meta.lh)
  return {
    id: row.id,
    kind: row.kind === 'pattern' ? 'pattern' : 'song',
    title: row.title,
    authorName: row.author_name,
    saves: row.saves,
    publishedAt: row.published_at,
    meta: { ...(key && { key }), ...(meter && { meter }), ...(rh && { rh }), ...(lh && { lh }) },
  }
}

/** A Postgres error thrown with its response's status, so `netResult` reads a 4xx as refused. */
const thrown = (error: { message: string }, status: number) =>
  Object.assign(new Error(error.message), { status })

/** A search typed by the learner, safe inside `ilike`: its own `%` and `_` match themselves. */
const likeOf = (query: string) => `%${query.trim().replace(/[\\%_]/g, (char) => `\\${char}`)}%`

/** The Public library on Supabase (ADR 0116): its tables' row-level security and two functions. */
export function createSupabasePublicLibrary(
  backend: Backend,
  { online }: NetOptions = {},
): PublicLibrary {
  const ask = <T>(run: (client: PianoClient) => Promise<T>) =>
    netResult(async () => run(await backend()), online ? { online } : {})
  const me = async () => {
    const client = await backend()
    const { data } = await client.auth.getSession()
    const user = data.session?.user
    if (!user) throw Object.assign(new Error('Not signed in'), { status: 401 })
    return user.id
  }
  return {
    browse: ({ kind, sort, query }) =>
      ask(async (client) => {
        let request = client.from('public_items').select(ENTRY).eq('kind', kind)
        if (query.trim()) request = request.ilike('title', likeOf(query))
        const { data, error, status } = await request
          .order(sort === 'saved' ? 'saves' : 'published_at', { ascending: false })
          .limit(LIMIT)
        if (error) throw thrown(error, status)
        return data.map(entryOf)
      }),
    item: (id) =>
      ask(async (client) => {
        const { data, error, status } = await client
          .from('public_items')
          .select(`${ENTRY}, body`)
          .eq('id', id)
          .maybeSingle()
        if (error) throw thrown(error, status)
        return data ? { entry: entryOf(data), body: data.body } : null
      }),
    publish: ({ kind, sourceId, title, authorName, meta, body, version }) =>
      ask(async (client) => {
        const author = await me()
        const fields = {
          title,
          author_name: authorName,
          meta: meta as Json,
          body: body as Json,
          version,
        }
        const {
          data: held,
          error: readError,
          status: readStatus,
        } = await client
          .from('public_items')
          .select('id')
          .eq('author_id', author)
          .eq('source_id', sourceId)
          .maybeSingle()
        if (readError) throw thrown(readError, readStatus)
        // An update names only what an author may change: never who wrote it, or whether it is hidden.
        const { data, error, status } = held
          ? await client.from('public_items').update(fields).eq('id', held.id).select('id').single()
          : await client
              .from('public_items')
              .insert({ ...fields, kind, source_id: sourceId })
              .select('id')
              .single()
        if (error) throw thrown(error, status)
        return { sourceId, id: data.id, version }
      }),
    unpublish: (sourceId) =>
      ask(async (client) => {
        const author = await me()
        const { error, status } = await client
          .from('public_items')
          .delete()
          .eq('author_id', author)
          .eq('source_id', sourceId)
        if (error) throw thrown(error, status)
      }),
    mine: () =>
      ask(async (client) => {
        const author = await me()
        const { data, error, status } = await client
          .from('public_items')
          .select('id, source_id, version')
          .eq('author_id', author)
        if (error) throw thrown(error, status)
        return data.map((row): Published => ({
          sourceId: row.source_id,
          id: row.id,
          version: row.version,
        }))
      }),
    save: (id) =>
      ask(async (client) => {
        const { data, error, status } = await client.rpc('save_public_item', { p_item: id })
        if (error) throw thrown(error, status)
        return data
      }),
    report: (id, reason, note) =>
      ask(async (client) => {
        const { error, status } = await client
          .from('public_reports')
          .upsert(
            { item_id: id, reason, note },
            { onConflict: 'item_id,reporter_id', ignoreDuplicates: true },
          )
        if (error) throw thrown(error, status)
      }),
  }
}
