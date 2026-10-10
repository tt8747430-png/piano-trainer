import { isRecord } from './saved'

/** A persisted store's power to read its save again. */
interface Rehydrates {
  rehydrate(): Promise<void> | void
}

/**
 * Another tab (or the installed app beside a tab) saved under `key`: the store reads the save again,
 * so its own next save carries the other tab's changes instead of writing over them. It follows a
 * save of its own version only: another version's is left to the tab that wrote it. Were tabs of two
 * versions to follow each other's, each would write the save back in its own version and wake the
 * other, for as long as both were open.
 */
export function followOtherTabs(
  store: Rehydrates,
  { key, version }: { key: string; version: number },
  tabs: EventTarget,
): void {
  tabs.addEventListener('storage', (event) => {
    if (!(event instanceof StorageEvent) || event.key !== key) return
    if (versionOf(event.newValue) === version) void store.rehydrate()
  })
}

/** The version a save was written in, where it can be read. */
function versionOf(json: string | null): number | undefined {
  if (json === null) return undefined
  try {
    const saved: unknown = JSON.parse(json)
    return isRecord(saved) && typeof saved.version === 'number' ? saved.version : undefined
  } catch {
    return undefined
  }
}
