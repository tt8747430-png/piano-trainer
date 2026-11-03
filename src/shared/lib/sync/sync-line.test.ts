import { describe, expect, it } from 'vitest'
import { syncLine } from './sync-line'

const NOW = Date.parse('2026-11-03T12:00:00Z')
const status = (state: 'idle' | 'syncing' | 'offline' | 'failed', waiting = 0, last?: string) => ({
  state,
  waiting,
  lastSynced: last ?? null,
})

describe('the account card’s one line of sync (A15)', () => {
  it('says it is offline, whatever waits', () => {
    expect(syncLine(status('offline', 3), NOW)).toEqual({ kind: 'offline' })
  })

  it('says the last sync failed', () => {
    expect(syncLine(status('failed', 1), NOW)).toEqual({ kind: 'failed' })
  })

  it('counts the changes waiting', () => {
    expect(syncLine(status('idle', 2), NOW)).toEqual({ kind: 'waiting', count: 2 })
  })

  it('says it is syncing', () => {
    expect(syncLine(status('syncing', 2), NOW)).toEqual({ kind: 'syncing' })
  })

  it('says when it last synced, in the largest whole unit', () => {
    expect(syncLine(status('idle', 0, '2026-11-03T11:59:40Z'), NOW)).toEqual({
      kind: 'synced',
      ago: { value: 0, unit: 'minute' },
    })
    expect(syncLine(status('idle', 0, '2026-11-03T11:45:00Z'), NOW)).toEqual({
      kind: 'synced',
      ago: { value: -15, unit: 'minute' },
    })
    expect(syncLine(status('idle', 0, '2026-11-03T09:00:00Z'), NOW)).toEqual({
      kind: 'synced',
      ago: { value: -3, unit: 'hour' },
    })
    expect(syncLine(status('idle', 0, '2026-10-31T12:00:00Z'), NOW)).toEqual({
      kind: 'synced',
      ago: { value: -3, unit: 'day' },
    })
  })

  it('is up to date before its first sync', () => {
    expect(syncLine(status('idle'), NOW)).toEqual({ kind: 'idle' })
  })
})
