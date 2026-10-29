import type { NetResult } from '../network'
import type { ContentCache, ContentItem } from './cache'
import type { ContentKind } from './port'

/** What the database publishes: each item's version, and the bodies asked for. */
export interface ContentRemote {
  versions(): Promise<NetResult<readonly Omit<ContentItem, 'body'>[]>>
  bodies(kind: ContentKind, ids: readonly string[]): Promise<NetResult<readonly ContentItem[]>>
}

const BATCH = 50
const keyOf = (kind: ContentKind, id: string) => `${kind} ${id}`

/**
 * Brings onto the device what the database publishes that differs from the app's own (`bundled`
 * says the version the app carries, if it carries the item) and from what the device keeps; lets go
 * of what the app now carries itself or the database no longer publishes. Returns how many items it
 * brought, or why it could not ask.
 */
export async function fetchContentUpdates({
  remote,
  cache,
  bundled,
}: {
  remote: ContentRemote
  cache: ContentCache
  bundled: (kind: ContentKind, id: string) => string | undefined
}): Promise<NetResult<number>> {
  const published = await remote.versions()
  if (!published.ok) return published
  const kept = new Map((await cache.all()).map((item) => [keyOf(item.kind, item.id), item]))
  const listed = new Map(published.value.map((item) => [keyOf(item.kind, item.id), item]))

  const stale = [...kept.values()].filter((item) => {
    const now = listed.get(keyOf(item.kind, item.id))
    return !now || now.version === bundled(item.kind, item.id)
  })
  if (stale.length > 0) await cache.remove(stale.map((item) => [item.kind, item.id] as const))

  const wanted = published.value.filter(
    ({ kind, id, version }) =>
      version !== bundled(kind, id) && version !== kept.get(keyOf(kind, id))?.version,
  )
  let brought = 0
  for (const kind of new Set(wanted.map((item) => item.kind))) {
    const ids = wanted.filter((item) => item.kind === kind).map((item) => item.id)
    for (let i = 0; i < ids.length; i += BATCH) {
      const bodies = await remote.bodies(kind, ids.slice(i, i + BATCH))
      if (!bodies.ok) return bodies
      await cache.put(bodies.value)
      brought += bodies.value.length
    }
  }
  return { ok: true, value: brought }
}
