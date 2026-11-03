import type { SyncStatus } from './runner'

/** How long ago, for `Intl.RelativeTimeFormat`: a whole number (0 or less) of its largest unit. */
export interface Ago {
  readonly value: number
  readonly unit: 'minute' | 'hour' | 'day'
}

/** The account card's one line (A15): what the learner needs to know of the sync, one thing. */
export type SyncLine =
  | { readonly kind: 'offline' }
  | { readonly kind: 'failed' }
  | { readonly kind: 'syncing' }
  | { readonly kind: 'waiting'; readonly count: number }
  | { readonly kind: 'synced'; readonly ago: Ago }
  | { readonly kind: 'idle' }

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

/**
 * The sync in one line, the most pressing first: Offline, Last sync failed, Syncing…, the changes
 * waiting, then when it last synced (as Apple's account card says "Synced 2 min ago").
 */
export function syncLine(status: SyncStatus, now: number): SyncLine {
  if (status.state === 'offline') return { kind: 'offline' }
  if (status.state === 'failed') return { kind: 'failed' }
  if (status.state === 'syncing') return { kind: 'syncing' }
  if (status.waiting > 0) return { kind: 'waiting', count: status.waiting }
  if (status.lastSynced === null) return { kind: 'idle' }
  const since = Math.max(0, now - Date.parse(status.lastSynced))
  const ago: Ago =
    since < HOUR
      ? { value: -Math.floor(since / MINUTE), unit: 'minute' }
      : since < DAY
        ? { value: -Math.floor(since / HOUR), unit: 'hour' }
        : { value: -Math.floor(since / DAY), unit: 'day' }
  return { kind: 'synced', ago: { ...ago, value: ago.value === 0 ? 0 : ago.value } }
}
