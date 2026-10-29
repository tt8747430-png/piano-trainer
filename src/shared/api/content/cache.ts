import type { ContentKind } from './port'

/** A content item as the database publishes it, kept on the device (ADR 0116). */
export interface ContentItem {
  readonly kind: ContentKind
  readonly id: string
  readonly version: string
  readonly body: unknown
}

/**
 * The content brought onto the device: what the database published that differs from the app's
 * own, kept until the next start applies it. Every call settles: a device without IndexedDB, or
 * whose store is blocked, keeps nothing.
 */
export interface ContentCache {
  all(): Promise<readonly ContentItem[]>
  put(items: readonly ContentItem[]): Promise<void>
  remove(keys: readonly (readonly [ContentKind, string])[]): Promise<void>
}

const DATABASE = 'pt-content'
const STORE = 'items'

/** The cache kept in memory: a test's, or a device that cannot keep one. */
export function createMemoryContentCache(items: readonly ContentItem[] = []): ContentCache {
  const held = new Map(items.map((item) => [`${item.kind} ${item.id}`, item]))
  return {
    all: async () => [...held.values()],
    put: async (more) => {
      for (const item of more) held.set(`${item.kind} ${item.id}`, item)
    },
    remove: async (keys) => {
      for (const [kind, id] of keys) held.delete(`${kind} ${id}`)
    },
  }
}

const answered = <T>(request: IDBRequest<T>) =>
  new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })

const committed = (transaction: IDBTransaction) =>
  new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error)
    transaction.onabort = () => reject(transaction.error)
  })

function open(factory: IDBFactory): Promise<IDBDatabase> {
  const request = factory.open(DATABASE, 1)
  request.onupgradeneeded = () => {
    request.result.createObjectStore(STORE, { keyPath: ['kind', 'id'] })
  }
  return answered(request)
}

/** The cache in the browser's IndexedDB (`pt-content`), or in memory where there is none. */
export function createBrowserContentCache(
  factory: IDBFactory | undefined = globalThis.indexedDB,
): ContentCache {
  if (!factory) return createMemoryContentCache()
  let opened: Promise<IDBDatabase> | null = null
  const database = () => (opened ??= open(factory))
  const settle = async <T>(run: () => Promise<T>, otherwise: T): Promise<T> => {
    try {
      return await run()
    } catch {
      return otherwise
    }
  }
  return {
    all: () =>
      settle(async () => {
        const store = (await database()).transaction(STORE).objectStore(STORE)
        return (await answered(store.getAll())) as ContentItem[]
      }, []),
    put: (items) =>
      settle(async () => {
        const transaction = (await database()).transaction(STORE, 'readwrite')
        for (const item of items) transaction.objectStore(STORE).put(item)
        await committed(transaction)
      }, undefined),
    remove: (keys) =>
      settle(async () => {
        const transaction = (await database()).transaction(STORE, 'readwrite')
        for (const [kind, id] of keys) transaction.objectStore(STORE).delete([kind, id])
        await committed(transaction)
      }, undefined),
  }
}
