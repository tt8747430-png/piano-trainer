import { contentHash } from '@/shared/lib'
import type { ContentKind } from '../content'
import { netResult } from '../network'
import type { ContentDraft, ContentEditingPort, KeptVersion } from './types'

const refused = (message: string) => Object.assign(new Error(message), { status: 403 })

interface Item {
  readonly kind: ContentKind
  readonly id: string
  readonly body: unknown
  readonly meta: Readonly<Record<string, unknown>>
}

const versionOf = (body: unknown) => contentHash(JSON.stringify(body))

/**
 * Editing the content in memory for tests, as the server does: `items` the database's to start with,
 * `editor` whether whoever is signed in edits content, `online` the device's connection. `body`
 * reads an item as published now.
 */
export function createFakeContentEditing({
  items = [],
  editor = () => true,
  online = () => true,
}: {
  items?: readonly Item[]
  editor?: () => boolean
  online?: () => boolean
} = {}): ContentEditingPort & { body(kind: ContentKind, id: string): unknown } {
  const name = (kind: ContentKind, id: string) => `${kind} ${id}`
  const published = new Map(items.map((item) => [name(item.kind, item.id), item]))
  const drafts = new Map<string, ContentDraft>()
  // Created and never published: there for drafts, read by no one.
  const unpublished = new Set<string>()
  const kept = new Map<string, (KeptVersion & Item)[]>()
  let clock = 0
  const now = () => new Date(Date.UTC(2026, 9, 29, 12, clock++)).toISOString()
  const keep = (item: Item) => {
    const list = kept.get(name(item.kind, item.id)) ?? []
    const version = versionOf(item.body)
    if (!list.some((each) => each.version === version))
      list.unshift({ ...item, version, publishedAt: now() })
    kept.set(name(item.kind, item.id), list)
    published.set(name(item.kind, item.id), item)
  }
  for (const item of items) keep(item)
  // Row-level security: anyone else reads no drafts or versions, and writes nothing.
  const read = <T>(run: () => Promise<T>, none: T) =>
    netResult(async () => (editor() ? run() : none), { online })
  const ask = <T>(run: () => Promise<T>) =>
    netResult(
      async () => {
        if (!editor()) throw refused('editors only')
        return run()
      },
      { online },
    )
  return {
    body: (kind, id) => published.get(name(kind, id))?.body,
    published: (kind, id) =>
      ask(async () => {
        const item = published.get(name(kind, id))
        if (!item) throw refused('no such item')
        return item.body
      }),
    create: (kind, id, { body, meta }) =>
      ask(async () => {
        if (published.has(name(kind, id)) || unpublished.has(name(kind, id)))
          throw refused('already there')
        unpublished.add(name(kind, id))
        drafts.set(name(kind, id), { body, meta, updatedAt: now() })
      }),
    draft: (kind, id) => read(async () => drafts.get(name(kind, id)) ?? null, null),
    saveDraft: (kind, id, { body, meta }) =>
      ask(async () => {
        if (!published.has(name(kind, id)) && !unpublished.has(name(kind, id)))
          throw refused('no such item')
        drafts.set(name(kind, id), { body, meta, updatedAt: now() })
      }),
    discardDraft: (kind, id) =>
      ask(async () => {
        drafts.delete(name(kind, id))
      }),
    publish: (kind, id) =>
      ask(async () => {
        const draft = drafts.get(name(kind, id))
        if (!draft) throw refused('nothing to publish')
        keep({ kind, id, body: draft.body, meta: draft.meta })
        unpublished.delete(name(kind, id))
        drafts.delete(name(kind, id))
        return versionOf(draft.body)
      }),
    versions: (kind, id) =>
      read(
        async () =>
          (kept.get(name(kind, id)) ?? []).map(({ version, publishedAt }) => ({
            version,
            publishedAt,
          })),
        [],
      ),
    restore: (kind, id, version) =>
      ask(async () => {
        const found = kept.get(name(kind, id))?.find((each) => each.version === version)
        if (!found) throw refused('nothing to publish')
        published.set(name(kind, id), found)
      }),
  }
}
