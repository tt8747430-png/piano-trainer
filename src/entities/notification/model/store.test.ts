// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { createMemoryStorage } from '@/shared/lib'
import { createNotificationsStore, NOTIFICATIONS_STORAGE_KEY, NOTIFICATIONS_VERSION } from './store'
import { noticeOf } from './types'

const LEVEL = noticeOf('level', '4', '2026-11-04T10:00:00.000Z')
const TIER = noticeOf('tier', 'streak:2', '2026-11-03T10:00:00.000Z')

const saved = (state: unknown, version = NOTIFICATIONS_VERSION) => {
  const storage = createMemoryStorage()
  storage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify({ state, version }))
  return storage
}

describe('the notifications store', () => {
  it('reads its version only', () => {
    expect(createNotificationsStore({ storage: saved({ notices: [LEVEL] }) }).getState()).toEqual({
      notices: [LEVEL],
    })
    expect(
      createNotificationsStore({ storage: saved({ notices: [LEVEL] }, 0) }).getState(),
    ).toEqual({ notices: [] })
  })

  it('keeps the notices that read, once, newest first', () => {
    const storage = saved({
      notices: [TIER, LEVEL, LEVEL, { kind: 'cake', ref: '1', at: LEVEL.at }, { ...TIER, at: 'x' }],
    })
    expect(createNotificationsStore({ storage }).getState().notices).toEqual([LEVEL, TIER])
  })

  it('follows another tab', () => {
    const storage = createMemoryStorage()
    const otherTabs = new EventTarget()
    const store = createNotificationsStore({ storage, otherTabs })
    const value = JSON.stringify({ state: { notices: [LEVEL] }, version: NOTIFICATIONS_VERSION })
    storage.setItem(NOTIFICATIONS_STORAGE_KEY, value)
    otherTabs.dispatchEvent(
      new StorageEvent('storage', { key: NOTIFICATIONS_STORAGE_KEY, newValue: value }),
    )
    expect(store.getState().notices).toEqual([LEVEL])
  })
})
