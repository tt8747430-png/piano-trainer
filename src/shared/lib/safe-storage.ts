const PROBE_KEY = '__pt_probe__'

/**
 * localStorage when this browser lets us write to it, otherwise memory (private mode, blocked site
 * data). Either way nothing the app does with it can throw: settings then last for the session.
 */
export function safeLocalStorage(): Storage {
  try {
    const storage = window.localStorage
    storage.setItem(PROBE_KEY, PROBE_KEY)
    storage.removeItem(PROBE_KEY)
    return guarded(storage)
  } catch {
    return createMemoryStorage()
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

/** A quota filling up, or access revoked mid-session, loses the write instead of breaking the app. */
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
      } catch {}
    },
  }
}
