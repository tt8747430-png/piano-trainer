import type { ContentItem } from './cache'
import type { ContentKind } from './port'

let revision = 0
let bodies: ReadonlyMap<string, unknown> = new Map()
let byKind: ReadonlyMap<ContentKind, readonly string[]> = new Map()

/**
 * What this run reads of the database's content (ADR 0116): set once at start, before the first
 * screen reads the catalog, from what the device keeps; each entity overlays it on its own content
 * when it builds its index. Setting it again (a test's) makes them build again; none restores theirs.
 */
export function keepContent(items: readonly ContentItem[]): void {
  bodies = new Map(items.map((item) => [`${item.kind} ${item.id}`, item.body]))
  const ids = new Map<ContentKind, string[]>()
  for (const item of items) ids.set(item.kind, [...(ids.get(item.kind) ?? []), item.id])
  byKind = ids
  revision += 1
}

/**
 * The kept content as it stands: its revision, the body kept for an item, if any, and the ids kept
 * of a kind (an item the app does not have, such as a course an editor made, is found by them).
 */
export function keptContent(): {
  readonly revision: number
  body(kind: ContentKind, id: string): unknown
  ids(kind: ContentKind): readonly string[]
} {
  const held = bodies
  const kinds = byKind
  return {
    revision,
    body: (kind, id) => held.get(`${kind} ${id}`),
    ids: (kind) => kinds.get(kind) ?? [],
  }
}
