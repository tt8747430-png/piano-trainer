/** What the browser keeps for the app on this device, and whether it may clear it (the Storage API). */
export interface DeviceStorage {
  /** Bytes used, and the most the browser allows; null where it does not say. */
  estimate(): Promise<{ readonly used: number; readonly quota: number } | null>
  /** Whether the browser keeps it until the learner clears it, never when short of space. */
  persisted(): Promise<boolean>
  /** Asks the browser to keep it so; resolves to whether it will. */
  persist(): Promise<boolean>
}

/** The browser's, where it has the Storage API; else one that says nothing and keeps nothing safe. */
export function browserDeviceStorage(): DeviceStorage {
  const storage = typeof navigator === 'undefined' ? undefined : navigator.storage
  return {
    estimate: async () => {
      if (!storage?.estimate) return null
      const { usage, quota } = await storage.estimate()
      return usage === undefined || quota === undefined ? null : { used: usage, quota }
    },
    persisted: async () => (storage?.persisted ? storage.persisted() : false),
    persist: async () => (storage?.persist ? storage.persist() : false),
  }
}
