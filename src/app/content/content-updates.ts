import {
  fetchContentUpdates,
  keepContent,
  type ContentCache,
  type ContentKind,
  type ContentRemote,
} from '@/shared/api/content'

/**
 * Reads what the device keeps of the database's content into this run (ADR 0116): once, at start,
 * before the first screen reads the catalog. The content itself stays in its lazy chunks; each
 * entity overlays what is kept when it first builds its index.
 */
export async function applyKeptContent(cache: ContentCache): Promise<number> {
  const items = await cache.all()
  keepContent(items)
  return items.length
}

/**
 * Asks the database for what changed, once the app has painted, and again each time the device
 * comes back online; what it brings is kept for the next start. Returns how to stop.
 */
export function startContentUpdates({
  remote,
  cache,
  tabs = window,
  later = (run) => void setTimeout(run, 3000),
}: {
  remote: ContentRemote
  cache: ContentCache
  tabs?: EventTarget
  /** Runs the first check once the start is over. */
  later?: (run: () => void) => void
}): () => void {
  let versions: ReadonlyMap<string, string> | null = null
  let running = false
  let stopped = false
  const check = async () => {
    if (running || stopped) return
    running = true
    try {
      // The app's own content, hashed once, from its own chunk: never part of the start.
      versions ??= (await import('./export-content')).bundledVersions()
      const known = versions
      const bundled = (kind: ContentKind, id: string) => known.get(`${kind} ${id}`)
      await fetchContentUpdates({ remote, cache, bundled })
    } finally {
      running = false
    }
  }
  const run = () => void check()
  later(run)
  tabs.addEventListener('online', run)
  return () => {
    stopped = true
    tabs.removeEventListener('online', run)
  }
}
