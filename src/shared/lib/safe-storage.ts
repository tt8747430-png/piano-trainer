const PROBE_KEY = '__pt_probe__'

/** The memory the app keeps its saves in where the browser lets it keep none: one for every store. */
let memory: Storage | null = null

/** Who hears that a save could not be written (the device full): the app says so. */
const failedWrites = new Set<() => void>()

/** Listens for a save that could not be written; returns the function that stops listening. */
export function onFailedWrite(listener: () => void): () => void {
  failedWrites.add(listener)
  return () => void failedWrites.delete(listener)
}

/**
 * localStorage when this browser lets us write to it, otherwise memory (private mode, blocked site
 * data), the same memory for every caller, so a backup reads what the stores keep. Either way nothing
 * the app does with it can throw: settings then last for the session.
 */
export function safeLocalStorage(): Storage {
  try {
    const storage = window.localStorage
    storage.setItem(PROBE_KEY, PROBE_KEY)
    storage.removeItem(PROBE_KEY)
    return guarded(storage)
  } catch {
    memory ??= createMemoryStorage()
    return memory
  }
}

export function createMemoryStorage(): Storage {
  const items = new Map<string, string>()
  return {
    get length() {
      return items.size
    },
    clear: () => items.clear(),
    getItem: (key) => items.get(key) ?? null,
    key: (index) => [...items.keys()][index] ?? null,
    removeItem: (key) => {
      items.delete(key)
    },
    setItem: (key, value) => {
      items.set(key, String(value))
    },
  }
}

/**
 * A quota filling up, or access revoked mid-session, loses the write instead of breaking the app,
 * and says so to who listens (`onFailedWrite`): a take saved there would be gone after a reload.
 */
function guarded(storage: Storage): Storage {
  return {
    get length() {
      return storage.length
    },
    clear: () => {
      try {
        storage.clear()
      } catch {}
    },
    getItem: (key) => {
      try {
        return storage.getItem(key)
      } catch {
        return null
      }
    },
    key: (index) => {
      try {
        return storage.key(index)
      } catch {
        return null
      }
    },
    removeItem: (key) => {
      try {
        storage.removeItem(key)
      } catch {}
    },
    setItem: (key, value) => {
      try {
        storage.setItem(key, value)
      } catch {
        for (const listener of failedWrites) listener()
      }
    },
  }
}
