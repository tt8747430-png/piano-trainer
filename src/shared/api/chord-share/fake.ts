import type { NetResult } from '../network'
import type { ChordSharePort, LivePlace, OnlineSheet, SheetLineEvents } from './types'

/** Shared chord sheets in memory, every open line on one device hearing the others: for tests and checks. */
export function createFakeChordShare({
  signedIn = true,
}: { signedIn?: boolean } = {}): ChordSharePort {
  const sheets = new Map<string, OnlineSheet & { key: string }>()
  const lines = new Map<string, Set<SheetLineEvents>>()
  let made = 0
  const ok = <T>(value: T): Promise<NetResult<T>> => Promise.resolve({ ok: true, value })
  const refused = <T>(): Promise<NetResult<T>> => Promise.resolve({ ok: false, reason: 'refused' })
  const ping = (id: string, revision: number) =>
    lines.get(id)?.forEach((events) => events.onChanged(revision))
  return {
    share(key, name, content, canEdit) {
      if (!signedIn) return refused()
      const found = [...sheets.entries()].find(([, sheet]) => sheet.key === key)
      made += 1
      const id = found?.[0] ?? `00000000-0000-4000-8000-${String(made).padStart(12, '0')}`
      const revision = (found?.[1].revision ?? 0) + 1
      sheets.set(id, { key, name, ...content, canEdit, revision, mine: true })
      ping(id, revision)
      return ok(id)
    },
    setAccess(id, canEdit) {
      const sheet = sheets.get(id)
      if (!sheet) return refused()
      sheets.set(id, { ...sheet, canEdit, revision: sheet.revision + 1 })
      ping(id, sheet.revision + 1)
      return ok(undefined)
    },
    read: (id) => ok(sheets.get(id) ?? null),
    write(id, content) {
      const sheet = sheets.get(id)
      if (!sheet || (!sheet.canEdit && !sheet.mine)) return refused()
      const revision = sheet.revision + 1
      sheets.set(id, { ...sheet, ...content, revision })
      ping(id, revision)
      return ok(revision)
    },
    open(id, events) {
      const set = lines.get(id) ?? new Set()
      set.add(events)
      lines.set(id, set)
      return {
        sendPlaying: (place: LivePlace | null) =>
          set.forEach((other) => {
            if (other !== events) other.onPlaying(place)
          }),
        close: () => void set.delete(events),
      }
    },
  }
}
