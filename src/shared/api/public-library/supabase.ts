import { netResult, type NetOptions } from '../network'
import type { Json, Backend, PianoClient } from '../supabase'
import {
  DESCRIPTION_MAX,
  isPublicCategory,
  RATED_MIN,
  type PublicEntry,
  type PublicLibrary,
  type PublicRating,
  type Published,
} from './types'

// A song's first line of its chart rides along for its card (`body->sections->0->lines->0`): the
// body itself stays on the server until the item is opened.
const ENTRY =
  'id, kind, title, author_id, saves, published_at, meta, category, opening:body->sections->0->lines->0'
const LIMIT = 100

interface EntryRow {
  readonly id: string
  readonly kind: string
  readonly title: string
  readonly author_id: string
  readonly saves: number
  readonly published_at: string
  readonly meta: Json
  readonly category: string | null
  readonly opening: Json
}

/** What an entry is read with besides its row: its author as public, and its rating. */
interface Around {
  readonly authors: ReadonlyMap<string, { name: string | null; avatar: string | null }>
  readonly ratings: ReadonlyMap<string, PublicRating>
}

/** An uploaded avatar is a storage path (`${userId}/…`); a built-in one, an id without a slash. */
const builtInAvatar = (avatar: string | null) => (avatar && !avatar.includes('/') ? avatar : null)

const text = (value: Json | undefined) => (typeof value === 'string' ? value : undefined)

function entryOf(row: EntryRow, { authors, ratings }: Around): PublicEntry {
  const meta =
    typeof row.meta === 'object' && row.meta !== null && !Array.isArray(row.meta) ? row.meta : {}
  const key = text(meta.key)
  const meter = text(meta.meter)
  const rh = text(meta.rh)
  const lh = text(meta.lh)
  const description = text(meta.description)?.trim().slice(0, DESCRIPTION_MAX)
  const author = authors.get(row.author_id)
  const opening = typeof row.opening === 'string' ? row.opening : undefined
  return {
    id: row.id,
    kind: row.kind === 'pattern' ? 'pattern' : 'song',
    title: row.title,
    authorName: author?.name ?? '',
    authorAvatar: builtInAvatar(author?.avatar ?? null),
    saves: row.saves,
    publishedAt: row.published_at,
    category: isPublicCategory(row.category) ? row.category : null,
    rating: ratings.get(row.id) ?? null,
    ...(opening ? { opening } : {}),
    meta: {
      ...(key && { key }),
      ...(meter && { meter }),
      ...(rh && { rh }),
      ...(lh && { lh }),
      ...(description && { description }),
    },
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
  /** The authors (as public) and the ratings of the rows read, in two reads of their views. */
  const around = async (client: PianoClient, rows: readonly EntryRow[]): Promise<Around> => {
    if (rows.length === 0) return { authors: new Map(), ratings: new Map() }
    const [authors, ratings] = await Promise.all([
      client
        .from('public_authors')
        .select('id, name, avatar')
        .in('id', [...new Set(rows.map((row) => row.author_id))]),
      client
        .from('public_item_ratings')
        .select('item_id, average, count')
        .in(
          'item_id',
          rows.map((row) => row.id),
        ),
    ])
    if (authors.error) throw thrown(authors.error, authors.status)
    if (ratings.error) throw thrown(ratings.error, ratings.status)
    return {
      authors: new Map(
        authors.data.flatMap((row) =>
          row.id ? [[row.id, { name: row.name, avatar: row.avatar }] as const] : [],
        ),
      ),
      ratings: new Map(
        ratings.data.flatMap((row) =>
          row.item_id && row.average !== null && row.count
            ? [[row.item_id, { average: row.average, count: row.count }] as const]
            : [],
        ),
      ),
    }
  }
  /** An uploaded avatar's address, readable while its profile is public; a built-in one's id. */
  const avatarOf = async (client: PianoClient, avatar: string | null) => {
    if (!avatar || !avatar.includes('/')) return avatar
    const { data } = await client.storage.from('avatars').createSignedUrl(avatar, 60 * 60)
    return data?.signedUrl ?? null
  }
  return {
    browse: ({ kind, sort, query, category }) =>
      ask(async (client) => {
        const filtered = () => {
          let request = client.from('public_items').select(ENTRY).eq('kind', kind)
          if (category) request = request.eq('category', category)
          if (query.trim()) request = request.ilike('title', likeOf(query))
          return request
        }
        const { data, error, status } = await filtered()
          .order(sort === 'saved' ? 'saves' : 'published_at', { ascending: false })
          .limit(LIMIT)
        if (error) throw thrown(error, status)
        if (sort !== 'rated') {
          const known = await around(client, data)
          return data.map((row) => entryOf(row, known))
        }
        // Top rated: the best averages over enough ratings first, then the rest by the newest.
        const best = await client
          .from('public_item_ratings')
          .select('item_id')
          .gte('count', RATED_MIN)
          .order('average', { ascending: false })
          .limit(LIMIT)
        if (best.error) throw thrown(best.error, best.status)
        const bestIds = best.data.flatMap((row) => (row.item_id ? [row.item_id] : []))
        const rated =
          bestIds.length === 0
            ? { data: [], error: null, status: 200 }
            : await filtered().in('id', bestIds)
        if (rated.error) throw thrown(rated.error, rated.status)
        const rows = [...rated.data, ...data.filter((row) => !bestIds.includes(row.id))]
        const known = await around(client, rows)
        const score = (row: EntryRow) => {
          const rating = known.ratings.get(row.id)
          return rating && rating.count >= RATED_MIN ? rating.average : -1
        }
        return rows
          .toSorted((a, b) => score(b) - score(a) || b.published_at.localeCompare(a.published_at))
          .slice(0, LIMIT)
          .map((row) => entryOf(row, known))
      }),
    item: (id) =>
      ask(async (client) => {
        const { data, error, status } = await client
          .from('public_items')
          .select(`${ENTRY}, body`)
          .eq('id', id)
          .maybeSingle()
        if (error) throw thrown(error, status)
        if (!data) return null
        const known = await around(client, [data])
        const entry = entryOf(data, known)
        const avatar = await avatarOf(client, known.authors.get(data.author_id)?.avatar ?? null)
        return { entry: { ...entry, authorAvatar: avatar }, body: data.body }
      }),
    publish: ({ kind, sourceId, title, authorName, meta, category, body, version }) =>
      ask(async (client) => {
        const author = await me()
        const fields = {
          title,
          author_name: authorName,
          meta: meta as Json,
          category: kind === 'song' ? (category ?? null) : null,
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
    rate: (id, stars) =>
      ask(async (client) => {
        const { data, error, status } = await client.rpc('rate_public_item', {
          p_item: id,
          p_stars: stars,
        })
        if (error) throw thrown(error, status)
        const [rating] = data
        if (!rating) throw thrown({ message: 'Not found' }, 404)
        return { average: rating.average, count: rating.count }
      }),
    myRating: (id) =>
      ask(async (client) => {
        const { data: session } = await client.auth.getSession()
        if (!session.session) return null
        const { data, error, status } = await client
          .from('public_ratings')
          .select('stars')
          .eq('item_id', id)
          .eq('user_id', session.session.user.id)
          .maybeSingle()
        if (error) throw thrown(error, status)
        return data?.stars ?? null
      }),
  }
}
