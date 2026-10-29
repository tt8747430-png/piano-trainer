import type { ErrorEntry } from '@/shared/api/admin'

/** The reports of one message: how many, on how many screens, and the latest of them. */
export interface ErrorGroup {
  readonly message: string
  readonly count: number
  /** How many screens (paths) it happened on. */
  readonly places: number
  readonly latest: ErrorEntry
}

/** The errors reported, one group a message, the group most recently seen first. */
export function groupErrors(entries: readonly ErrorEntry[]): readonly ErrorGroup[] {
  const byMessage = new Map<string, ErrorEntry[]>()
  for (const entry of entries)
    byMessage.set(entry.message, [...(byMessage.get(entry.message) ?? []), entry])
  return [...byMessage]
    .map(([message, all]) => {
      const latest = all.reduce((a, b) => (b.at > a.at ? b : a))
      return { message, count: all.length, places: new Set(all.map((e) => e.path)).size, latest }
    })
    .sort((a, b) => b.latest.at.localeCompare(a.latest.at))
}
