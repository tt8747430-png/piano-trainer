/**
 * Where the app's next version stands (Constraints: updates by hand), one state for the banner, the
 * Version row in Settings and the Profile's dot, so they never disagree: `current` (none found, or
 * not looked for yet), `checking`, `ready` (a version waits to be installed), `offline` (a look
 * asked for without the network) or `failed`.
 */
export type UpdateStatus = 'current' | 'checking' | 'ready' | 'offline' | 'failed'

/** What the service worker gives the app: a look for a new version, and the waiting one taken. */
export interface UpdateWorker {
  /** Looks for a new version; resolves whether one now waits. */
  look(): Promise<boolean>
  /** Takes the waiting version and reloads onto it. */
  install(): void
}

export interface AppUpdate {
  status(): UpdateStatus
  subscribe(onChange: () => void): () => void
  /** The worker is registered: looks and installs go to it from now on. */
  connect(worker: UpdateWorker): void
  /** The worker found a waiting version on its own (on return to the screen, on load). */
  found(): void
  /** A look asked for by the learner (the Version row). */
  check(): Promise<void>
  install(): void
}

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
    found: () => set('ready'),
    async check() {
      if (status === 'ready' || status === 'checking') return
      if (!online()) return set('offline')
      if (!worker) return set('current')
      set('checking')
      try {
        set((await worker.look()) ? 'ready' : 'current')
      } catch {
        set(online() ? 'failed' : 'offline')
      }
    },
    install() {
      if (status === 'ready') worker?.install()
    },
  }
}
