/**
 * Where the app's next version stands (Constraints: updates by hand), one state for the banner, the
 * Version row in Settings and the Profile's dot, so they never disagree: `current` (none found, or
 * not looked for yet), `checking`, `downloading` (a version found is still coming down), `ready` (a
 * version waits to be installed), `installing` (taken, the app about to restart), `offline` (a look
 * asked for without the network) or `failed`. No state waits on the browser without an end.
 */
export type UpdateStatus =
  'current' | 'checking' | 'downloading' | 'ready' | 'installing' | 'offline' | 'failed'

/** What a look found: a version waiting, one still downloading, or none. */
export type UpdateFound = 'ready' | 'downloading' | 'none'

/** What the service worker gives the app: a look for a new version, and the waiting one taken. */
export interface UpdateWorker {
  /** Looks for a new version; a download it finds says its end through `found` or `lost`. */
  look(): Promise<UpdateFound>
  /** Takes the waiting version and reloads onto it. */
  install(): void
}

export interface AppUpdate {
  status(): UpdateStatus
  subscribe(onChange: () => void): () => void
  /** The worker is registered: looks and installs go to it from now on. */
  connect(worker: UpdateWorker): void
  /** A version now waits: found on its own (on return to the screen, on load) or downloaded. */
  found(): void
  /** A version that was downloading came to nothing. */
  lost(): void
  /** A look asked for by the learner (the Version row). */
  check(): Promise<void>
  install(): void
}

/** Where a look asks nothing more: one is under way, or a version is coming, waits or is taken. */
const BUSY: ReadonlySet<UpdateStatus> = new Set(['checking', 'downloading', 'ready', 'installing'])

export function createAppUpdate({
  online = () => navigator.onLine,
}: { online?: () => boolean } = {}): AppUpdate {
  let status: UpdateStatus = 'current'
  let worker: UpdateWorker | null = null
  const listeners = new Set<() => void>()
  const set = (next: UpdateStatus) => {
    if (next === status) return
    status = next
    for (const listener of listeners) listener()
  }
  return {
    status: () => status,
    subscribe(onChange) {
      listeners.add(onChange)
      return () => listeners.delete(onChange)
    },
    connect(registered) {
      worker = registered
    },
    found: () => {
      if (status !== 'installing') set('ready')
    },
    lost: () => {
      if (status === 'downloading') set('failed')
    },
    async check() {
      if (BUSY.has(status)) return
      if (!online()) return set('offline')
      if (!worker) return set('current')
      set('checking')
      try {
        const found = await worker.look()
        // A download that ended while the look was answered has said so already.
        if (status === 'checking') set(found === 'none' ? 'current' : found)
      } catch {
        set(online() ? 'failed' : 'offline')
      }
    },
    install() {
      if (status !== 'ready' || !worker) return
      set('installing')
      worker.install()
    },
  }
}
