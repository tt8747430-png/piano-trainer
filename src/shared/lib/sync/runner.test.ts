import { describe, expect, it } from 'vitest'
import { createFakeCloud, type CloudSync } from '@/shared/api/sync'
import { createMemoryStorage } from '../safe-storage'
import { createSyncRunner } from './runner'

const SAVES = [
  { table: 'settings', key: 'pt-settings' },
  { table: 'pieces', key: 'pt-pieces' },
] as const

/** A device: its storage, as its stores write to it, and what it told its stores another tab saved. */
function device(cloud: CloudSync, start = 0) {
  let minute = start
  const storage = createMemoryStorage()
  const announced: string[] = []
  const runner = createSyncRunner({
    cloud,
    saves: SAVES,
    storage,
    announce: (key) => announced.push(key),
    now: () => `2026-10-29T10:${String(minute++).padStart(2, '0')}:00.000Z`,
  })
  const save = (key: string, state: Record<string, unknown>, version = 1) =>
    runner.storage.setItem(key, JSON.stringify({ state, version }))
  const saved = (key: string) => JSON.parse(storage.getItem(key) ?? 'null')
  return { runner, save, saved, announced }
}

describe('a sync', () => {
  it('pushes what this device changed, and another device pulls it into its store', async () => {
    const cloud = createFakeCloud()
    const phone = device(cloud)
    const laptop = device(cloud, 30)
    phone.save('pt-settings', { theme: 'dark', language: 'en' })
    expect(await phone.runner.syncNow()).toBe('synced')
    expect(await laptop.runner.syncNow()).toBe('synced')
    expect(laptop.saved('pt-settings')).toEqual({
      state: { theme: 'dark', language: 'en' },
      version: 1,
    })
    expect(laptop.announced).toEqual(['pt-settings'])
  })

  it('keeps both devices’ changes to one store, a field and an item at a time', async () => {
    const cloud = createFakeCloud()
    const phone = device(cloud)
    const laptop = device(cloud, 30)
    phone.save('pt-pieces', { songs: [{ id: 's1', title: 'One' }], versions: {} })
    await phone.runner.syncNow()
    await laptop.runner.syncNow()
    phone.save('pt-pieces', {
      songs: [
        { id: 's1', title: 'One' },
        { id: 's2', title: 'Two' },
      ],
      versions: {},
    })
    laptop.save('pt-pieces', { songs: [{ id: 's1', title: 'One!' }], versions: { bz5: 'mine' } })
    await phone.runner.syncNow()
    await laptop.runner.syncNow()
    await phone.runner.syncNow()
    const both = {
      state: {
        songs: [
          { id: 's1', title: 'One!' },
          { id: 's2', title: 'Two' },
        ],
        versions: { bz5: 'mine' },
      },
      version: 1,
    }
    expect(laptop.saved('pt-pieces')).toEqual(both)
    expect(phone.saved('pt-pieces')).toEqual(both)
  })

  it('takes the account’s plain values on a device’s first sync, keeping both sides’ items', async () => {
    const cloud = createFakeCloud()
    const laptop = device(cloud, 50)
    laptop.save('pt-settings', { theme: 'dark', records: { a: 1 } })
    await laptop.runner.syncNow()
    // A new phone, its clock later than the laptop's, its settings its defaults and one record.
    const phone = device(cloud, 58)
    phone.save('pt-settings', { theme: 'system', records: { b: 2 } })
    await phone.runner.syncNow()
    expect(phone.saved('pt-settings')).toEqual({
      state: { theme: 'dark', records: { a: 1, b: 2 } },
      version: 1,
    })
  })

  it('pushes nothing it did not change, and leaves alone a store nobody changed', async () => {
    const cloud = createFakeCloud()
    const phone = device(cloud)
    await phone.runner.syncNow()
    expect(cloud.held.size).toBe(0)
    expect(phone.announced).toEqual([])
  })

  it('takes this device’s save over the cloud’s of another app version', async () => {
    const cloud = createFakeCloud()
    const old = device(cloud)
    old.save('pt-settings', { theme: 'dark' }, 1)
    await old.runner.syncNow()
    const updated = device(cloud, 30)
    updated.save('pt-settings', { theme: 'light', titles: 'large' }, 2)
    await updated.runner.syncNow()
    expect(updated.saved('pt-settings')).toEqual({
      state: { theme: 'light', titles: 'large' },
      version: 2,
    })
    expect(cloud.held.get('settings')?.data).toEqual({
      theme: 'light',
      titles: 'large',
      _version: 2,
    })
  })

  it('says offline and keeps its changes for the next sync', async () => {
    let online = false
    const cloud = createFakeCloud({ online: () => online })
    const phone = device(cloud)
    phone.save('pt-settings', { theme: 'dark' })
    expect(await phone.runner.syncNow()).toBe('offline')
    online = true
    expect(await phone.runner.syncNow()).toBe('synced')
    expect(cloud.held.get('settings')?.data).toEqual({ theme: 'dark', _version: 1 })
  })

  it('runs one sync at a time: a request while one runs joins it', async () => {
    const cloud = createFakeCloud()
    const phone = device(cloud)
    phone.save('pt-settings', { theme: 'dark' })
    const [first, second] = await Promise.all([phone.runner.syncNow(), phone.runner.syncNow()])
    expect([first, second]).toEqual(['synced', 'synced'])
  })
})

describe('a sync’s state', () => {
  it('counts the stores waiting, says when it syncs, and when it last did', async () => {
    const cloud = createFakeCloud()
    const phone = device(cloud)
    const seen: string[] = []
    phone.runner.subscribe(() => seen.push(phone.runner.status().state))
    expect(phone.runner.status()).toEqual({ state: 'idle', waiting: 0, lastSynced: null })
    phone.save('pt-settings', { theme: 'dark' })
    phone.save('pt-pieces', { songs: [] })
    expect(phone.runner.status().waiting).toBe(2)
    await phone.runner.syncNow()
    expect(phone.runner.status()).toMatchObject({ state: 'idle', waiting: 0 })
    expect(phone.runner.status().lastSynced).not.toBeNull()
    expect(seen).toContain('syncing')
  })

  it('tells who listens of each change a store saves, until they stop', () => {
    const phone = device(createFakeCloud())
    let heard = 0
    const stop = phone.runner.onChange(() => heard++)
    phone.save('pt-settings', { theme: 'dark' })
    stop()
    phone.save('pt-settings', { theme: 'light' })
    expect(heard).toBe(1)
  })

  it('remembers it was offline until a sync gets through', async () => {
    let online = false
    const phone = device(createFakeCloud({ online: () => online }))
    phone.save('pt-settings', { theme: 'dark' })
    await phone.runner.syncNow()
    expect(phone.runner.status().state).toBe('offline')
    online = true
    await phone.runner.syncNow()
    expect(phone.runner.status().state).toBe('idle')
  })
})

describe('a sync runner opened on a device with changes waiting', () => {
  it('counts them from the start', () => {
    const cloud = createFakeCloud()
    const storage = createMemoryStorage()
    const first = createSyncRunner({ cloud, saves: SAVES, storage, announce: () => {} })
    first.storage.setItem('pt-settings', JSON.stringify({ state: { theme: 'dark' }, version: 1 }))
    const reopened = createSyncRunner({ cloud, saves: SAVES, storage, announce: () => {} })
    expect(reopened.status().waiting).toBe(1)
  })
})
