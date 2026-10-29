import { contentHash } from '@/shared/lib'
import { isContentKind } from '../content'
import { netResult, type NetOptions } from '../network'
import type { Json, Backend, PianoClient } from '../supabase'
import type { ContentEditingPort } from './types'

// `publish_content`'s own refusals come back as 4xx: editors only a 403, nothing to publish a 404.
const thrown = (error: { message: string }, status: number) =>
  Object.assign(new Error(error.message), { status })

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/** Editing the built-in content on Supabase (ADR 0116, round 6): the drafts table and `publish_content`. */
export function createSupabaseContentEditing(
  backend: Backend,
  { online }: NetOptions = {},
): ContentEditingPort {
  const ask = <T>(run: (client: PianoClient) => Promise<T>) =>
    netResult(async () => run(await backend()), online ? { online } : {})
  const check = ({ error, status }: { error: { message: string } | null; status: number }) => {
    if (error) throw thrown(error, status)
  }
  return {
    published: (kind, id) =>
      ask(async (client) => {
        const { data, error, status } = await client
          .from('content_items')
          .select('body')
          .eq('kind', kind)
          .eq('id', id)
          .single()
        if (error) throw thrown(error, status)
        return data.body as unknown
      }),
    create: (kind, id, { body, meta }) =>
      ask(async (client) => {
        // Unpublished, so learners read nothing of it; the version is a placeholder until it is.
        check(
          await client.from('content_items').insert({
            kind,
            id,
            version: 'draft',
            status: 'draft',
            body: body as Json,
            meta: meta as Json,
          }),
        )
        check(
          await client.from('content_drafts').insert({
            kind,
            id,
            body: body as Json,
            meta: meta as Json,
          }),
        )
      }),
    drafts: () =>
      ask(async (client) => {
        const { data, error, status } = await client
          .from('content_drafts')
          .select('kind, id, meta, updated_at, content_items(status)')
          .order('updated_at', { ascending: false })
        if (error) throw thrown(error, status)
        return data.flatMap((row) =>
          isContentKind(row.kind)
            ? [
                {
                  kind: row.kind,
                  id: row.id,
                  title: isRecord(row.meta) ? row.meta.title : undefined,
                  updatedAt: row.updated_at,
                  published: row.content_items?.status === 'published',
                },
              ]
            : [],
        )
      }),
    draft: (kind, id) =>
      ask(async (client) => {
        const { data, error, status } = await client
          .from('content_drafts')
          .select('body, meta, updated_at')
          .eq('kind', kind)
          .eq('id', id)
          .maybeSingle()
        if (error) throw thrown(error, status)
        return data
          ? {
              body: data.body as unknown,
              meta: isRecord(data.meta) ? data.meta : {},
              updatedAt: data.updated_at,
            }
          : null
      }),
    saveDraft: (kind, id, { body, meta }) =>
      ask(async (client) => {
        check(
          await client.from('content_drafts').upsert({
            kind,
            id,
            body: body as Json,
            meta: meta as Json,
            updated_at: new Date().toISOString(),
          }),
        )
      }),
    discardDraft: (kind, id) =>
      ask(async (client) => {
        check(await client.from('content_drafts').delete().eq('kind', kind).eq('id', id))
      }),
    publish: (kind, id) =>
      ask(async (client) => {
        const { data, error, status } = await client
          .from('content_drafts')
          .select('body')
          .eq('kind', kind)
          .eq('id', id)
          .maybeSingle()
        if (error) throw thrown(error, status)
        if (!data) throw Object.assign(new Error('nothing to publish'), { status: 404 })
        // The version is the body's hash as the database gives it back, as every learner will read it.
        const version = contentHash(JSON.stringify(data.body))
        const published = await client.rpc('publish_content', {
          p_kind: kind,
          p_id: id,
          p_version: version,
        })
        check(published)
        // Published stands if letting the draft go fails: the next save writes over it.
        await client.from('content_drafts').delete().eq('kind', kind).eq('id', id)
        return version
      }),
    versions: (kind, id) =>
      ask(async (client) => {
        const { data, error, status } = await client
          .from('content_versions')
          .select('version, published_at')
          .eq('kind', kind)
          .eq('id', id)
          .order('published_at', { ascending: false })
        if (error) throw thrown(error, status)
        return data.map((row) => ({ version: row.version, publishedAt: row.published_at }))
      }),
    restore: (kind, id, version) =>
      ask(async (client) => {
        check(
          await client.rpc('publish_content', {
            p_kind: kind,
            p_id: id,
            p_version: version,
            p_from_version: version,
          }),
        )
      }),
  }
}
